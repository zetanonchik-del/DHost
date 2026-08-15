/* DHost layout settings cleanup.
 *
 * The actual "Interface" controls and reorder screen live in enhancements.js.
 * This file only removes the optional grid/column control so Settings keeps
 * one Interface section with the working "Изменить порядок" row.
 */
(() => {
  const ROOT = document.getElementById('app');

  function isSettings() {
    return typeof currentScreen === 'function' && currentScreen() === 'settings';
  }

  function cleanup() {
    if (!isSettings()) return;

    // enhancements.js creates this row together with the reorder row.
    // We intentionally keep the reorder row and remove only the grid setting.
    const layoutRow = document.getElementById('dhost-layout-row');
    if (layoutRow) {
      const card = layoutRow.closest('.list-card');
      const section = card?.previousElementSibling;

      card?.remove();

      // The section label belongs to the removed grid card. Keep the single
      // Interface label only for the remaining "Изменить порядок" card.
      if (section?.classList.contains('section-label')) {
        const text = (section.textContent || '').trim().toLowerCase();
        if (text === 'интерфейс' || text === 'interface') section.remove();
      }
    }

    // Remove the legacy duplicate injected by older versions of this file.
    document.querySelectorAll(
      '.dhost-layout-settings-root,.dhost-order-card,#dhost-layout-row'
    ).forEach(el => el.remove());
  }

  const observer = new MutationObserver(() => {
    if (isSettings()) cleanup();
  });

  function boot() {
    observer.observe(ROOT || document.body, { childList: true, subtree: true });
    cleanup();
    setInterval(cleanup, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
