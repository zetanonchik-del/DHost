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
    .bot-card { overflow: visible !important; position: relative; }
    .bot-list { overflow: visible !important; }
    .bot-actions {
      z-index: 99999 !important;
      position: absolute !important;
      pointer-events: auto !important;
      isolation: isolate;
    }
    .bot-actions .bot-action { position: relative; z-index: 100000 !important; pointer-events: auto !important; }
    .home-top-actions, .home-top-action, .bot-menu-button,
    #btn-open-bot, #btn-open-top, #btn-refresh-top, #btn-filter,
    .filter-chip { position: relative; z-index: 2; touch-action: manipulation; }
    .search-box input { -webkit-user-select: text !important; user-select: text !important; }
    .search-box { touch-action: manipulation; }
    .home-top-action:disabled { opacity: .65; pointer-events: none; }
    .dhost-hidden-search { display: none !important; }
    .dhost-install-hint { position: fixed; left: 50%; bottom: max(22px, env(safe-area-inset-bottom)); transform: translateX(-50%); z-index: 1000000; max-width: calc(100vw - 32px); pointer-events: none; }

    /* Chat button on bot card */
    .btn-chats {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: 8px 12px;
      margin-top: 8px;
      background: var(--bg-secondary, #1a1a24);
      border: 1px solid var(--border, #2a2a3a);
      border-radius: 8px;
      color: var(--text-primary, #e0e0e8);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      touch-action: manipulation;
    }
    .btn-chats:hover { background: var(--bg-hover, #2a2a3e); }
    .btn-chats:active { background: var(--bg-active, #3a3a4e); border-color: var(--accent, #4a9eff); }
    .btn-chats svg { width: 18px; height: 18px; flex-shrink: 0; }
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
    return document.activeElement === input || !!menu || !!(filter && getComputedStyle(filter).display !== 'none');
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
      // Re-wire chat buttons after render
      wireChatButtons();
      return result;
    };
    renderWrapped = true;
  }

  function wireChatButtons() {
    document.querySelectorAll('.btn-chats').forEach((btn) => {
      // Remove old listener to avoid duplicates
      btn.removeEventListener('click', handleChatClick);
      btn.addEventListener('click', handleChatClick);
    });
  }

  function handleChatClick(e) {
    e.stopPropagation();
    const botName = this.dataset.bot;
    if (!botName) return;
    if (typeof window.navigateTo === 'function') {
      window.navigateTo('chats', { botName });
    } else if (typeof window.DHOST_UI?.showDialogs === 'function') {
      window.DHOST_UI.showDialogs(botName);
    } else {
      console.warn('DHost: navigateTo or DHOST_UI.showDialogs not found');
    }
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
    try { window.location.href = url; return true; } catch (_) {}
    try { window.open(url, '_blank', 'noopener,noreferrer'); return true; } catch (_) {}
    return false;
  }

  function showInstallHint() {
    const message = typeof LANG !== 'undefined' && LANG === 'en' ? 'Go to the bot chat' : 'Перейдите в чат с ботом';
    if (typeof window.toast === 'function') {
      window.toast(message, 'ok');
      return;
    }
    const old = document.querySelector('.dhost-install-hint');
    old?.remove();
    const el = document.createElement('div');
    el.className = 'toast-wrap dhost-install-hint';
    el.innerHTML = `<div class="toast ok"><span>${message}</span></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.querySelector('.toast')?.classList.add('show'));
    setTimeout(() => { el.querySelector('.toast')?.classList.remove('show'); setTimeout(() => el.remove(), 180); }, 2000);
  }

  async function openInstallFlowFixed() {
    if (typeof window.haptic === 'function') window.haptic('medium');
    const sub = STATE?.subscription;
    if (sub && sub.used_slots >= sub.max_slots) {
      window.openInfoSheet?.({
        icon: window.ICON?.alertCircle,
        title: window.t?.('limitReachedTitle') || 'Лимит слотов исчерпан',
        text: window.t?.('limitReachedText') || 'Освободите слот или продлите подписку.',
        actionLabel: window.t?.('limitOk') || 'Понятно', danger: true,
      });
      return;
    }
    showInstallHint();
    setTimeout(() => safeTelegramOpen('https://t.me/UserBotHost_Bot?start=install'), 1000);
  }

  function timeoutPromise(ms) { return new Promise((_, reject) => setTimeout(() => reject(new Error('refresh_timeout')), ms)); }

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
      wireChatButtons();
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

  function installRefreshButtonGuard() {
    if (window.__DHOST_V3_REFRESH_GUARD) return;
    window.__DHOST_V3_REFRESH_GUARD = true;
    document.addEventListener('click', (event) => {
      const button = event.target?.closest?.('#btn-refresh-top');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      refreshFixed();
    }, true);
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
    // Patch DHOST_UI.showDialogs if exists
    if (window.DHOST_UI && !window.__DHOST_V3_CHATS_PATCHED) {
      // Store original if needed
      window.__DHOST_V3_CHATS_PATCHED = true;
    }
  }

  // Expose chat button wiring for app.js
  window.wireChatButtons = wireChatButtons;

  function apply() {
    installStyle();
    patchRender();
    patchButtons();
    installSearchGuard();
    installOutsideMenuClose();
    installRefreshButtonGuard();
    applySearchVisibility();
    wireChatButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();

  const observer = new MutationObserver(() => {
    patchButtons();
    applySearchVisibility();
    wireChatButtons();
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
})();
