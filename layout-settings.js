/* DHost settings cleanup.
 *
 * enhancements.js owns the working "Изменить порядок" screen. The base
 * settings page already contains an empty legacy Interface block, while
 * enhancements.js adds the real Interface block. We remove the legacy block
 * after render, in the same animation frame, so it never visibly flickers.
 */
(() => {
  function isSettings() {
    return typeof currentScreen === 'function' && currentScreen() === 'settings';
  }

  function cleanup() {
    if (!isSettings()) return;

    const labels = [...document.querySelectorAll('#app .section-label')].filter(el => {
      const text = (el.textContent || '').trim().toLowerCase();
      return text === 'интерфейс' || text === 'interface';
    });

    // Keep the last Interface block — it is the one created by
    // enhancements.js and contains the working reorder action.
    if (labels.length < 2) return;

    labels.slice(0, -1).forEach(label => {
      const next = label.nextElementSibling;
      label.remove();

      // The legacy Interface section has an empty list-card. Remove only
      // that card; do not touch the real reorder card.
      if (next?.classList.contains('list-card') && !next.querySelector('.layout-order-row')) {
        next.remove();
      }
    });
  }

  function patchRender() {
    if (window.__DHOST_SETTINGS_CLEANUP) return;
    if (typeof window.render !== 'function') return;

    const original = window.render;
    window.render = function () {
      original();
      // enhancements.js schedules its DOM additions with requestAnimationFrame
      // too. This callback is registered after it, so cleanup happens before
      // the browser paints the resulting frame.
      requestAnimationFrame(cleanup);
    };
    window.__DHOST_SETTINGS_CLEANUP = true;
  }

  function boot() {
    patchRender();
    requestAnimationFrame(cleanup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
