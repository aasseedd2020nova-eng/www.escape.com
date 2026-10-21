'use strict';
const crypto=require('node:crypto');
const CODE=/^[A-Z]-[0-9]{4}$/;
function normalizeCode(v){return typeof v==='string'?v.trim().toUpperCase():''}
function validCode(v){return CODE.test(v)}
function normalizePhone(v){
 if(typeof v!=='string')return null;
 let s=v.trim().replace(/[\s()\-]/g,'');
 if(/^05\d{8}$/.test(s))return '+966'+s.slice(1);
 if(/^5\d{8}$/.test(s))return '+966'+s;
 if(/^9665\d{8}$/.test(s))return '+'+s;
 if(/^\+9665\d{8}$/.test(s))return s;
 return null;
}
function maskedPhone(p){return p?p.slice(0,5)+'••••'+p.slice(-3):''}
function safeEqual(a,b){const aa=Buffer.from(String(a)),bb=Buffer.from(String(b));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
function signCertificate(code,phone,exp,secret){return crypto.createHmac('sha256',secret).update(`${code}|${phone}|${exp}`).digest('hex')}
function certToken(code,phone,secret,seconds=900){const exp=Math.floor(Date.now()/1000)+seconds;return {exp,sig:signCertificate(code,phone,exp,secret)}}
function verifyCertToken(code,phone,exp,sig,secret){return Number.isSafeInteger(Number(exp))&&Number(exp)>=Math.floor(Date.now()/1000)&&Number(exp)<=Math.floor(Date.now()/1000)+86400&&typeof sig==='string'&&safeEqual(sig,signCertificate(code,phone,exp,secret))}
function publicWarranty(row){return {code:row.code,product:row.name_ar,status:row.status,installationDate:row.installation_date,expiryDate:row.expiry_date,warrantyMonths:row.warranty_months_at_activation}}
module.exports={normalizeCode,validCode,normalizePhone,maskedPhone,safeEqual,signCertificate,certToken,verifyCertToken,publicWarranty};
