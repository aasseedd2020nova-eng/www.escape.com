'use strict';
require('dotenv').config();
const path=require('node:path'),crypto=require('node:crypto');
const express=require('express'),helmet=require('helmet'),session=require('express-session');
const PgStore=require('connect-pg-simple')(session),{Pool}=require('pg'),bcrypt=require('bcryptjs');
const {rateLimit}=require('express-rate-limit');
const {normalizeCode,validCode,normalizePhone,safeEqual,certToken,verifyCertToken,publicWarranty,maskedPhone}=require('./lib');
const {createCertificate}=require('./certificate');
const whatsapp=require('./whatsapp');
const required=['DATABASE_URL','BASE_URL','SESSION_SECRET','PDF_SIGNING_SECRET','OTP_SECRET','ADMIN_EMAIL','ADMIN_PASSWORD_HASH'];
for(const k of required)if(!process.env[k]||process.env[k].length<8)throw new Error(`Missing or invalid environment variable: ${k}`);
if(!/^\$2[aby]\$/.test(process.env.ADMIN_PASSWORD_HASH))throw new Error('ADMIN_PASSWORD_HASH must be bcrypt');
const prod=process.env.NODE_ENV==='production';
if(prod&&(!process.env.BASE_URL.startsWith('https://')||process.env.SESSION_SECRET.length<32||process.env.PDF_SIGNING_SECRET.length<32||process.env.OTP_SECRET.length<32))throw new Error('Production requires HTTPS BASE_URL and 32+ character secrets');
const BASE=process.env.BASE_URL.replace(/\/$/,'');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:10000,idleTimeoutMillis:30000});
const app=express();app.disable('x-powered-by');if(prod)app.set('trust proxy',Number(process.env.TRUST_PROXY||1));
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'","data:"],fontSrc:["'self'"],connectSrc:["'self'"],formAction:["'self'"],frameAncestors:["'none'"],objectSrc:["'none'"],baseUri:["'none'"]}},hsts:prod}));
app.use(express.json({limit:'16kb',verify:(req,res,buf)=>{if(req.originalUrl.startsWith('/webhooks/meta'))req.rawBody=Buffer.from(buf)}}));
const limiter=(max,windowMs=15*60*1000)=>rateLimit({windowMs,limit:max,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'طلبات كثيرة. حاول لاحقًا.'}});
app.use('/api',limiter(180));app.use('/api/activate',limiter(8,15*60*1000));
app.use('/api/certificate/access',limiter(12,15*60*1000));
app.use('/api/certificate/',limiter(60,15*60*1000));app.use('/api/verify',limiter(25));app.use('/api/phone',limiter(5));app.use('/api/admin/login',limiter(5));
app.use('/api/admin/certificate/',limiter(40,15*60*1000));
const store=new PgStore({pool,tableName:'user_sessions',createTableIfMissing:true,pruneSessionInterval:60*15});
app.use(session({store,name:'escape.sid',secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,rolling:false,cookie:{httpOnly:true,secure:prod,sameSite:'strict',maxAge:8*60*60*1000,path:'/'}}));
app.use((req,res,next)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)){const origin=req.get('origin');if(origin&&origin!==BASE)return res.status(403).json({error:'الطلب غير مسموح.'});const referer=req.get('referer');if(!origin&&referer&&!referer.startsWith(BASE+'/'))return res.status(403).json({error:'الطلب غير مسموح.'});}next()});
const q=(text,params=[])=>pool.query(text,params);
const codeOk=(c)=>validCode(c);
const phoneOk=(v)=>normalizePhone(v);
const fail=(res,status,message)=>res.status(status).json({error:message});
function admin(req,res,next){if(req.session?.admin===true)return next();return fail(res,401,'يجب تسجيل الدخول كمدير.')}
function csrf(req,res,next){if(req.session?.csrf&&typeof req.get('x-csrf-token')==='string'&&safeEqual(req.get('x-csrf-token'),req.session.csrf))return next();return fail(res,403,'رمز الحماية غير صحيح. حدّث الصفحة.')}
function adminLog(action,code,details={}){return q('INSERT INTO public.admin_logs(action,warranty_code,details) VALUES($1,$2,$3)',[action,code,JSON.stringify(details)])}
async function setting(key,fallback=''){const r=await q('SELECT setting_value FROM public.settings WHERE setting_key=$1',[key]);return r.rows[0]?.setting_value||fallback}
const detailsSql=`SELECT w.*,p.name_ar FROM public.warranty_codes w JOIN public.products p ON p.product_key=w.product_key WHERE w.code=$1`;
async function getWarranty(code){return (await q(detailsSql,[code])).rows[0]}
function pdfLink(row,seconds=900){const t=certToken(row.code,row.customer_phone,process.env.PDF_SIGNING_SECRET,seconds);return `${BASE}/api/certificate/${encodeURIComponent(row.code)}.pdf?exp=${t.exp}&sig=${t.sig}`}
function adminRow(row){return {...publicWarranty(row),shopLetter:row.shop_letter,customerPhone:maskedPhone(row.customer_phone),createdAt:row.created_at,activatedAt:row.activated_at,suspensionReason:row.suspension_reason}}
app.use('/assets',express.static(path.join(__dirname,'public/assets'),{maxAge:'7d',immutable:true}));
// Explicit file routes: express.static expects a DIRECTORY, not a filename.
// Restrict frontend assets to these known files; no public access to server code or .env.
for (const filename of ['styles.css','app.js','admin.css','admin.js','login.js']) {
  app.get('/'+filename, (req,res) => {
    res.set('Cache-Control','public, max-age=300');
    res.type(filename.endsWith('.css')?'text/css':'application/javascript');
    res.sendFile(path.join(__dirname,'public',filename));
  });
}
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'public/index.html')));
app.get('/verify',(req,res)=>res.sendFile(path.join(__dirname,'public/index.html')));
app.get('/admin/login',(req,res)=>{res.set('Cache-Control','no-store');res.sendFile(path.join(__dirname,'public/admin-login.html'))});
app.get('/admin',(req,res)=>{if(!req.session?.admin)return res.redirect('/admin/login');res.set('Cache-Control','no-store');return res.sendFile(path.join(__dirname,'private/admin.html'))});
app.get('/api/health',async(req,res)=>{try{await q('SELECT 1');res.json({ok:true})}catch{res.status(503).json({ok:false})}});
app.get('/api/public-config',async(req,res)=>res.json({supportWhatsapp:await setting('support_whatsapp','966561739836'),phoneLookupEnabled:Boolean(process.env.META_ACCESS_TOKEN&&process.env.META_PHONE_NUMBER_ID&&process.env.WHATSAPP_OTP_TEMPLATE)}));
app.post('/api/activate',async(req,res,next)=>{
 try{
  const code=normalizeCode(req.body?.code),phone=phoneOk(req.body?.phone),consent=req.body?.consent===true;
  if(!codeOk(code)||!phone||!consent)return fail(res,400,'أدخل كودًا صحيحًا ورقم جوال سعوديًا ووافق على استلام الشهادة.');
  // Atomic activation and WhatsApp queue insert: either both succeed or neither does.
  const client=await pool.connect();
  try{
    await client.query('BEGIN');
    await client.query('SELECT * FROM public.activate_warranty($1,$2,$3)',[code,phone,true]);
    await client.query('INSERT INTO public.whatsapp_messages(warranty_code,recipient_phone,status) VALUES($1,$2,$3)',[code,phone,'pending']);
    await client.query('COMMIT');
  }catch(e){await client.query('ROLLBACK');if(e.code==='P0001'||e.code==='23514')return fail(res,409,'الكود غير متاح للتفعيل. تأكد منه أو تواصل مع خدمة العملاء.');throw e}
  finally{client.release()}
  const row=await getWarranty(code);
  // No customer data is ever sent to the browser beyond the signed certificate URL.
  res.status(201).json({warranty:publicWarranty(row),pdfUrl:pdfLink(row),whatsapp:whatsapp.ready()?'queued':'not_configured'});
  setImmediate(()=>deliverPending().catch(e=>console.error('WhatsApp worker:',e.message)));
 }catch(e){next(e)}
});
app.get('/api/verify/:code',async(req,res,next)=>{try{const code=normalizeCode(req.params.code);if(!codeOk(code))return fail(res,400,'كود غير صحيح.');const row=await getWarranty(code);if(!row)return fail(res,404,'لا يوجد ضمان بهذا الكود.');res.set('Cache-Control','no-store');res.json({warranty:publicWarranty(row)})}catch(e){next(e)}});
app.post('/api/certificate/access',async(req,res,next)=>{try{
 const code=normalizeCode(req.body?.code),phone=phoneOk(req.body?.phone);
 if(!codeOk(code)||!phone)return fail(res,400,'أدخل الكود ورقم الجوال المرتبط به.');
 const row=await getWarranty(code);
 if(!row||!row.customer_phone||!safeEqual(phone,row.customer_phone))return fail(res,403,'الكود ورقم الجوال غير متطابقين.');
 res.json({pdfUrl:pdfLink(row),warranty:publicWarranty(row)});
 }catch(e){next(e)}});
