'use strict';
const {createCertificate}=require('./certificate');
function ready(){return Boolean(process.env.META_ACCESS_TOKEN&&process.env.META_PHONE_NUMBER_ID&&process.env.WHATSAPP_CERT_TEMPLATE&&process.env.BASE_URL?.startsWith('https://'))}
async function metaSend(payload){
 const version=process.env.META_GRAPH_VERSION||'v23.0';
 const url=`https://graph.facebook.com/${encodeURIComponent(version)}/${encodeURIComponent(process.env.META_PHONE_NUMBER_ID)}/messages`;
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),15000);
 try{
  const res=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${process.env.META_ACCESS_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});
  const body=await res.json();
  if(!res.ok)throw new Error(`Meta HTTP ${res.status}: ${body.error?.message||'unknown error'}`);
  return body.messages?.[0]?.id||null;
 }finally{clearTimeout(timer)}
}
async function sendCertificate(phone,code,pdfUrl){
 if(!ready())throw new Error('WhatsApp Cloud API is not configured for HTTPS production use');
 return metaSend({messaging_product:'whatsapp',to:phone.replace('+',''),type:'template',template:{name:process.env.WHATSAPP_CERT_TEMPLATE,language:{code:process.env.WHATSAPP_CERT_LANGUAGE||'ar'},components:[{type:'header',parameters:[{type:'document',document:{link:pdfUrl,filename:`ESCAPE-${code}.pdf`}}]},{type:'body',parameters:[{type:'text',text:code}]}]}});
}
async function sendOtp(phone,otp){
 if(!process.env.META_ACCESS_TOKEN||!process.env.META_PHONE_NUMBER_ID||!process.env.WHATSAPP_OTP_TEMPLATE)throw new Error('OTP WhatsApp template not configured');
 return metaSend({messaging_product:'whatsapp',to:phone.replace('+',''),type:'template',template:{name:process.env.WHATSAPP_OTP_TEMPLATE,language:{code:process.env.WHATSAPP_OTP_LANGUAGE||'ar'},components:[{type:'body',parameters:[{type:'text',text:otp}]}]}});
}
module.exports={ready,sendCertificate,sendOtp};
