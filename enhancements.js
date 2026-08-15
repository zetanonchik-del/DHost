/* DHost UX enhancements: pinned bots, long-press reorder, grid layout and action micro-animations. */
(() => {
  const ORDER_KEY = 'dhost.botOrder.v1';
  const PIN_KEY = 'dhost.botPinned.v1';
  const COL_KEY = 'dhost.botColumns.v1';
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  let order = read(ORDER_KEY, []);
  let pinned = read(PIN_KEY, []);
  let columns = Math.max(1, Math.min(4, Number(read(COL_KEY, 1)) || 1));
  let drag = null;
  let suppressClick = false;

  const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 4 6 6"/><path d="M17 7 7 17"/><path d="m5 19 4-4"/><path d="M12 12 5 5l4-4 7 7"/><path d="m4 20 3-3"/></svg>';
  const PIN_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 16 16"/><path d="M14 4l6 6"/><path d="M17 7 7 17"/><path d="m5 19 4-4"/></svg>';

  const STYLE = `
    .home-screen{grid-template-columns:repeat(var(--bot-columns,1),minmax(0,1fr));align-items:start}
    .home-screen>.bot-card{grid-column:auto;min-width:0}
    .home-screen>:not(.bot-card){grid-column:1/-1}
    .bot-card.dragging{opacity:.72;transform:scale(.985);border-color:#3b82f6;box-shadow:0 14px 32px rgba(0,0,0,.35),0 0 0 1px rgba(59,130,246,.22);z-index:30}
    .bot-card.drag-over{border-color:#4b8df7;box-shadow:0 0 0 2px rgba(59,130,246,.12)}
    .bot-card{user-select:none;-webkit-user-select:none}
    .bot-action.pin-action{color:#79a9ff}.bot-action.pin-action:hover{background:var(--blue-bg);color:#9bbcff}.bot-action.pin-action svg{transition:transform .18s}.bot-action.pin-action:hover svg{transform:rotate(-10deg) translateY(-1px)}
    .action-btn svg{transition:transform .22s cubic-bezier(.2,.8,.2,1),filter .22s}
    .action-btn[data-action="restart"]:hover svg{transform:rotate(180deg)}
    .action-btn[data-action="reinstall"]:hover svg{transform:rotate(180deg)}
    .action-btn[data-action="delete"] svg polyline{transform-box:fill-box;transform-origin:center;transition:transform .22s}.action-btn[data-action="delete"]:hover svg polyline{transform:rotate(-8deg) translateY(-1px)}
    .action-btn[data-action="stop"]:hover svg{transform:scale(.84)}
    .action-btn[data-action="start"]:hover svg{transform:translateX(2px) scale(1.06)}
    .action-btn[data-action="delete"]:hover{box-shadow:0 5px 18px rgba(255,102,85,.1)}
    .action-btn[data-action="restart"]:active svg,.action-btn[data-action="reinstall"]:active svg{transform:rotate(360deg)}
    .layout-setting-input{width:54px;height:32px;border:1px solid var(--border);border-radius:9px;background:var(--bg-elevated);color:var(--text);font:600 13px var(--font-mono);text-align:center;outline:none}.layout-setting-input:focus{border-color:#315f9e;box-shadow:0 0 0 3px rgba(59,130,246,.08)}
    .layout-setting-hint{font-size:10px;color:var(--text-faint);padding:9px 15px 12px;border-top:1px solid var(--border-soft)}
    @media(max-width:600px){.home-screen{grid-template-columns:repeat(var(--bot-columns,1),minmax(0,1fr))}.home-screen.bot-columns-2 .bot-card{min-width:0}.home-screen.bot-columns-2 .bot-card-name{font-size:13px}.home-screen.bot-columns-2 .bot-card-meters{grid-template-columns:1fr}.home-screen.bot-columns-2 .bot-card-foot{font-size:8px}}
  `;

  function injectStyle(){
    if(document.getElementById('dhost-enhancements-style')) return;
    const s=document.createElement('style');s.id='dhost-enhancements-style';s.textContent=STYLE;document.head.appendChild(s);
  }
  function currentOrder(){ return Array.isArray(order) ? order : []; }
  function sortState(){
    if(!window.STATE?.bots || !Array.isArray(STATE.bots)) return;
    const list=STATE.bots.slice(); const pos=new Map(currentOrder().map((n,i)=>[n,i]));
    list.sort((a,b)=>{
      const ap=pinned.includes(a.name), bp=pinned.includes(b.name); if(ap!==bp)return ap?-1:1;
      return (pos.get(a.name) ?? 999999)-(pos.get(b.name) ?? 999999);
    });
    STATE.bots.splice(0,STATE.bots.length,...list);
  }
  function saveDomOrder(){
    const names=[...document.querySelectorAll('.home-screen .bot-card')].map(c=>c.dataset.bot).filter(Boolean);
    const known=new Set(names); const next=[...names,...currentOrder().filter(n=>!known.has(n))]; order=next; write(ORDER_KEY,order);
    if(Array.isArray(window.STATE?.bots)){
      const map=new Map(STATE.bots.map(b=>[b.name,b]));
      const reordered=next.map(n=>map.get(n)).filter(Boolean);
      const rest=STATE.bots.filter(b=>!known.has(b.name));
      STATE.bots.splice(0,STATE.bots.length,...reordered,...rest);
    }
  }
  function applyLayout(){
    document.querySelectorAll('.home-screen').forEach(el=>{el.style.setProperty('--bot-columns',String(columns));el.classList.toggle('bot-columns-2',columns===2)});
  }
  function addPinMenus(){
    document.querySelectorAll('.bot-actions').forEach(menu=>{
      const name=menu.closest('.bot-card')?.dataset.bot || menu.querySelector('[data-menu-name]')?.dataset.menuName;
      if(!name || menu.querySelector('.pin-action')) return;
      const b=document.createElement('button');b.type='button';b.className='bot-action pin-action';b.dataset.pinName=name;b.innerHTML=(pinned.includes(name)?PIN_OFF:PIN)+'<span>'+(pinned.includes(name)?'Открепить':'Закрепить')+'</span>';
      b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(pinned.includes(name))pinned=pinned.filter(n=>n!==name);else pinned=[...pinned.filter(n=>n!==name),name];write(PIN_KEY,pinned);window.DHOST_UI&&(DHOST_UI.menu=null);sortState();render();});
      menu.insertBefore(b,menu.firstChild);
    });
  }
  function addSettings(){
    if(typeof window.currentScreen!=='function' || currentScreen()!=='settings') return;
    if(document.getElementById('row-columns')) return;
    const cards=document.querySelectorAll('.list-card'); const target=cards[cards.length-1]; if(!target)return;
    const section=document.createElement('div');section.className='section-label';section.textContent=(window.LANG==='en'?'Layout':'Интерфейс');
    const card=document.createElement('div');card.className='list-card';
    card.innerHTML='<div class="list-row" id="row-columns"><div class="list-row-label">В ряд</div><input id="layout-columns" class="layout-setting-input" type="number" min="1" max="4" step="1" value="'+columns+'"></div><div class="layout-setting-hint">Количество юзерботов в одной строке. Порядок сохраняется автоматически.</div>';
    target.after(section,card);
    const input=card.querySelector('#layout-columns');
    input.addEventListener('change',()=>{columns=Math.max(1,Math.min(4,Number(input.value)||1));input.value=columns;write(COL_KEY,columns);applyLayout();render();});
  }
  function setupDrag(){
    document.querySelectorAll('.home-screen .bot-card').forEach(card=>{
      if(card.dataset.dragReady)return;card.dataset.dragReady='1';
      let timer=null,startX=0,startY=0;
      const clear=()=>{if(timer){clearTimeout(timer);timer=null}};
      const finish=()=>{clear();if(!drag || drag.card!==card)return;document.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));card.classList.remove('dragging');document.body.style.userSelect='';saveDomOrder();drag=null;setTimeout(()=>suppressClick=false,80);render()};
      card.addEventListener('pointerdown',e=>{
        if(e.button!==undefined&&e.button!==0)return;if(e.target.closest('button,.bot-actions,input'))return;
        startX=e.clientX;startY=e.clientY;clear();
        timer=setTimeout(()=>{drag={card};card.classList.add('dragging');suppressClick=true;document.body.style.userSelect='none';if(typeof window.haptic==='function')haptic('medium')},480);
      });
      card.addEventListener('pointermove',e=>{
        if(!drag){if(Math.hypot(e.clientX-startX,e.clientY-startY)>10)clear();return;}
        e.preventDefault();
        const el=document.elementFromPoint(e.clientX,e.clientY)?.closest('.bot-card');
        if(!el||el===card)return;
        document.querySelectorAll('.bot-card.drag-over').forEach(x=>x.classList.remove('drag-over'));el.classList.add('drag-over');
        const r=el.getBoundingClientRect();const before=columns===1?e.clientY<r.top+r.height/2:e.clientX<r.left+r.width/2;
        if(before)el.before(card);else el.after(card);
      });
      card.addEventListener('pointerup',finish);card.addEventListener('pointercancel',finish);card.addEventListener('pointerleave',()=>{if(!drag)clear()});
    });
  }
  function patchRender(){
    if(window.__DHOST_ENHANCED_RENDER)return; if(typeof window.render!=='function')return;
    const original=window.render;window.render=function(){sortState();original();requestAnimationFrame(()=>{applyLayout();addPinMenus();addSettings();setupDrag();});};window.__DHOST_ENHANCED_RENDER=true;
  }
  function observe(){
    const obs=new MutationObserver(()=>requestAnimationFrame(()=>{injectStyle();applyLayout();addPinMenus();addSettings();setupDrag();}));obs.observe(document.body,{childList:true,subtree:true});
  }
  document.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();}},true);
  injectStyle();patchRender();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{patchRender();observe();});else observe();
})();
