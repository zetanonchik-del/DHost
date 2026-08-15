/* DHost refresh controller.
 * Initial load may show the skeleton. Subsequent 3s/live refreshes never replace
 * the page with a loading skeleton, so the home screen stays visually stable.
 */
(() => {
  if (window.__DHOST_REFRESH_CONTROLLER_V1 || typeof window.loadAll !== 'function') return;

  const originalLoadAll = window.loadAll;
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
      toast(t('actionError'), 'err');
    } finally {
      STATE.loading = false;
      loadedOnce = true;
      render();
    }
  };

  window.__DHOST_REFRESH_CONTROLLER_V1 = true;
})();
