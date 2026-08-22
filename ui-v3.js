/* DHost UI v3: interaction stability for menus, search, refresh and mobile. */
(() => {
  const STYLE_ID = 'dhost-ui-v3-style';
  const REFRESH_TIMEOUT = 12000;
  let originalRender = null;
  let renderWrapped = false;
  let searchInputEvent = false;
  let userInteractionRender = false;
  let manualRefresh = false;

  const css = `
    .bot-card { overflow: visible !important; }
    .bot-list { overflow: visible !important; }
    .bot-actions {
      z-index: 99999 !important;
      position: absolute !important;
      pointer-events: auto !important;
      isolation: isolate;
    }
    .bot-actions .bot-action { position: relative; z-index: 1; }
    .home-top-actions, .home-top-action, .bot-menu-button,
    #btn-open-bot, #btn-open-top, #btn-refresh-top, #btn-filter,
    .filter-chip { position: relative; z-index: 2; touch-action: manipulation; }
    .search-box input { -webkit-user-select: text !important; user-select: text !important; }
    .search-box { touch-action: manipulation; }
    .home-top-action:disabled { opacity: .65; pointer-events: none; }
    .dhost-hidden-search { display: none !important; }
  `;

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function searchIsActive() {
    const input = document.getElementById('bot-search');
    const filter = document.getElementById('filter-menu');
    const menu = document.querySelector('.bot-actions');
    return document.activeElement === input ||
      !!menu ||
      !!(filter && getComputedStyle(filter).display !== 'none');
  }

  function applySearchVisibility() {
    const row = document.querySelector('.search-row');
    const filter = document.getElementById('filter-menu');
    const shouldShow = Array.isArray(STATE?.bots) && STATE.bots.length > 5;
    if (row) row.classList.toggle('dhost-hidden-search', !shouldShow);
    if (!shouldShow && filter) filter.style.display = 'none';
  }

  function installOutsideMenuClose() {
    if (window.__DHOST_V3_OUTSIDE_MENU) return;
    window.__DHOST_V3_OUTSIDE_MENU = true;
    document.addEventListener('pointerdown', (event) => {
      const menu = document.querySelector('.bot-actions');
      if (!menu) return;
      if (event.target.closest('.bot-actions') || event.target.closest('.bot-menu-button')) return;
      if (window.DHOST_UI) window.DHOST_UI.menu = null;
      if (typeof window.render === 'function') window.render();
    }, true);
  }

  function patchRender() {
    if (renderWrapped || typeof window.render !== 'function') return;
    originalRender = window.render;
    window.render = function stableRender(...args) {
      if (!searchInputEvent && !userInteractionRender && !manualRefresh && searchIsActive()) return;
      userInteractionRender = false;
      const result = originalRender.apply(this, args);
      applySearchVisibility();
      return result;
    };
    renderWrapped = true;
  }

  function installSearchGuard() {
    if (window.__DHOST_V3_SEARCH_GUARD) return;
    window.__DHOST_V3_SEARCH_GUARD = true;
    document.addEventListener('input', (event) => {
      if (event.target?.id !== 'bot-search') return;
      searchInputEvent = true;
      queueMicrotask(() => { searchInputEvent = false; });
    }, true);
    document.addEventListener('pointerdown', (event) => {
      if (event.target?.closest?.('button, .filter-chip, .bot-menu-button, .bot-action, .bot-card')) {
        userInteractionRender = true;
        setTimeout(() => { userInteractionRender = false; }, 0);
      }
    }, true);
  }

  function safeTelegramOpen(url) {
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
        return true;
      }
    } catch (_) {}
    try {
      window.location.href = url;
      return true;
    } catch (_) {}
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    } catch (_) {}
    return false;
  }

  async function openInstallFlowFixed() {
    if (typeof window.haptic === 'function') window.haptic('medium');
    const sub = STATE?.subscription;
    if (sub && sub.used_slots >= sub.max_slots) {
      window.openInfoSheet?.({
        icon: window.ICON?.alertCircle,
        title: window.t?.('limitReachedTitle') || 'Лимит слотов исчерпан',
        text: window.t?.('limitReachedText') || 'Освободите слот или продлите подписку.',
        actionLabel: window.t?.('limitOk') || 'Понятно',
        danger: true,
      });
      return;
    }
    safeTelegramOpen('https://t.me/UserBotHost_Bot?start=install');
  }

  function timeoutPromise(ms) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('refresh_timeout')), ms));
  }

  async function refreshFixed() {
    if (manualRefresh) return;
    manualRefresh = true;
    const button = document.getElementById('btn-refresh-top');
    button?.classList.add('spinning');
    if (button) button.disabled = true;

    try {
      const auth = await Promise.race([window.fetchAuthStatus(), timeoutPromise(REFRESH_TIMEOUT)]);
      STATE.authorized = auth.authorized;
      if (auth.authorized) {
        const result = await Promise.race([
          Promise.all([window.fetchBots(), window.fetchSubscription()]),
          timeoutPromise(REFRESH_TIMEOUT),
        ]);
        STATE.bots = result[0];
        STATE.subscription = result[1];
      }
      originalRender?.();
      applySearchVisibility();
      window.haptic?.('success');
    } catch (error) {
      console.warn('DHost manual refresh failed', error);
      window.toast?.(window.t?.('actionError') || 'Не удалось обновить', 'err');
    } finally {
      manualRefresh = false;
      document.querySelectorAll('#btn-refresh-top').forEach((b) => {
        b.disabled = false;
        b.classList.remove('spinning');
      });
    }
  }

  function patchButtons() {
    if (typeof window.openInstallFlow === 'function' && !window.__DHOST_V3_INSTALL_PATCHED) {
      window.openInstallFlow = openInstallFlowFixed;
      window.__DHOST_V3_INSTALL_PATCHED = true;
    }
    if (!window.__DHOST_V3_REFRESH_PATCHED) {
      window.refreshHome = refreshFixed;
      window.__DHOST_V3_REFRESH_PATCHED = true;
    }
  }

  function apply() {
    installStyle();
    patchRender();
    patchButtons();
    installSearchGuard();
    installOutsideMenuClose();
    applySearchVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  const observer = new MutationObserver(() => {
    patchButtons();
    applySearchVisibility();
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
})();
