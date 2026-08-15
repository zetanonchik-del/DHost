/* DHost layout settings: show column controls + reorder entry only when 2+ userbots exist. */
(() => {
  const COL_KEY = 'dhost.botColumns.v4';
  const readColumns = () => {
    try {
      const n = Number(JSON.parse(localStorage.getItem(COL_KEY) || '1'));
      return Math.max(1, Math.min(4, Number.isFinite(n) ? n : 1));
    } catch (_) { return 1; }
  };
  const writeColumns = n => { try { localStorage.setItem(COL_KEY, JSON.stringify(n)); } catch (_) {} };

  const STYLE = `
    .dhost-layout-section{margin-top:18px}
    .dhost-layout-card{margin-top:7px}
    .dhost-layout-row{display:flex!important;align-items:center!important;min-height:55px!important;padding:0 14px!important;cursor:default!important}
    .dhost-layout-row .list-row-label{font-weight:600!important}
    .dhost-layout-columns{margin-left:auto;display:flex;align-items:center;gap:5px}
    .dhost-layout-column{width:30px;height:30px;border:1px solid transparent;border-radius:9px;background:transparent;color:var(--text-faint);font:700 12px var(--font-mono);cursor:pointer;transition:transform .14s,background .15s,border-color .15s,color .15s}
    .dhost-layout-column:hover{background:var(--bg-elevated);color:var(--text)}
    .dhost-layout-column:active{transform:scale(.9)}
    .dhost-layout-column.active{background:var(--blue-bg);border-color:rgba(59,130,246,.35);color:#8eb5ff}
    .dhost-order-row{cursor:pointer!important}
    .dhost-order-row:active{transform:scale(.995);background:var(--bg-card-hover)}
    .dhost-order-value{margin-left:auto;color:var(--text-faint);display:flex;align-items:center}
    .dhost-order-value svg{width:16px;height:16px}
  `;

  function injectStyle() {
    if (document.getElementById('dhost-layout-settings-style')) return;
    const s = document.createElement('style');
    s.id = 'dhost-layout-settings-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function removeOldLayout() {
    document.querySelectorAll('#dhost-layout-row,.layout-order-row,.dhost-layout-section,.dhost-layout-card,.dhost-order-card').forEach(el => {
      const card = el.closest('.list-card');
      if (card && (card.id === 'dhost-layout-card' || card.classList.contains('dhost-layout-card') || card.querySelector('#dhost-layout-row'))) card.remove();
      else el.remove();
    });
  }

  function addSettings() {
    if (typeof currentScreen !== 'function' || currentScreen() !== 'settings') return;
    injectStyle();
    removeOldLayout();
    const count = Array.isArray(window.STATE?.bots) ? STATE.bots.length : 0;
    if (count < 2) return;

    const listCards = [...document.querySelectorAll('.screen > .list-card')];
    const target = listCards[listCards.length - 1];
    if (!target) return;

    const section = document.createElement('div');
    section.className = 'section-label dhost-layout-section';
    section.textContent = LANG === 'en' ? 'Interface' : 'ИНТЕРФЕЙС';

    const columns = readColumns();
    const card = document.createElement('div');
    card.id = 'dhost-layout-card';
    card.className = 'list-card dhost-layout-card';
    card.innerHTML = `<div class="list-row dhost-layout-row">
      <div class="list-row-label">${LANG === 'en' ? 'In a row' : 'В ряд'}</div>
      <div class="dhost-layout-columns">${[1,2,3,4].map(n => `<button type="button" class="dhost-layout-column ${columns === n ? 'active' : ''}" data-columns="${n}">${n}</button>`).join('')}</div>
    </div>`;

    const orderCard = document.createElement('div');
    orderCard.className = 'list-card dhost-order-card';
    orderCard.innerHTML = `<div class="list-row dhost-order-row" role="button" tabindex="0">
      <div class="list-row-label">${LANG === 'en' ? 'Change order' : 'Изменить порядок'}</div>
      <div class="dhost-order-value"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
    </div>`;

    target.after(section, card, orderCard);

    card.querySelectorAll('[data-columns]').forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const n = Math.max(1, Math.min(4, Number(btn.dataset.columns) || 1));
      writeColumns(n);
      card.querySelectorAll('[data-columns]').forEach(x => x.classList.toggle('active', Number(x.dataset.columns) === n));
      document.querySelectorAll('.home-screen .bot-list').forEach(list => list.style.setProperty('--bot-columns', String(n)));
      if (typeof haptic === 'function') haptic('light');
    }));

    const openOrder = () => {
      if (typeof window.openReorderScreen === 'function') window.openReorderScreen();
      else if (typeof window.DHOST_REORDER?.open === 'function') window.DHOST_REORDER.open();
      else alert(LANG === 'en' ? 'Reorder mode is not available yet.' : 'Режим изменения порядка недоступен.');
    };
    const orderRow = orderCard.querySelector('.dhost-order-row');
    orderRow.addEventListener('click', openOrder);
    orderRow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openOrder(); });
  }

  let lastScreen = '';
  const observer = new MutationObserver(() => {
    const screen = typeof currentScreen === 'function' ? currentScreen() : '';
    if (screen === 'settings') requestAnimationFrame(addSettings);
    else if (lastScreen === 'settings') removeOldLayout();
    lastScreen = screen;
  });

  function boot() {
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
    setTimeout(addSettings, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
