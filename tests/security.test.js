'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {normalizeCode,validCode,normalizePhone,maskedPhone,safeEqual,certToken,verifyCertToken,publicWarranty}=require('../lib');
const root=path.resolve(__dirname,'..');
test('only A-Z followed by a dash and four digits is valid',()=>{
 for(const code of ['A-0000','B-0001','Z-9999','Q-4502'])assert.ok(validCode(code));
 for(const code of ['A-123','A-12345','A_1234','AA-1234','0-1234','أ-1234','A-12A4','A-1234\n'])assert.equal(validCode(code),false);
 assert.equal(normalizeCode(' z-0042 '),'Z-0042');
});
test('normalizes Saudi mobile formats and rejects arbitrary international numbers',()=>{
 for(const value of ['0561739836','561739836','966561739836','+966561739836','+966 56 173 9836'])assert.equal(normalizePhone(value),'+966561739836');
 for(const value of ['+15555555555','+966123','abc',null,1234])assert.equal(normalizePhone(value),null);
});
test('warranty public view never exposes customer phone or WhatsApp consent',()=>{
 const row={code:'Z-4827',name_ar:'عازل حراري',status:'active',installation_date:'2026-10-20',expiry_date:'2031-10-20',warranty_months_at_activation:60,customer_phone:'+966561739836',whatsapp_consent:true};
 const result=publicWarranty(row);
 assert.equal(result.product,'عازل حراري');
 assert.ok(!('customer_phone' in result));
 assert.ok(!('whatsapp_consent' in result));
 assert.equal(maskedPhone(row.customer_phone).includes('1739'),false);
});
test('signed certificate links are bound to exact code and phone',()=>{
 const key='unit-test-secret';const tok=certToken('A-4827','+966561739836',key,30);
 assert.ok(verifyCertToken('A-4827','+966561739836',tok.exp,tok.sig,key));
 assert.equal(verifyCertToken('B-4827','+966561739836',tok.exp,tok.sig,key),false);
 assert.equal(verifyCertToken('A-4827','+966561739837',tok.exp,tok.sig,key),false);
 assert.equal(verifyCertToken('A-4827','+966561739836',tok.exp,tok.sig,'wrong'),false);
 assert.equal(verifyCertToken('A-4827','+966561739836',Date.now()/1000+999999,tok.sig,key),false);
 assert.ok(safeEqual('test','test'));assert.equal(safeEqual('test','tests'),false);
});
test('frontend resources use explicit file routes, no direct access to secrets',()=>{
 const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
 assert.match(server,/for \(const filename of \['styles\.css','app\.js','admin\.css','admin\.js','login\.js'\]\)/);
 assert.doesNotMatch(server,/express\.static\(path\.join\(__dirname,'public\/styles\.css'\)\)/);
 assert.match(server,/app\.get\('\/admin',\(req,res\)=>\{if\(!req\.session\?\.admin\)/);
 assert.match(server,/app\.post\('\/api\/admin\/codes',admin,csrf,/);
 assert.match(server,/app\.use\('\/api\/certificate\/access',limiter\(/);
 assert.equal(fs.existsSync(path.join(root,'.env')),false);
});
test('client and admin dates explicitly use Gregorian calendar',()=>{
 for(const file of ['public/app.js','public/admin.js']){
  const script=fs.readFileSync(path.join(root,file),'utf8');
  assert.match(script,/ar-SA-u-ca-gregory/);
 }
});
