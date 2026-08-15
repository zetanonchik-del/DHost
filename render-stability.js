/* DHost stability: live refreshes stay in-place; bot menus are never clipped or delayed. */
(() => {
  const STYLE_ID = 'dhost-stability-style-v3';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #reorder-grid.reorder-grid{grid-template-columns:minmax(0,1fr)!important}
      #reorder-grid .reorder-card{width:100%;box-sizing:border-box}
      .home-screen .bot-list,.home-screen .bot-card{overflow:visible!important}
      .home-screen .bot-card:has(.bot-actions){z-index:1000!important}
      .home-screen .bot-actions{z-index:10000!important}
    `;
    document.head.appendChild(s);
  }

  const home = () => { try { return typeof currentScreen === 'function' && currentScreen() === 'home'; } catch (_) { return false; } };
  const names = () => {
    const q = String(UI?.query || '').trim().toLowerCase(), f = UI?.filter || 'all';
    return (STATE?.bots || []).filter(b => {
      const qok = !q || `${b.name} ${b.unit || ''} ${b.platform || ''}`.toLowerCase().includes(q);
      return qok && (f === 'all' || b.status === f);
    }).map(b => b.name);
  };
  const current = () => [...document.querySelectorAll('.home-screen .bot-list > .bot-card')].map(c => c.dataset.bot || '');
  const cols = () => { try { return Math.max(1, Math.min(4, Number(JSON.parse(localStorage.getItem('dhost.botColumns.v5'))) || 1)); } catch (_) { return 1; } };

  // Menu state is part of the key: opening/closing/switching menus renders immediately.
  // Polling keeps the same key and therefore updates cards in-place without touching the menu.
  const key = () => JSON.stringify({names:names(),columns:cols(),filter:UI?.filter||'all',menu:UI?.menu||null});
  let last = null;

  function updateInPlace(){
    const app=document.getElementById('app'); if(!app?.querySelector('.home-screen')) return false;
    const expected=names(), actual=current();
    if(expected.length!==actual.length || expected.some((n,i)=>n!==actual[i])) return false;
    const bots=new Map((STATE?.bots||[]).map(b=>[b.name,b]));
    document.querySelectorAll('.home-screen .bot-list > .bot-card').forEach(card=>{
      const b=bots.get(card.dataset.bot); if(!b) return;
      const cpu=Math.max(0,Math.min(Number(b.cpu_percent)||0,100));
      const rl=Number(b.ram_limit_mb)||0, ru=Number(b.ram_used_mb)||0, ram=rl?Math.min(ru/rl*100,100):0;
      const status=card.querySelector('.status-pill'); if(status&&typeof statusPill==='function') status.outerHTML=statusPill(b.status);
      const meters=card.querySelectorAll('.meter');
      if(meters[0]){const l=meters[0].querySelector('.meter-label b');const f=meters[0].querySelector('.meter-fill');if(l)l.textContent=`${cpu.toFixed(1)}%`;if(f)f.style.width=`${cpu}%`;}
      if(meters[1]){const l=meters[1].querySelector('.meter-label b');const f=meters[1].querySelector('.meter-fill');if(l)l.textContent=`${Math.round(ru)}/${Math.round(rl)}MB`;if(f)f.style.width=`${ram}%`;}
      const foot=card.querySelectorAll('.bot-card-foot span');
      if(foot[0]&&typeof fmtDate==='function')foot[0].textContent=`${t('created')} ${fmtDate(b.created_at)}`;
      if(foot[1]&&typeof fmtUptime==='function')foot[1].textContent=`${b.platform||'Server'} · ${fmtUptime(b.uptime_seconds)}`;
    });
    const sub=STATE?.subscription, running=(STATE?.bots||[]).filter(b=>b.status==='running').length, installing=(STATE?.bots||[]).filter(b=>b.status==='installing').length, errors=(STATE?.bots||[]).filter(b=>b.status==='error').length;
    const used=sub?.used_slots??STATE?.bots?.length??0, max=sub?.max_slots??STATE?.bots?.length??0, pct=max?Math.min(used/max*100,100):0;
    const count=app.querySelector('.summary-count');if(count)count.innerHTML=`${used}<span> / ${max}</span>`;
    const progress=app.querySelector('.summary-progress > div');if(progress)progress.style.width=`${pct}%`;
    const sf=app.querySelectorAll('.summary-foot span');if(sf[0])sf[0].textContent=`${used} ${LANG==='ru'?'использовано':'used'}`;if(sf[1])sf[1].textContent=`${Math.max(max-used,0)} ${LANG==='ru'?'доступно':'available'}`;
    const stats=app.querySelectorAll('.summary-stat-value');if(stats[0])stats[0].textContent=running;if(stats[1])stats[1].textContent=installing;if(stats[2])stats[2].textContent=errors;
    document.querySelectorAll('.home-screen .bot-list').forEach(list=>list.style.setProperty('--grid-columns',String(Math.min(cols(),actual.length||1))));
    return true;
  }

  function installFastMenu(){
    if(window.__DHOST_FAST_MENU_V1) return;
    const handler = (event) => {
      const button = event.target?.closest?.('.bot-menu-button[data-menu-bot]');
      if(!button || !home()) return;

      // Take ownership before the older delegated handler can defer the change.
      event.preventDefault();
      event.stopImmediatePropagation();

      const name = button.getAttribute('data-menu-bot');
      UI.menu = UI.menu === name ? null : name;
      if(typeof render === 'function') render();
    };

    // Capture phase makes the menu response independent of the 3s polling cycle
    // and prevents the old delegated click handler from fighting with it.
    document.addEventListener('click', handler, true);
    window.__DHOST_FAST_MENU_V1 = true;
  }

  function install(){
    installFastMenu();
    if(window.__DHOST_STABLE_RENDER_V3||typeof window.render!=='function')return;
    const original=window.render;
    window.render=function(){
      if(home()){
        const k=key();
        if(last===k&&updateInPlace())return;
        last=k;
        if(updateInPlace())return;
      }
      const result=original.apply(this,arguments);
      last=home()?key():null;
      return result;
    };
    window.__DHOST_STABLE_RENDER_V3=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
