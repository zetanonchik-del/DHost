/* DHost UI polish: search, filters, dashboard summary and cleaner settings. */
const UI = { query: "", filter: "all" };
const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
const FILTER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';
const ACTIVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';

function filteredBots() {
  const q = UI.query.trim().toLowerCase();
  return STATE.bots.filter(b => {
    const matchesQuery = !q || `${b.name} ${b.unit} ${b.platform}`.toLowerCase().includes(q);
    const matchesFilter = UI.filter === "all" || b.status === UI.filter;
    return matchesQuery && matchesFilter;
  });
}

function screenHome() {
  if (STATE.loading) return `<div class="screen"><div class="skel skel-card"></div><div class="skel skel-card"></div></div>`;
  if (!STATE.bots.length) return `<div class="gate"><div class="gate-icon">${ICON.server}</div><div class="gate-title">${t("emptyTitle")}</div><div class="gate-text">${t("emptyText")}</div><button class="btn btn-primary" id="btn-open-bot">${ICON.plus}${t("installNew")}</button>${STATE.subscription ? `<div class="topbar-sub">${STATE.subscription.used_slots}/${STATE.subscription.max_slots} ${t("slots")}</div>` : ""}</div>`;

  const sub = STATE.subscription;
  const running = STATE.bots.filter(b => b.status === "running").length;
  const errors = STATE.bots.filter(b => b.status === "error").length;
  const installing = STATE.bots.filter(b => b.status === "installing").length;
  const used = sub?.used_slots ?? STATE.bots.length;
  const max = sub?.max_slots ?? STATE.bots.length;
  const pct = max ? Math.min(used / max * 100, 100) : 0;
  const bots = filteredBots();

  const cards = bots.map(b => {
    const cpu = Math.max(0, Math.min(Number(b.cpu_percent) || 0, 100));
    const ramLimit = Number(b.ram_limit_mb) || 0;
    const ramUsed = Number(b.ram_used_mb) || 0;
    const ram = ramLimit ? Math.min(ramUsed / ramLimit * 100, 100) : 0;
    return `<div class="bot-card" data-bot="${b.name}">
      <div class="bot-card-top"><div class="bot-name-wrap"><div class="bot-card-name">${b.name}</div><div class="bot-card-unit">${b.unit || b.platform || ""}</div></div><div class="bot-card-spacer"></div>${statusPill(b.status)}</div>
      <div class="bot-card-meters">
        <div class="meter"><div class="meter-label"><span>${t("cpu")}</span><b>${cpu.toFixed(1)}%</b></div><div class="meter-track"><div class="meter-fill ${meterFillClass(cpu)}" style="width:${cpu}%"></div></div></div>
        <div class="meter"><div class="meter-label"><span>${t("ram")}</span><b>${Math.round(ramUsed)}/${Math.round(ramLimit)}MB</b></div><div class="meter-track"><div class="meter-fill ${meterFillClass(ram)}" style="width:${ram}%"></div></div></div>
      </div>
      <div class="bot-card-foot"><span>${t("created")} ${fmtDate(b.created_at)}</span><span>${b.platform || "Server"} · ${fmtUptime(b.uptime_seconds)}</span></div>
    </div>`;
  }).join("");

  return `<div class="screen">
    <div class="screen-head"><div><div class="screen-title">${t("myBots")}</div><div class="screen-caption">${STATE.bots.length} ${t("userbot")}${STATE.bots.length === 1 ? "" : "а"} · ${running} ${LANG === "ru" ? "работают" : "running"}</div></div><button class="icon-button" id="btn-refresh-icon" aria-label="${t("refresh")}">${ICON.refresh}</button></div>
    <div class="summary"><div class="summary-top"><div><div class="summary-count">${used}<span> / ${max}</span></div><div class="summary-meta">${t("slots")}</div></div><div class="summary-meta">${sub?.expires_at ? `${t("expires")}: ${fmtDate(sub.expires_at)}` : ""}</div></div>
      <div class="summary-progress"><div style="width:${pct}%"></div></div><div class="summary-foot"><span>${used} ${LANG === "ru" ? "использовано" : "used"}</span><span>${Math.max(max-used,0)} ${LANG === "ru" ? "доступно" : "available"}</span></div>
      <div class="summary-stats"><div class="summary-stat"><div class="summary-stat-value">${running}</div><div class="summary-stat-label">${LANG === "ru" ? "Работают" : "Running"}</div></div><div class="summary-stat"><div class="summary-stat-value">${installing}</div><div class="summary-stat-label">${LANG === "ru" ? "Запускаются" : "Starting"}</div></div><div class="summary-stat"><div class="summary-stat-value">${errors}</div><div class="summary-stat-label">${LANG === "ru" ? "Ошибки" : "Errors"}</div></div></div>
    </div>
    <div class="search-row"><label class="search-box">${SEARCH_ICON}<input id="bot-search" value="${UI.query.replace(/"/g,"&quot;")}" placeholder="${LANG === "ru" ? "Поиск юзербота" : "Search userbot"}" autocomplete="off"></label><button class="filter-button ${UI.filter !== "all" ? "active" : ""}" id="btn-filter">${FILTER_ICON}</button></div>
    <div class="filter-menu" id="filter-menu" style="display:${UI.filter === "all" ? "none" : "flex"}"><button class="filter-chip ${UI.filter === "all" ? "active" : ""}" data-filter="all">${LANG === "ru" ? "Все" : "All"}</button><button class="filter-chip ${UI.filter === "running" ? "active" : ""}" data-filter="running">${LANG === "ru" ? "Работают" : "Running"}</button><button class="filter-chip ${UI.filter === "stopped" ? "active" : ""}" data-filter="stopped">${LANG === "ru" ? "Остановлены" : "Stopped"}</button><button class="filter-chip ${UI.filter === "error" ? "active" : ""}" data-filter="error">${LANG === "ru" ? "Ошибки" : "Errors"}</button></div>
    <div class="bot-list">${cards || `<div class="empty-search">${LANG === "ru" ? "Ничего не найдено" : "Nothing found"}</div>`}</div>
    <button class="btn btn-primary" id="btn-open-bot">${ICON.plus}${t("installNew")}</button>
  </div>`;
}

