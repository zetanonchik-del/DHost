/* DHost UX: pinned bots, grid setting and explicit reorder mode. No long-press / home drag. */
(() => {
  const ORDER_KEY='dhost.botOrder.v4';
  const PIN_KEY='dhost.botPinned.v4';
  const COL_KEY='dhost.botColumns.v4';
  const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch(_){return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};

  let order=Array.isArray(read(ORDER_KEY,null))?read(ORDER_KEY,[]):(Array.isArray(read('dhost.botOrder.v3',null))?read('dhost.botOrder.v3',[]):[]);
  let pinned=Array.isArray(read(PIN_KEY,null))?read(PIN_KEY,[]):(Array.isArray(read('dhost.botPinned.v3',null))?read('dhost.botPinned.v3',[]):[]);
  let columns=Math.max(1,Math.min(4,Number(read(COL_KEY,read('dhost.botColumns.v3',1)))||1));
  let reorderMode=false;
  let draftOrder=[];
  let drag=null;

  const ICON_PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 4 6 6"/><path d="M17 7 7 17"/><path d="m5 19 4-4"/><path d="M12 12 5 5l4-4 7 7"/></svg>';
  const ICON_UNPIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 16 16"/><path d="M14 4l6 6"/><path d="M17 7 7 17"/><path d="m5 19 4-4"/></svg>';
  const ICON_DRAG='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>';
  const ICON_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';
  const ICON_BACK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';

  const STYLE=`
    .home-screen .bot-list{display:grid!important;grid-template-columns:repeat(var(--bot-columns,1),minmax(0,1fr));gap:8px;align-items:start;width:100%}
    .home-screen .bot-list>.bot-card{min-width:0;grid-column:auto!important;grid-row:auto}
    .home-screen .bot-list>.empty-search{grid-column:1/-1}
    .layout-setting-row{cursor:pointer!important}.layout-setting-row:active{transform:scale(.995);background:var(--bg-card-hover)}
    .layout-setting-value{margin-left:auto;display:flex;align-items:center;gap:7px;color:var(--text-dim);font:600 12px var(--font-mono)}
    .layout-setting-value svg{width:15px;height:15px;color:var(--text-faint)}
    .layout-columns{margin-left:auto;display:flex;align-items:center;gap:4px}
    .layout-column-btn{width:28px;height:28px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--text-faint);font:700 11px var(--font-mono);cursor:pointer;transition:transform .12s,background .15s,color .15s,border-color .15s}
    .layout-column-btn:hover{color:var(--text);background:var(--bg-elevated)}
    .layout-column-btn:active{transform:scale(.9)}
    .layout-column-btn.active{background:var(--blue-bg);border-color:rgba(59,130,246,.32);color:#8eb5ff}
    .layout-order-row .list-row-label{font-weight:600}
    .reorder-screen{padding:0 0 18px;gap:10px;min-height:calc(100dvh - 70px)}
    .reorder-topbar{display:flex;align-items:center;gap:9px;padding:0 2px 7px}
    .reorder-back{width:34px;height:34px;border-radius:10px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-dim);display:flex;align-items:center;justify-content:center;cursor:pointer}.reorder-back svg{width:18px;height:18px}
    .reorder-title{font:700 16px var(--font-ui);letter-spacing:-.02em}.reorder-sub{font-size:9px;color:var(--text-faint);margin-top:2px}
    .reorder-check{margin-left:auto;width:36px;height:36px;border-radius:11px;border:1px solid rgba(53,208,127,.28);background:rgba(53,208,127,.10);color:var(--ok);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s,background .15s}.reorder-check:active{transform:scale(.9)}.reorder-check svg{width:18px;height:18px}
    .reorder-grid{display:grid;grid-template-columns:repeat(var(--bot-columns,1),minmax(0,1fr));gap:8px;width:100%;align-items:start}
    .reorder-card{position:relative;min-width:0;padding:13px;border:1px solid var(--border);border-radius:15px;background:var(--bg-card);transition:transform .16s cubic-bezier(.2,.8,.2,1),border-color .16s,box-shadow .16s,opacity .16s;touch-action:none;user-select:none;-webkit-user-select:none}
    .reorder-card.is-dragging{opacity:.08}.reorder-card.drag-over{border-color:#4b8df7;box-shadow:0 0 0 2px rgba(59,130,246,.13)}
    .reorder-card-ghost{position:fixed!important;z-index:10000!important;pointer-events:none!important;margin:0!important;opacity:.98!important;transform:scale(1.035) rotate(1deg)!important;border-color:#4b8df7!important;box-shadow:0 18px 42px rgba(0,0,0,.5),0 0 0 2px rgba(59,130,246,.18)!important}
    .reorder-card-head{display:flex;align-items:center;gap:8px}.reorder-name{font:700 14px var(--font-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.reorder-status{margin-left:auto}.reorder-handle{width:27px;height:27px;min-width:27px;border:0;border-radius:8px;background:rgba(255,255,255,.045);color:var(--text-faint);display:flex;align-items:center;justify-content:center;cursor:grab}.reorder-handle:active{cursor:grabbing;background:var(--blue-bg);color:#8eb5ff}.reorder-handle svg{width:15px;height:15px}
    .reorder-card-meta{margin-top:9px;font:500 9px var(--font-mono);color:var(--text-faint);display:flex;justify-content:space-between;gap:7px}.reorder-card-meta span:last-child{color:var(--text-dim)}
    .reorder-save-sheet{position:fixed;inset:0;z-index:11000;background:rgba(4,7,10,.68);backdrop-filter:blur(7px);display:flex;align-items:flex-end;justify-content:center;padding:12px}.reorder-save-dialog{width:min(420px,100%);padding:17px;border:1px solid var(--border);border-radius:17px;background:var(--bg-card);box-shadow:0 20px 55px rgba(0,0,0,.5);animation:reorderSheetIn .16s ease-out}.reorder-save-title{font:700 15px var(--font-ui)}.reorder-save-text{font-size:10px;color:var(--text-faint);margin-top:5px}.reorder-save-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.reorder-save-actions button{height:40px;border-radius:10px;border:1px solid var(--border);font:700 11px var(--font-ui);cursor:pointer;transition:transform .14s}.reorder-save-actions button:active{transform:scale(.97)}.reorder-save-actions .save{background:var(--blue);border-color:rgba(59,130,246,.5);color:#fff}.reorder-save-actions .discard{background:var(--bg-elevated);color:var(--text-dim)}
    @keyframes reorderSheetIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @media(max-width:520px){.reorder-card{padding:11px}.reorder-card-meta{font-size:8px}.reorder-name{font-size:13px}.reorder-grid{gap:7px}}
  `;
  function inject(){let s=document.getElementById('dhost-enhancements-style');if(!s){s=document.createElement('style');s.id='dhost-enhancements-style';document.head.appendChild(s)}s.textContent=STYLE}
  function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
  function sortState(list=STATE?.bots){if(!Array.isArray(list))return;const pos=new Map(order.map((n,i)=>[n,i]));list.sort((a,b)=>{const ap=pinned.includes(a.name),bp=pinned.includes(b.name);if(ap!==bp)return ap?-1:1;return(pos.get(a.name)??999999)-(pos.get(b.name)??999999)})}
  function normalizeOrder(names){const next=[];names.forEach(n=>{if(n&&!next.includes(n))next.push(n)});order.forEach(n=>{if(!next.includes(n))next.push(n)});(STATE?.bots||[]).forEach(b=>{if(!next.includes(b.name))next.push(b.name)});return next}
  function applyLayout(){document.querySelectorAll('.home-screen .bot-list').forEach(list=>{list.style.setProperty('--bot-columns',String(columns));list.dataset.columns=String(columns)})}

  function addPinMenus(){document.querySelectorAll('.bot-actions').forEach(menu=>{const card=menu.closest('.bot-card');const name=card?.dataset.bot||menu.querySelector('[data-menu-name]')?.dataset.menuName;if(!name||menu.querySelector('.pin-action'))return;const b=document.createElement('button');b.type='button';b.className='bot-action pin-action';b.innerHTML=(pinned.includes(name)?ICON_UNPIN:ICON_PIN)+'<span>'+(pinned.includes(name)?'Открепить':'Закрепить')+'</span>';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();pinned=pinned.includes(name)?pinned.filter(n=>n!==name):[...pinned,name];write(PIN_KEY,pinned);if(window.DHOST_UI)DHOST_UI.menu=null;sortState();render()});menu.insertBefore(b,menu.firstChild)})}

  function addLayoutRow(){
    if(typeof currentScreen!=='function'||currentScreen()!=='settings'||document.getElementById('dhost-layout-row'))return;
    if(!STATE?.bots || STATE.bots.length<2)return;
    const cards=[...document.querySelectorAll('.list-card')];const target=cards[cards.length-1];if(!target)return;
    const section=document.createElement('div');section.className='section-label';section.textContent=LANG==='en'?'Interface':'Интерфейс';
    const card=document.createElement('div');card.className='list-card';card.innerHTML=`<div class="list-row layout-setting-row" id="dhost-layout-row"><div class="list-row-label">В ряд</div><div class="layout-columns" aria-label="Количество юзерботов в ряд">${[1,2,3,4].map(n=>`<button type="button" class="layout-column-btn ${columns===n?'active':''}" data-columns="${n}" aria-label="${n}">${n}</button>`).join('')}</div></div>`;
    const orderCard=document.createElement('div');orderCard.className='list-card';orderCard.innerHTML='<button type="button" class="list-row layout-setting-row layout-order-row" id="dhost-order-row"><div class="list-row-label">Изменить порядок</div><div class="layout-setting-value"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div></button>';
    target.after(section,card,orderCard);
    card.querySelectorAll('.layout-column-btn').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const n=Math.max(1,Math.min(4,Number(btn.dataset.columns)||1));columns=n;write(COL_KEY,columns);applyLayout();card.querySelectorAll('.layout-column-btn').forEach(x=>x.classList.toggle('active',Number(x.dataset.columns)===columns));haptic?.('light')}));
    orderCard.querySelector('#dhost-order-row').addEventListener('click',openReorderScreen);
  }

  function reorderCards(){return (draftOrder||[]).map(name=>STATE.bots.find(b=>b.name===name)).filter(Boolean)}
  function reorderMarkup(){const bots=reorderCards();const cards=bots.map(b=>`<div class="reorder-card" data-reorder-bot="${esc(b.name)}"><div class="reorder-card-head"><div class="reorder-name">${esc(b.name)}</div><div class="reorder-status">${statusPill(b.status)}</div><button type="button" class="reorder-handle" aria-label="Переместить">${ICON_DRAG}</button></div><div class="reorder-card-meta"><span>${t('cpu')} ${Number(b.cpu_percent||0).toFixed(1)}%</span><span>${t('ram')} ${Math.round(Number(b.ram_used_mb)||0)}/${Math.round(Number(b.ram_limit_mb)||0)}MB</span></div></div>`).join('');return `<div class="screen reorder-screen"><div class="reorder-topbar"><button class="reorder-back" id="reorder-cancel" type="button">${ICON_BACK}</button><div><div class="reorder-title">Порядок юзерботов</div><div class="reorder-sub">Перетащите за значок, чтобы изменить порядок</div></div><button class="reorder-check" id="reorder-done" type="button" aria-label="Готово">${ICON_CHECK}</button></div><div class="reorder-grid" id="reorder-grid" style="--bot-columns:${columns}">${cards}</div></div>`}

  function openReorderScreen(){if(!STATE?.bots?.length || STATE.bots.length<2)return;sortState();draftOrder=STATE.bots.map(b=>b.name);reorderMode=true;document.getElementById('app').innerHTML=reorderMarkup();wireReorder();haptic?.('light')}
  function closeReorder(){reorderMode=false;drag=null;draftOrder=[];render()}
  function rerenderReorder(){if(!reorderMode)return;document.getElementById('app').innerHTML=reorderMarkup();wireReorder()}

  function startPointerDrag(card,e){if(!reorderMode)return;const grid=document.getElementById('reorder-grid');if(!grid)return;const r=card.getBoundingClientRect();const ph=document.createElement('div');ph.className='reorder-card';ph.style.visibility='hidden';ph.style.width=r.width+'px';ph.style.height=r.height+'px';card.after(ph);card.classList.add('is-dragging');const ghost=card.cloneNode(true);ghost.classList.add('reorder-card-ghost');ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';ghost.style.left=r.left+'px';ghost.style.top=r.top+'px';document.body.appendChild(ghost);drag={card,grid,ph,ghost,pointerId:e.pointerId,ox:e.clientX-r.left,oy:e.clientY-r.top};try{card.setPointerCapture(e.pointerId)}catch(_){ }movePointerDrag(e.clientX,e.clientY)}
  function movePointerDrag(x,y){if(!drag)return;const d=drag;d.ghost.style.left=(x-d.ox)+'px';d.ghost.style.top=(y-d.oy)+'px';const target=document.elementFromPoint(x,y)?.closest('.reorder-card');if(!target||target===d.card||target===d.ph||!d.grid.contains(target))return;document.querySelectorAll('.reorder-card.drag-over').forEach(c=>c.classList.remove('drag-over'));target.classList.add('drag-over');const r=target.getBoundingClientRect();const before=columns>1?(x<r.left+r.width/2):(y<r.top+r.height/2);if(before)target.before(d.ph);else target.after(d.ph)}
  function finishPointerDrag(){if(!drag)return;const d=drag;drag=null;d.card.classList.remove('is-dragging');d.ph.replaceWith(d.card);d.ghost.remove();document.querySelectorAll('.reorder-card.drag-over').forEach(c=>c.classList.remove('drag-over'));draftOrder=[...document.querySelectorAll('#reorder-grid .reorder-card')].map(c=>c.dataset.reorderBot).filter(Boolean);rerenderReorder();haptic?.('light')}
  function bindReorderCards(){document.querySelectorAll('#reorder-grid .reorder-handle').forEach(handle=>{if(handle.dataset.bound==='1')return;handle.dataset.bound='1';handle.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();startPointerDrag(handle.closest('.reorder-card'),e)})});document.querySelectorAll('#reorder-grid .reorder-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(drag){e.preventDefault();movePointerDrag(e.clientX,e.clientY)}});card.addEventListener('pointerup',e=>{if(drag?.card===card){e.preventDefault();finishPointerDrag()}});card.addEventListener('pointercancel',()=>{if(drag?.card===card)finishPointerDrag()});card.addEventListener('lostpointercapture',()=>{if(drag?.card===card)finishPointerDrag()})})}
  function wireReorder(){document.getElementById('reorder-cancel')?.addEventListener('click',closeReorder);document.getElementById('reorder-done')?.addEventListener('click',showSaveSheet);bindReorderCards()}
  function showSaveSheet(){const sheet=document.createElement('div');sheet.className='reorder-save-sheet';sheet.innerHTML='<div class="reorder-save-dialog"><div class="reorder-save-title">Сохранить изменения?</div><div class="reorder-save-text">Новый порядок юзерботов будет сохранён.</div><div class="reorder-save-actions"><button class="discard" type="button">Не сохранять</button><button class="save" type="button">Сохранить</button></div></div>';sheet.querySelector('.save').addEventListener('click',()=>{order=normalizeOrder(draftOrder);write(ORDER_KEY,order);sortState();sheet.remove();reorderMode=false;draftOrder=[];render();haptic?.('success')});sheet.querySelector('.discard').addEventListener('click',()=>{sheet.remove();reorderMode=false;draftOrder=[];render()});document.body.appendChild(sheet)}

  function patchRender(){if(window.__DHOST_ENHANCED_RENDER4||typeof window.render!=='function')return;const original=window.render;window.render=function(){if(reorderMode)return;sortState();original();requestAnimationFrame(()=>{applyLayout();addPinMenus();addLayoutRow()})};window.__DHOST_ENHANCED_RENDER4=true}
  document.addEventListener('click',e=>{if(reorderMode)return;if(document.querySelector('.bot-actions')&&!e.target.closest('.bot-actions')&&!e.target.closest('.bot-menu-button')){document.querySelectorAll('.bot-actions').forEach(m=>m.remove());if(window.DHOST_UI)window.DHOST_UI.menu=null}},false);
  inject();patchRender();const boot=()=>{patchRender();applyLayout();addPinMenus();addLayoutRow()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else requestAnimationFrame(boot);
})();
