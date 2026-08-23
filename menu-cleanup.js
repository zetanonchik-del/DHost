/* DHost menu cleanup: remove pin/details actions from bot overflow menus. */
(() => {
  const removeLegacyMenuActions = () => {
    document.querySelectorAll('.bot-actions').forEach((menu) => {
      menu.querySelectorAll('.pin-action, [data-menu-action="detail"]').forEach((action) => action.remove());
    });
  };

  document.addEventListener('click', (event) => {
    const action = event.target?.closest?.('.bot-actions .pin-action, .bot-actions [data-menu-action="detail"]');
    if (!action) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    action.remove();
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeLegacyMenuActions, { once: true });
  } else {
    removeLegacyMenuActions();
  }

  const observer = new MutationObserver(removeLegacyMenuActions);
  observer.observe(document.body, { childList: true, subtree: true });
})();