function renderHeader(screen) {
  const meta = HEADER_META[screen] || HEADER_META.home;
  const showBack = NAV.stack.length > 1;
  return `<div class="topbar">${showBack ? `<div class="topbar-back" id="btn-back">${ICON.back}</div>` : ""}<div><div class="topbar-title">${meta.title()}</div>${meta.sub() ? `<div class="topbar-sub">${meta.sub()}</div>` : ""}</div><div class="topbar-spacer"></div>${meta.action === "settings" ? `<div class="topbar-action" id="btn-settings">${ICON.settings}</div>` : ""}</div>`;
}

function render() {
  const app = document.getElementById("app");
  const screen = STATE.authorized === false ? "gate" : currentScreen();
  const body = {gate:screenGate,home:screenHome,detail:screenDetail,settings:screenSettings,language:screenLanguage}[screen]();
  app.innerHTML = renderHeader(screen) + body;
  syncTelegramBackButton();
  wireEvents(screen);
}

function wireEvents(screen) {
  document.getElementById("btn-back")?.addEventListener("click", goBack);
  document.getElementById("btn-settings")?.addEventListener("click", () => navigateTo("settings"));
  document.getElementById("btn-open-bot")?.addEventListener("click", async () => {
    haptic("medium");
    const sub = STATE.subscription || (await fetchSubscription()); STATE.subscription = sub;
    if (sub && sub.used_slots >= sub.max_slots) { openInfoSheet({icon:ICON.alertCircle,title:t("limitReachedTitle"),text:t("limitReachedText"),actionLabel:t("limitOk"),danger:true}); return; }
    openTelegramLink("https://t.me/UserBotHost_Bot?start=install");
  });
  if(screen === "home") {
    const refresh = async () => { const b=document.getElementById("btn-refresh-icon"); if(b){b.disabled=true;b.innerHTML=`<span class="spinner"></span>`;} await loadAll(); haptic("success"); };
    document.getElementById("btn-refresh-icon")?.addEventListener("click", refresh);
    const search=document.getElementById("bot-search"); search?.addEventListener("input",e=>{UI.query=e.target.value;render();const s=document.getElementById("bot-search");s?.focus();s?.setSelectionRange(s.value.length,s.value.length)});
    document.getElementById("btn-filter")?.addEventListener("click",()=>{const menu=document.getElementById("filter-menu");if(menu)menu.style.display=menu.style.display==="none"?"flex":"none"});
    document.querySelectorAll("[data-filter]").forEach(el=>el.addEventListener("click",()=>{UI.filter=el.dataset.filter;render()}));
    document.querySelectorAll(".bot-card").forEach(card=>card.addEventListener("click",()=>{const bot=STATE.bots.find(b=>b.name===card.dataset.bot);if(bot)navigateTo("detail",{name:bot.name,unit:bot.unit})}));
  }
  if(screen === "detail") document.querySelectorAll(".action-btn[data-action]").forEach(el=>el.addEventListener("click",()=>handleBotAction(el.dataset.action,NAV.params.name)));
  if(screen === "settings") { document.getElementById("row-language")?.addEventListener("click",()=>navigateTo("language")); document.getElementById("row-support")?.addEventListener("click",()=>openTelegramLink("https://t.me/userbothostchat")); }
  if(screen === "language") document.querySelectorAll("[data-lang]").forEach(el=>el.addEventListener("click",async()=>{const lang=el.dataset.lang;if(lang===LANG)return;LANG=lang;await setLanguage(lang);haptic("light");goBack()}));
}
