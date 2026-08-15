/* DHost UI v3: close control for compact bot action menus. */
(() => {
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const STYLE_ID = "dhost-ui-v3-style";
  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement("style");s.id=STYLE_ID;s.textContent=`.bot-actions-close{position:absolute;right:5px;top:5px;width:22px;height:22px;border:0;border-radius:7px;background:rgba(255,255,255,.045);color:var(--text-faint);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.14s;z-index:2}.bot-actions-close svg{width:12px;height:12px}.bot-actions-close:hover{color:var(--text);background:rgba(255,255,255,.08)}.bot-actions-close:active{transform:scale(.88)}.bot-actions{padding-top:31px}`;document.head.appendChild(s);
  }
  function apply(){
    style();
    document.querySelectorAll(".bot-actions").forEach(menu=>{
      if(menu.querySelector(".bot-actions-close"))return;
      const b=document.createElement("button");b.className="bot-actions-close";b.type="button";b.setAttribute("aria-label","Закрыть");b.innerHTML=X;b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();if(window.DHOST_UI)window.DHOST_UI.menu=null;render()});menu.appendChild(b);
    });
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{apply();obs.observe(document.body,{childList:true,subtree:true})},{once:true});else{apply();obs.observe(document.body,{childList:true,subtree:true})}
})();
