/* DHost stability: keep live home refreshes in-place and make reorder mode single-column. */
(() => {
  const STYLE_ID = 'dhost-stability-style-v1';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #reorder-grid.reorder-grid { grid-template-columns: minmax(0, 1fr) !important; }
      #reorder-grid .reorder-card { width: 100%; box-sizing: border-box; }
    `;
    document.head.appendChild(style);
  }

  function screenIsHome() {
    try { return typeof currentScreen === 'function' && currentScreen() === 'home'; }
    catch (_) { return false; }
  }

  function visibleNames() {
    const q = String(UI?.query || '').trim().toLowerCase();
    const filter = UI?.filter || 'all';
    return (STATE?.bots || []).filter(b => {
      const matchesQuery = !q || `${b.name} ${b.unit || ''} ${b.platform || ''}`.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || b.status === filter;
      return matchesQuery && matchesFilter;
    }).map(b => b.name);
  }

  function currentNames() {
    return [...document.querySelectorAll('.home-screen .bot-list > .bot-card')].map(c => c.dataset.bot || '');
  }

  function columnCount() {
    try { return Math.max(1, Math.min(4, Number(JSON.parse(localStorage.getItem('dhost.botColumns.v5'))) || 1)); }
    catch (_) { return 1; }
  }

  function structureKey() {
    return JSON.stringify({ names: visibleNames(), columns: columnCount(), filter: UI?.filter || 'all' });
  }

  let lastStructureKey = null;

  function updateHomeInPlace() {
    const app = document.getElementById('app');
    if (!app?.querySelector('.home-screen')) return false;

    const expected = visibleNames();
    const actual = currentNames();
    if (expected.length !== actual.length || expected.some((name, i) => name !== actual[i])) return false;

    const bots = new Map((STATE?.bots || []).map(b => [b.name, b]));

    document.querySelectorAll('.home-screen .bot-list > .bot-card').forEach(card => {
      const bot = bots.get(card.dataset.bot);
      if (!bot) return;

      const cpu = Math.max(0, Math.min(Number(bot.cpu_percent) || 0, 100));
      const ramLimit = Number(bot.ram_limit_mb) || 0;
      const ramUsed = Number(bot.ram_used_mb) || 0;
      const ram = ramLimit ? Math.min(ramUsed / ramLimit * 100, 100) : 0;

      const status = card.querySelector('.status-pill');
      if (status && typeof statusPill === 'function') status.outerHTML = statusPill(bot.status);

      const meters = card.querySelectorAll('.meter');
      if (meters[0]) {
        const label = meters[0].querySelector('.meter-label b');
        const fill = meters[0].querySelector('.meter-fill');
        if (label) label.textContent = `${cpu.toFixed(1)}%`;
        if (fill) fill.style.width = `${cpu}%`;
      }
      if (meters[1]) {
        const label = meters[1].querySelector('.meter-label b');
        const fill = meters[1].querySelector('.meter-fill');
        if (label) label.textContent = `${Math.round(ramUsed)}/${Math.round(ramLimit)}MB`;
        if (fill) fill.style.width = `${ram}%`;
      }

      const foot = card.querySelectorAll('.bot-card-foot span');
      if (foot[0] && typeof fmtDate === 'function') foot[0].textContent = `${t('created')} ${fmtDate(bot.created_at)}`;
      if (foot[1] && typeof fmtUptime === 'function') foot[1].textContent = `${bot.platform || 'Server'} · ${fmtUptime(bot.uptime_seconds)}`;
    });

    const sub = STATE?.subscription;
    const running = (STATE?.bots || []).filter(b => b.status === 'running').length;
    const installing = (STATE?.bots || []).filter(b => b.status === 'installing').length;
    const errors = (STATE?.bots || []).filter(b => b.status === 'error').length;
    const used = sub?.used_slots ?? STATE?.bots?.length ?? 0;
    const max = sub?.max_slots ?? STATE?.bots?.length ?? 0;
    const pct = max ? Math.min(used / max * 100, 100) : 0;

    const count = app.querySelector('.summary-count');
    if (count) count.innerHTML = `${used}<span> / ${max}</span>`;
    const progress = app.querySelector('.summary-progress > div');
    if (progress) progress.style.width = `${pct}%`;
    const summaryFoot = app.querySelectorAll('.summary-foot span');
    if (summaryFoot[0]) summaryFoot[0].textContent = `${used} ${LANG === 'ru' ? 'использовано' : 'used'}`;
    if (summaryFoot[1]) summaryFoot[1].textContent = `${Math.max(max - used, 0)} ${LANG === 'ru' ? 'доступно' : 'available'}`;
    const stats = app.querySelectorAll('.summary-stat-value');
    if (stats[0]) stats[0].textContent = running;
    if (stats[1]) stats[1].textContent = installing;
    if (stats[2]) stats[2].textContent = errors;

    const columns = columnCount();
    document.querySelectorAll('.home-screen .bot-list').forEach(list => {
      list.style.setProperty('--grid-columns', String(Math.min(columns, actual.length || 1)));
    });
    return true;
  }

  function install() {
    if (window.__DHOST_STABLE_RENDER_V1 || typeof window.render !== 'function') return;
    const originalRender = window.render;
    window.render = function stableRender() {
      if (screenIsHome()) {
        const key = structureKey();
        if (lastStructureKey === key && updateHomeInPlace()) return;
        lastStructureKey = key;
        if (updateHomeInPlace()) return;
      }
      const result = originalRender.apply(this, arguments);
      if (screenIsHome()) lastStructureKey = structureKey();
      else lastStructureKey = null;
      return result;
    };
    window.__DHOST_STABLE_RENDER_V1 = true;
  }

  function boot() {
    install();
    if (screenIsHome()) lastStructureKey = structureKey();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