app.get('/api/certificate/:code.pdf',async(req,res,next)=>{try{
 const code=normalizeCode(req.params.code),row=codeOk(code)?await getWarranty(code):null;
 if(!row||!row.customer_phone||!verifyCertToken(code,row.customer_phone,req.query.exp,req.query.sig,process.env.PDF_SIGNING_SECRET))return fail(res,403,'رابط الشهادة غير صالح أو انتهت صلاحيته.');
 const pdf=await createCertificate(row,{baseUrl:BASE,support:await setting('support_whatsapp','966561739836')});
 res.set({'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="ESCAPE-${code}.pdf"`,'Content-Length':String(pdf.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});res.end(pdf);
 }catch(e){next(e)}});
function otpHash(phone,otp){return crypto.createHmac('sha256',process.env.OTP_SECRET).update(phone+'|'+otp).digest('hex')}
app.post('/api/phone/request',async(req,res,next)=>{try{
 const phone=phoneOk(req.body?.phone);if(!phone)return fail(res,400,'رقم الجوال غير صحيح.');
 if(!process.env.WHATSAPP_OTP_TEMPLATE||!process.env.META_ACCESS_TOKEN)return fail(res,503,'التحقق بالجوال غير متاح حتى اكتمال ربط واتساب. استخدم كود الضمان.');
 const recent=await q('SELECT created_at FROM public.phone_verifications WHERE phone=$1 AND created_at>NOW()-INTERVAL \'5 minutes\' LIMIT 1',[phone]);
 if(recent.rowCount)return fail(res,429,'انتظر خمس دقائق قبل طلب رمز جديد.');
 const otp=String(crypto.randomInt(0,1000000)).padStart(6,'0');
 const record=await q('INSERT INTO public.phone_verifications(phone,otp_hash,expires_at) VALUES($1,$2,NOW()+INTERVAL \'5 minutes\') RETURNING id',[phone,otpHash(phone,otp)]);
 try{await whatsapp.sendOtp(phone,otp)}catch(e){await q('DELETE FROM public.phone_verifications WHERE id=$1',[record.rows[0].id]);return fail(res,503,'تعذر إرسال رمز التحقق الآن. استخدم كود الضمان.');}
 res.json({ok:true,message:'أرسلنا رمز تحقق إلى واتساب.'});
 }catch(e){next(e)}});
app.post('/api/phone/confirm',async(req,res,next)=>{try{
 const phone=phoneOk(req.body?.phone),otp=String(req.body?.otp||'');if(!phone||!/^\d{6}$/.test(otp))return fail(res,400,'بيانات التحقق غير صحيحة.');
 const client=await pool.connect();let good=false;
 try{await client.query('BEGIN');const r=await client.query('SELECT * FROM public.phone_verifications WHERE phone=$1 AND verified_at IS NULL AND expires_at>NOW() AND attempts<5 ORDER BY created_at DESC LIMIT 1 FOR UPDATE',[phone]);
 if(r.rowCount){const row=r.rows[0];good=safeEqual(row.otp_hash,otpHash(phone,otp));await client.query('UPDATE public.phone_verifications SET attempts=attempts+1,verified_at=CASE WHEN $2 THEN NOW() ELSE NULL END WHERE id=$1',[row.id,good]);}await client.query('COMMIT');}
 catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
 if(!good)return fail(res,401,'رمز غير صحيح أو منتهي الصلاحية.');
 req.session.verifiedPhone=phone;req.session.phoneVerifiedUntil=Date.now()+10*60*1000;
 req.session.save(err=>err?next(err):res.json({ok:true}));
 }catch(e){next(e)}});
app.get('/api/phone/warranties',async(req,res,next)=>{try{
 if(!req.session?.verifiedPhone||Date.now()>req.session.phoneVerifiedUntil)return fail(res,401,'يجب تأكيد رقم الجوال أولًا.');
 const r=await q(`SELECT w.*,p.name_ar FROM public.warranty_codes w JOIN public.products p ON p.product_key=w.product_key WHERE w.customer_phone=$1 ORDER BY w.activated_at DESC LIMIT 100`,[req.session.verifiedPhone]);
 res.set('Cache-Control','no-store');res.json({warranties:r.rows.map(x=>({...publicWarranty(x),pdfUrl:pdfLink(x)}))});
 }catch(e){next(e)}});
app.post('/api/admin/login',async(req,res,next)=>{try{
 const email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||'');
 const valid=email===process.env.ADMIN_EMAIL.toLowerCase()&&password.length<300&&await bcrypt.compare(password,process.env.ADMIN_PASSWORD_HASH);
 if(!valid)return fail(res,401,'بيانات الدخول غير صحيحة.');
 req.session.regenerate(err=>{if(err)return next(err);req.session.admin=true;req.session.csrf=crypto.randomBytes(32).toString('hex');req.session.save(err=>err?next(err):res.json({ok:true,csrf:req.session.csrf}))});
 }catch(e){next(e)}});
app.get('/api/admin/session',admin,(req,res)=>{res.set('Cache-Control','no-store');res.json({ok:true,csrf:req.session.csrf})});
app.post('/api/admin/logout',admin,csrf,(req,res,next)=>req.session.destroy(err=>err?next(err):(res.clearCookie('escape.sid'),res.json({ok:true}))));
app.get('/api/admin/dashboard',admin,async(req,res,next)=>{try{
 const [stats,shops,products]=await Promise.all([
 q(`SELECT COUNT(*)::int AS total,COUNT(*) FILTER(WHERE status='unused')::int AS unused,COUNT(*) FILTER(WHERE status='active')::int AS active,COUNT(*) FILTER(WHERE status='suspended')::int AS suspended FROM public.warranty_codes`),
 q('SELECT * FROM public.shop_warranty_summary ORDER BY shop_letter,product_key'),
 q('SELECT product_key,name_ar,warranty_months,is_active FROM public.products ORDER BY product_key')]);
 res.json({stats:stats.rows[0],shops:shops.rows,products:products.rows});
 }catch(e){next(e)}});
app.get('/api/admin/codes',admin,async(req,res,next)=>{try{
 const status=String(req.query.status||''),shop=String(req.query.shop||'').toUpperCase(),product=String(req.query.product||'');
 const r=await q(`SELECT w.*,p.name_ar FROM public.warranty_codes w JOIN public.products p ON p.product_key=w.product_key WHERE ($1='' OR w.status=$1) AND ($2='' OR w.shop_letter=$2) AND ($3='' OR w.product_key=$3) ORDER BY w.created_at DESC,w.code LIMIT 500`,[status,shop,product]);res.json({codes:r.rows.map(adminRow)});
 }catch(e){next(e)}});
app.post('/api/admin/codes',admin,csrf,async(req,res,next)=>{try{
 const code=normalizeCode(req.body?.code),product=String(req.body?.product||'');
 if(!codeOk(code)||!['thermal','glass'].includes(product))return fail(res,400,'اكتب حرفًا إنجليزيًا وشرطة وأربعة أرقام، وحدد المنتج.');
 try{await q('INSERT INTO public.warranty_codes(code,product_key) VALUES($1,$2)',[code,product]);}
 catch(e){if(e.code==='23505')return fail(res,409,'هذا الكود موجود مسبقًا.');throw e}
 res.status(201).json({ok:true,code});
 }catch(e){next(e)}});
app.patch('/api/admin/products/:key',admin,csrf,async(req,res,next)=>{try{
 const key=req.params.key,months=Number(req.body?.months),active=req.body?.active;
 if(!['thermal','glass'].includes(key)||!Number.isInteger(months)||months<1||months>120||typeof active!=='boolean')return fail(res,400,'مدة الضمان يجب أن تكون من شهر إلى 120 شهرًا.');
 const r=await q('UPDATE public.products SET warranty_months=$2,is_active=$3 WHERE product_key=$1 RETURNING product_key,name_ar,warranty_months,is_active',[key,months,active]);
 await adminLog('product_updated',null,{product:key,months,active});res.json({product:r.rows[0]});
 }catch(e){next(e)}});
app.patch('/api/admin/codes/:code',admin,csrf,async(req,res,next)=>{try{
 const code=normalizeCode(req.params.code),status=String(req.body?.status||''),reason=String(req.body?.reason||'').trim();
 if(!codeOk(code)||!['suspended','active','cancelled'].includes(status))return fail(res,400,'طلب غير صحيح.');
 const row=await getWarranty(code);if(!row)return fail(res,404,'الكود غير موجود.');
 if(status==='cancelled'&&row.status!=='unused')return fail(res,409,'الإلغاء متاح للأكواد غير المفعّلة فقط.');
 if(status==='suspended'&&row.status!=='active')return fail(res,409,'يمكن إيقاف ضمان مفعّل فقط.');
 if(status==='active'&&row.status!=='suspended')return fail(res,409,'يمكن استئناف ضمان موقوف فقط.');
 if(status==='suspended'&&(reason.length<5||reason.length>250))return fail(res,400,'اكتب سبب إيقاف واضحًا من 5 إلى 250 حرفًا.');
 await q('UPDATE public.warranty_codes SET status=$2,suspension_reason=$3 WHERE code=$1',[code,status,status==='suspended'?reason:null]);
 await adminLog('admin_status_change',code,{from:row.status,to:status});res.json({ok:true});
 }catch(e){next(e)}});
app.get('/api/admin/settings',admin,async(req,res,next)=>{try{const r=await q('SELECT setting_key,setting_value FROM public.settings WHERE setting_key=$1',['support_whatsapp']);res.json({supportWhatsapp:r.rows[0]?.setting_value||''})}catch(e){next(e)}});
app.patch('/api/admin/settings',admin,csrf,async(req,res,next)=>{try{const phone=String(req.body?.supportWhatsapp||'').replace(/\D/g,'');if(!/^\d{9,15}$/.test(phone))return fail(res,400,'رقم واتساب غير صحيح.');await q(`INSERT INTO public.settings(setting_key,setting_value) VALUES('support_whatsapp',$1) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value,updated_at=NOW()`,[phone]);await adminLog('support_updated',null);res.json({ok:true})}catch(e){next(e)}});
app.get('/api/admin/messages',admin,async(req,res,next)=>{try{const r=await q('SELECT id,warranty_code,status,attempt_count,error_message,created_at FROM public.whatsapp_messages ORDER BY id DESC LIMIT 100');res.json({messages:r.rows})}catch(e){next(e)}});
app.post('/api/admin/messages/:id/retry',admin,csrf,async(req,res,next)=>{try{const id=Number(req.params.id);if(!Number.isSafeInteger(id)||id<1)return fail(res,400,'معرّف غير صحيح.');const r=await q(`UPDATE public.whatsapp_messages SET status='pending',attempt_count=0,error_message=NULL,updated_at=NOW() WHERE id=$1 AND status='failed' RETURNING id`,[id]);if(!r.rowCount)return fail(res,409,'إعادة الإرسال متاحة للرسائل الفاشلة فقط.');res.json({ok:true});setImmediate(()=>deliverPending().catch(console.error))}catch(e){next(e)}});
app.get('/api/admin/certificate/:code.pdf',admin,async(req,res,next)=>{try{const code=normalizeCode(req.params.code),row=codeOk(code)?await getWarranty(code):null;if(!row||!row.activated_at)return fail(res,404,'لا توجد شهادة لهذا الكود.');const pdf=await createCertificate(row,{baseUrl:BASE,support:await setting('support_whatsapp','966561739836')});res.set({'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="ESCAPE-${code}.pdf"`,'Cache-Control':'no-store'}).end(pdf)}catch(e){next(e)}});
app.get('/api/admin/logs',admin,async(req,res,next)=>{try{const r=await q('SELECT id,action,warranty_code,created_at FROM public.admin_logs ORDER BY id DESC LIMIT 100');res.json({logs:r.rows})}catch(e){next(e)}});
let delivering=false;
async function deliverPending(){
 if(delivering)return;delivering=true;
 try{
  // Claim a message once. A timed-out call is NOT auto-retried to avoid accidental duplicate sends.
  const rows=await q(`SELECT id,warranty_code,recipient_phone FROM public.whatsapp_messages WHERE status='pending' AND attempt_count=0 ORDER BY id LIMIT 10`);
  for(const msg of rows.rows){
   const claimed=await q(`UPDATE public.whatsapp_messages SET attempt_count=1,updated_at=NOW() WHERE id=$1 AND status='pending' AND attempt_count=0 RETURNING id`,[msg.id]);if(!claimed.rowCount)continue;
   try{const row=await getWarranty(msg.warranty_code);if(!row)throw Error('Warranty not found');const id=await whatsapp.sendCertificate(msg.recipient_phone,row.code,pdfLink(row,3600));await q(`UPDATE public.whatsapp_messages SET status='accepted',provider_message_id=$2,updated_at=NOW() WHERE id=$1`,[msg.id,id]);}
   catch(e){await q(`UPDATE public.whatsapp_messages SET status='failed',error_message=$2,updated_at=NOW() WHERE id=$1`,[msg.id,String(e.message).slice(0,400)]);}
  }
 }finally{delivering=false}
}
// Optional Meta webhook for real delivery status updates. Set webhook to /webhooks/meta.
app.get('/webhooks/meta',(req,res)=>{if(!process.env.META_VERIFY_TOKEN)return res.sendStatus(404);if(req.query['hub.mode']==='subscribe'&&safeEqual(req.query['hub.verify_token']||'',process.env.META_VERIFY_TOKEN))return res.status(200).send(req.query['hub.challenge']);res.sendStatus(403)});
app.post('/webhooks/meta',express.raw({type:'application/json'}),async(req,res)=>{try{
 if(!process.env.META_APP_SECRET)return res.sendStatus(403);
 // express.json() already parsed the body; validate against rawBody captured by verify hook in production.
 if(!req.rawBody)return res.sendStatus(403);
 const signature='sha256='+crypto.createHmac('sha256',process.env.META_APP_SECRET).update(req.rawBody).digest('hex');
 if(!safeEqual(signature,req.get('x-hub-signature-256')||''))return res.sendStatus(403);
 const events=req.body?.entry||[];for(const entry of events)for(const change of entry.changes||[])for(const status of change.value?.statuses||[]){if(!['sent','delivered','read','failed'].includes(status.status))continue;await q('UPDATE public.whatsapp_messages SET status=$2,updated_at=NOW() WHERE provider_message_id=$1',[status.id,status.status]);}
 res.sendStatus(200);
 }catch(e){console.error('Webhook:',e.message);res.sendStatus(500)}});
app.use('/api',(req,res)=>fail(res,404,'الخدمة غير موجودة.'));
app.use((req,res)=>res.status(404).send('Not found'));
app.use((err,req,res,next)=>{console.error('Server error:',err.code||err.message);if(res.headersSent)return next(err);return fail(res,500,'حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.')});
async function main(){await q('SELECT 1');const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`ESCAPE listening on :${port}`));setInterval(()=>deliverPending().catch(e=>console.error('Delivery:',e.message)),60000).unref();}
if(require.main===module)main().catch(e=>{console.error('Startup failed:',e.message);process.exit(1)});
module.exports={app,pool};
