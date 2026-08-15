/* DHost layout controls.
 * Owns only the "В ряд" setting. The reorder screen remains owned by enhancements-v2.js.
 * This is intentionally a single settings row, not a second Interface section.
 */
(() => {
  const KEY = 'dhost.botColumns.v5';
  const read = () => {
    try { return Math.max(1, Math.min(4, Number(JSON.parse(localStorage.getItem(KEY))) || 1)); }
    catch (_) { return 1; }
  };
  const write = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (_) {} };

  function applyColumns() {
    const n = read();
    document.querySelectorAll('.home-screen .bot-list').forEach(list => {
      const count = list.querySelectorAll(':scope > .bot-card').length || 1;
      list.style.setProperty('--grid-columns', String(Math.min(n, count)));
    });
  }

  function addRow() {
    if (typeof currentScreen !== 'function' || currentScreen() !== 'settings') return;
    const orderRow = document.getElementById('dhost-order-row');
    if (!orderRow || document.getElementById('dhost-columns-row')) return;

    const orderCard = orderRow.closest('.list-card');
    if (!orderCard) return;

    const card = document.createElement('div');
    card.className = 'list-card';
    card.id = 'dhost-columns-card';
    card.innerHTML = `
      <div class="list-row layout-setting-row" id="dhost-columns-row">
        <div class="list-row-label">В ряд</div>
        <div class="dhost-columns-buttons" aria-label="Количество юзерботов в ряд">
          ${[1,2,3,4].map(n => `<button type="button" class="dhost-column-btn${read() === n ? ' active' : ''}" data-columns="${n}">${n}</button>`).join('')}
        </div>
      </div>`;

    orderCard.parentNode.insertBefore(card, orderCard);

    card.querySelectorAll('.dhost-column-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const n = Math.max(1, Math.min(4, Number(btn.dataset.columns) || 1));
        write(n);
        card.querySelectorAll('.dhost-column-btn').forEach(x => x.classList.toggle('active', Number(x.dataset.columns) === n));
        applyColumns();
        if (typeof haptic === 'function') haptic('light');
      });
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    #dhost-columns-card .list-row { min-height: 52px; }
    #dhost-columns-card .list-row-label { flex: 1; font-weight: 600; }
    .dhost-columns-buttons { margin-left: auto; display: flex; align-items: center; gap: 5px; }
    .dhost-column-btn {
      width: 31px; height: 31px; padding: 0; border-radius: 9px;
      border: 1px solid transparent; background: transparent;
      color: var(--text-faint); font: 700 12px var(--font-mono);
      cursor: pointer; transition: .15s;
    }
    .dhost-column-btn:active { transform: scale(.9); }
    .dhost-column-btn.active {
      background: var(--blue-bg);
      border-color: rgba(59,130,246,.32);
      color: #8eb5ff;
    }
  `;
  document.head.appendChild(style);

  function boot() {
    addRow();
    applyColumns();
    const observer = new MutationObserver(() => {
      addRow();
      applyColumns();
    });
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
