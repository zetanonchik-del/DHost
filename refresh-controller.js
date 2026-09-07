/* DHost refresh controller */
(() => {
  if (window.__DHOST_REFRESH_CONTROLLER_V1 || typeof window.loadAll !== 'function') return;

  let loadedOnce = false;

  window.loadAll = async function stableLoadAll() {
    const isInitial = !loadedOnce && STATE.authorized === null;

    if (isInitial) {
      STATE.loading = true;
      render();
    }

    try {
      const auth = await fetchAuthStatus();
      STATE.authorized = auth.authorized;
      STATE.canManageChats = Boolean(auth.can_manage_chats);
      STATE.isSuperAdmin = Boolean(auth.is_super_admin);

      if (auth.authorized) {
        const [bots, sub] = await Promise.all([fetchBots(), fetchSubscription()]);
        STATE.bots = bots;
        STATE.subscription = sub;
      }
    } catch (error) {
      console.error('Failed to refresh Mini App data', error);
      STATE.authorized = false;
      STATE.bots = [];
      STATE.subscription = null;
      STATE.isSuperAdmin = false;
      toast(t('actionError'), 'err');
    } finally {
      STATE.loading = false;
      loadedOnce = true;
      render();
    }
  };

  window.__DHOST_REFRESH_CONTROLLER_V1 = true;
})();
