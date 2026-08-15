/* DHost layout settings — order only. Cards always stay one per row. */
(() => {
  const ORDER_KEY = 'dhost.botOrder.v4';
  const ROOT_ID = 'dhost-layout-settings-root';

  const readJSON = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (_) { return fallback; }
  };

  function botCount() {
    if (Array.isArray(window.STATE?.bots)) return window.STATE.bots.length;

    const savedOrder = readJSON(ORDER_KEY, []);
    if (Array.isArray(savedOrder) && savedOrder.length) return savedOrder.length;

    const cards = document.querySelectorAll('.home-screen .bot-list > .bot-card').length;
    if (cards) return cards;

    const text = document.querySelector('.screen')?.innerText || '';
    const m = text.match(/(?:Слоты|Slots)\s*\n?\s*(\d+)\s*\/\s*\d+/i);
    return m ? Number(m[1]) : 0;
  }

  function removeOldLayoutControls() {
    document.querySelectorAll(
      '.layout-setting-row,.layout-order-row,.dhost-layout-section,.dhost-layout-card,' +
      '.dhost-order-card,#dhost-layout-row,#dhost-order-row,.dhost-layout-settings-root'
    ).forEach(el => el.remove());
  }

  function openOrder() {
    if (typeof window.openReorderScreen === 'function') window.openReorderScreen();
    else if (typeof window.DHOST_REORDER?.open === 'function') window.DHOST_REORDER.open();
  }

  const style = `
    .dhost-layout-settings-root{margin-top:18px}
    .dhost-layout-settings-root .section-label{margin-bottom:7px}
    .dhost-order-card{margin:0}
    .dhost-order-row{min-height:55px;padding:0 14px;display:flex;align-items:center;width:100%;border:0;background:transparent;color:inherit;cursor:pointer}
    .dhost-order-row:active{transform:scale(.995);background:var(--bg-card-hover)}
    .dhost-order-row .list-row-label{font-weight:600}
    .dhost-order-arrow{margin-left:auto;color:var(--text-faint);display:flex;align-items:center}
    .dhost-order-arrow svg{width:16px;height:16px}
  `;

  function injectStyle() {
    if (document.getElementById('dhost-layout-settings-style')) return;
    const s = document.createElement('style');
    s.id = 'dhost-layout-settings-style';
    s.textContent = style;
    document.head.appendChild(s);
  }

  function renderSettingsControls() {
    if (typeof currentScreen !== 'function' || currentScreen() !== 'settings') return;
    injectStyle();

    const count = botCount();
    const existing = document.getElementById(ROOT_ID);

    if (count < 2) {
      if (existing) existing.remove();
      removeOldLayoutControls();
      return;
    }

    if (existing) return;
    removeOldLayoutControls();

    // DHost now intentionally uses one bot per row.
    document.querySelectorAll('.home-screen .bot-list').forEach(list => {
      list.style.setProperty('--bot-columns', '1');
    });

    const cards = [...document.querySelectorAll('.screen > .list-card')];
    const target = cards[cards.length - 1];
    if (!target) return;

    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'dhost-layout-settings-root';

    const section = document.createElement('div');
    section.className = 'section-label';
    section.textContent = LANG === 'en' ? 'INTERFACE' : 'ИНТЕРФЕЙС';

    const orderCard = document.createElement('div');
    orderCard.className = 'list-card dhost-order-card';
    orderCard.innerHTML = `
      <button type="button" class="dhost-order-row">
        <div class="list-row-label">${LANG === 'en' ? 'Change order' : 'Изменить порядок'}</div>
        <span class="dhost-order-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </span>
      </button>`;

    root.append(section, orderCard);
    target.after(root);

    orderCard.querySelector('.dhost-order-row').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openOrder();
    });
  }

  let timer = null;
  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      renderSettingsControls();
    }, 80);
  }

  const observer = new MutationObserver(schedule);

  function boot() {
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
    schedule();
    setInterval(() => {
      if (typeof currentScreen === 'function' && currentScreen() === 'settings') renderSettingsControls();
    }, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();