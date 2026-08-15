/* DHost layout settings — authoritative UI for 2+ bots. */
(() => {
  const COL_KEY = 'dhost.botColumns.v4';
  const ORDER_KEY = 'dhost.botOrder.v4';
  const ROOT_ID = 'dhost-layout-settings-root';

  const readJSON = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (_) { return fallback; }
  };
  const readColumns = () => {
    const n = Number(readJSON(COL_KEY, 1));
    return Math.max(1, Math.min(4, Number.isFinite(n) ? n : 1));
  };
  const writeColumns = n => {
    try { localStorage.setItem(COL_KEY, JSON.stringify(n)); } catch (_) {}
  };

  const style = `
    .dhost-layout-settings-root{margin-top:18px}
    .dhost-layout-settings-root .section-label{margin-bottom:7px}
    .dhost-layout-settings-root .dhost-layout-card,.dhost-layout-settings-root .dhost-order-card{margin:0 0 7px}
    .dhost-layout-settings-root .list-row{min-height:55px;padding:0 14px;display:flex;align-items:center}
    .dhost-layout-settings-root .list-row-label{font-weight:600}
    .dhost-layout-columns{margin-left:auto;display:flex;align-items:center;gap:5px}
    .dhost-layout-column{width:32px;height:32px;border:1px solid transparent;border-radius:9px;background:transparent;color:var(--text-faint);font:700 12px var(--font-mono);cursor:pointer;transition:transform .14s,background .15s,border-color .15s,color .15s}
    .dhost-layout-column:hover{background:var(--bg-elevated);color:var(--text)}
    .dhost-layout-column:active{transform:scale(.9)}
    .dhost-layout-column.active{background:var(--blue-bg);border-color:rgba(59,130,246,.35);color:#8eb5ff}
    .dhost-order-row{cursor:pointer!important}
    .dhost-order-row:active{transform:scale(.995);background:var(--bg-card-hover)}
    .dhost-order-arrow{margin-left:auto;color:var(--text-faint);display:flex;align-items:center}
    .dhost-order-arrow svg{width:16px;height:16px}
  `;

  function injectStyle() {
    if (document.getElementById('dhost-layout-settings-style')) return;
    const s=document.createElement('style'); s.id='dhost-layout-settings-style'; s.textContent=style; document.head.appendChild(s);
  }

  function botCount() {
    if (Array.isArray(window.STATE?.bots)) return window.STATE.bots.length;

    const savedOrder = readJSON(ORDER_KEY, []);
    if (Array.isArray(savedOrder) && savedOrder.length) return savedOrder.length;

    const cards = document.querySelectorAll('.home-screen .bot-list > .bot-card').length;
    if (cards) return cards;

    // On the settings screen the home list is not mounted. The subscription
    // card still exposes the number of used slots as "used / total".
    const text = document.querySelector('.screen')?.innerText || '';
    const m = text.match(/(?:Слоты|Slots)\s*\n?\s*(\d+)\s*\/\s*\d+/i);
    return m ? Number(m[1]) : 0;
  }

  function removeCompetingRows() {
    document.querySelectorAll('.layout-setting-row,.layout-order-row,.dhost-layout-section,.dhost-layout-card,.dhost-order-card,#dhost-layout-row,#dhost-order-row').forEach(el=>{
      if (el.closest('#'+ROOT_ID)) return;
      const card=el.closest('.list-card');
      if(card) card.remove(); else el.remove();
    });
  }

  function openOrder() {
    if (typeof window.openReorderScreen === 'function') window.openReorderScreen();
    else if (typeof window.DHOST_REORDER?.open === 'function') window.DHOST_REORDER.open();
  }

  function renderSettingsControls() {
    if (typeof currentScreen !== 'function' || currentScreen() !== 'settings') return;
    injectStyle();

    const count=botCount();
    const existing=document.getElementById(ROOT_ID);
    if(count<2){ if(existing) existing.remove(); removeCompetingRows(); return; }

    if(existing) return;
    removeCompetingRows();

    const cards=[...document.querySelectorAll('.screen > .list-card')];
    const target=cards[cards.length-1];
    if(!target) return;

    const root=document.createElement('div'); root.id=ROOT_ID; root.className='dhost-layout-settings-root';
    const section=document.createElement('div'); section.className='section-label'; section.textContent=LANG==='en'?'Interface':'ИНТЕРФЕЙС';

    const card=document.createElement('div'); card.className='list-card dhost-layout-card';
    const columns=readColumns();
    card.innerHTML=`<div class="list-row"><div class="list-row-label">${LANG==='en'?'In a row':'В ряд'}</div><div class="dhost-layout-columns">${[1,2,3,4].map(n=>`<button type="button" class="dhost-layout-column ${columns===n?'active':''}" data-columns="${n}">${n}</button>`).join('')}</div></div>`;

    const orderCard=document.createElement('div'); orderCard.className='list-card dhost-order-card';
    orderCard.innerHTML=`<button type="button" class="list-row dhost-order-row"><div class="list-row-label">${LANG==='en'?'Change order':'Изменить порядок'}</div><span class="dhost-order-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span></button>`;

    root.append(section,card,orderCard); target.after(root);

    card.querySelectorAll('[data-columns]').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault(); e.stopPropagation();
      const n=Math.max(1,Math.min(4,Number(btn.dataset.columns)||1)); writeColumns(n);
      card.querySelectorAll('[data-columns]').forEach(x=>x.classList.toggle('active',Number(x.dataset.columns)===n));
      document.querySelectorAll('.home-screen .bot-list').forEach(list=>list.style.setProperty('--bot-columns',String(n)));
      if(typeof haptic==='function') haptic('light');
    }));
    orderCard.querySelector('.dhost-order-row').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openOrder();});
  }

  let timer=null;
  function schedule(){if(timer)clearTimeout(timer);timer=setTimeout(()=>{timer=null;renderSettingsControls();},80)}
  const observer=new MutationObserver(schedule);
  function boot(){
    observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
    schedule();
    setInterval(()=>{if(typeof currentScreen==='function'&&currentScreen()==='settings')renderSettingsControls();},500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();