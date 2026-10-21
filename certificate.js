'use strict';
const PDFDocument=require('pdfkit'),QRCode=require('qrcode'),fs=require('node:fs'),path=require('node:path');
const logo=path.join(__dirname,'public/assets/escape-logo.png');
function findArabicFont(){
 const dir=path.join(__dirname,'node_modules/@fontsource/noto-sans-arabic/files');
 if(fs.existsSync(dir)){
  const names=fs.readdirSync(dir);
  const name=names.find(x=>/arabic-400-normal\.woff$/.test(x))||names.find(x=>/arabic-400-normal\.woff2$/.test(x));
  if(name)return path.join(dir,name);
 }
 return process.env.PDF_ARABIC_FONT||'';
}
function dateString(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?String(v).slice(0,10):d.toLocaleDateString('en-GB',{timeZone:'Asia/Riyadh',day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
async function createCertificate(row,{baseUrl,support}){
 const doc=new PDFDocument({size:'A4',margin:0,info:{Title:`ESCAPE Warranty ${row.code}`,Author:'ESCAPE',Subject:'Digital warranty certificate'}});
 const parts=[];doc.on('data',p=>parts.push(p));
 const done=new Promise((resolve,reject)=>{doc.on('end',()=>resolve(Buffer.concat(parts)));doc.on('error',reject)});
 const W=595,H=842,cyan='#30d5f6',navy='#061323',white='#ffffff',muted='#9ab0c2';
 doc.rect(0,0,W,H).fill(navy);doc.rect(0,0,W,8).fill(cyan);
 doc.image(logo,44,60,{width:198});
 doc.font('Helvetica-Bold').fontSize(12).fillColor(cyan).text('DIGITAL WARRANTY',340,69,{width:210,align:'right'});
 doc.font('Helvetica').fontSize(9).fillColor(muted).text('OFFICIAL CERTIFICATE',340,89,{width:210,align:'right'});
 doc.moveTo(44,137).lineTo(551,137).lineWidth(0.6).strokeColor('#38536b').stroke();
 const font=findArabicFont();
 if(!font||!fs.existsSync(font))throw new Error('Arabic PDF font missing: npm install @fontsource/noto-sans-arabic');
 doc.registerFont('Arabic',font);
 const ar=(text,x,y,w,size=13,color=white)=>doc.font('Arabic').fontSize(size).fillColor(color).text(String(text),x,y,{width:w,align:'right',lineBreak:false});
 ar('شهادة الضمان الإلكتروني',190,181,360,25);
 doc.font('Helvetica-Bold').fontSize(9).fillColor(cyan).text('ESCAPE PROTECTION  /  VERIFIED WARRANTY',44,207,{width:240});
 doc.roundedRect(44,244,507,33,9).fill('#102d42');
 doc.font('Helvetica-Bold').fontSize(10).fillColor('#c5e4f4').text('ESCAPE  ·  WARRANTY CERTIFICATE',44,254,{width:507,align:'center'});
 doc.roundedRect(44,295,507,320,15).fillAndStroke('#0d2436','#245575');
 ar('تفاصيل الضمان',326,312,198,17);
 doc.font('Helvetica-Bold').fontSize(9).fillColor(cyan).text('WARRANTY DETAILS',65,327);
 doc.moveTo(64,357).lineTo(531,357).strokeColor('#375a72').stroke();
 function field(label,value,x,y,w){ar(label,x,y,w,10,muted);doc.font('Helvetica-Bold').fontSize(13).fillColor(white).text(String(value),x,y+25,{width:w,align:x>270?'right':'left',lineBreak:false})}
 field('رمز الضمان',row.code,65,374,218);
 field('المنتج',row.product_key==='thermal'?'THERMAL WINDOW FILM':'WINDSHIELD PROTECTION',306,374,218);
 doc.moveTo(65,442).lineTo(529,442).strokeColor('#375a72').stroke();
 field('تاريخ التركيب والتفعيل',dateString(row.installation_date),65,456,218);
 field('تاريخ انتهاء الضمان',dateString(row.expiry_date),306,456,218);
 doc.moveTo(65,525).lineTo(529,525).strokeColor('#375a72').stroke();
 field('مدة الضمان',`${row.warranty_months_at_activation} MONTHS`,65,540,218);
 field('حالة الضمان',row.status==='active'?'ACTIVE':row.status==='suspended'?'SUSPENDED':'INACTIVE',306,540,218);
 doc.roundedRect(44,632,507,125,15).fillAndStroke('#091d30','#245575');
 const verifyUrl=`${baseUrl}/verify?code=${encodeURIComponent(row.code)}`;
 const qr=await QRCode.toBuffer(verifyUrl,{margin:1,width:116,color:{dark:'#061323',light:'#ffffff'}});
 doc.image(qr,60,642,{width:105});
 ar('التحقق من شهادة الضمان',214,660,306,16);
 ar('امسح الرمز للتحقق من حالة الضمان',208,696,312,10,muted);
 doc.font('Helvetica-Bold').fontSize(9).fillColor(cyan).text('VERIFY YOUR WARRANTY',337,728,{width:182,align:'right'});
 doc.moveTo(44,775).lineTo(551,775).strokeColor('#38536b').stroke();
 doc.font('Helvetica-Bold').fontSize(8).fillColor(white).text('ESCAPE  ·  PREMIUM WINDOW FILM',44,788);
 doc.font('Helvetica').fontSize(8).fillColor(muted).text(`SUPPORT  +${support}`,332,788,{width:219,align:'right'});
 doc.fontSize(7).fillColor(muted).text('Warranty is subject to ESCAPE product terms and conditions.',44,811,{width:507,align:'center'});
 doc.end();return done;
}
module.exports={createCertificate};
