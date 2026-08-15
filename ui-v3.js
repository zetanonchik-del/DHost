/* DHost UI v3: bot menus close when tapping outside, no X button. */
(() => {
  const STYLE_ID='dhost-ui-v3-style';
  function style(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent='.bot-actions-close{display:none!important}.bot-actions{padding-top:5px!important}';document.head.appendChild(s)}
  function apply(){style();document.querySelectorAll('.bot-actions-close').forEach(b=>b.remove())}
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();obs.observe(document.body,{childList:true,subtree:true})},{once:true});else{apply();obs.observe(document.body,{childList:true,subtree:true})}
})();