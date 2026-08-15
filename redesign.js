/* DHost UI polish: compact sticky controls, animated statuses, search and filters. */
const UI = { query: "", filter: "all" };
const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
const FILTER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/><circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ACTIVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';

const REDESIGN_STYLE = `
.home-top-actions{display:flex;align-items:center;gap:6px}.home-top-action{width:34px;height:34px;min-width:34px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-dim);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .12s,background .15s,border-color .15s,color .15s}.home-top-action svg{width:17px;height:17px}.home-top-action:active{transform:scale(.92);background:var(--bg-card-hover)}.home-top-action.primary{color:#fff;background:var(--blue);border-color:rgba(59,130,246,.5);box-shadow:0 5px 14px rgba(59,130,246,.15)}.home-top-action.spinning .refresh-svg{animation:spin .7s linear infinite}.topbar-home{padding-bottom:9px}.topbar-home .topbar-title{font-size:16px}.topbar-home .topbar-spacer{min-width:8px}
.screen.home-screen{padding-top:2px;gap:10px}.home-summary{margin-top:0}.summary{padding:13px 14px;border-radius:18px}.summary-count{font-size:22px}.summary-meta{font-size:10px}.summary-progress{height:4px;margin-top:10px}.summary-foot{margin-top:6px;font-size:9px}.summary-stats{gap:7px;margin-top:11px}.summary-stat{position:relative;min-height:55px;padding:8px 9px;overflow:hidden}.summary-stat-head{display:flex;align-items:center;gap:6px}.summary-stat-value{font-size:14px}.summary-stat-label{font-size:9px;margin-top:2px}.summary-stat .status-wave{width:7px;height:7px;min-width:7px;border-radius:50%;position:relative;display:inline-block}.summary-stat .status-wave:before,.summary-stat .status-wave:after{content:"";position:absolute;inset:-3px;border:1px solid currentColor;border-radius:50%;opacity:0;animation:statusWave 2s ease-out infinite}.summary-stat .status-wave:after{animation-delay:1s}.summary-stat.running{color:var(--ok)}.summary-stat.installing{color:var(--warn)}.summary-stat.error{color:var(--err)}.summary-stat.running .status-wave{background:var(--ok);box-shadow:0 0 9px rgba(53,208,127,.5)}.summary-stat.installing .status-wave{background:var(--warn);box-shadow:0 0 9px rgba(242,184,75,.45)}.summary-stat.error .status-wave{background:var(--err);box-shadow:0 0 9px rgba(255,102,85,.45)}.summary-stat .summary-stat-label{color:var(--text-faint)}@keyframes statusWave{0%{transform:scale(.65);opacity:.7}75%,100%{transform:scale(2.2);opacity:0}}
.search-row{gap:7px}.search-box{height:39px;border-radius:11px;padding:0 11px}.search-box svg{width:15px}.search-box input{font-size:12px}.filter-button{width:39px;height:39px;min-width:39px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:11px}.filter-button svg{width:17px;height:17px}.filter-button:not(.active){color:#858f98}.filter-button:not(.active):hover{color:var(--text)}
.bot-list{gap:8px}.bot-card{padding:12px 13px;border-radius:15px}.bot-card-top{gap:8px}.bot-card-name{font-size:14px}.bot-card-unit{font-size:9px;margin-top:2px}.status-pill{padding:4px 8px;font-size:9.5px}.status-dot{width:5px;height:5px;position:relative}.status-dot:before,.status-dot:after{content:"";position:absolute;inset:-3px;border:1px solid currentColor;border-radius:50%;opacity:0;animation:statusWave 2.2s ease-out infinite}.status-dot:after{animation-delay:1.1s}.status-running .status-dot{box-shadow:0 0 7px rgba(53,208,127,.65)}.status-installing .status-dot{box-shadow:0 0 7px rgba(242,184,75,.55)}.status-error .status-dot{box-shadow:0 0 7px rgba(255,102,85,.55)}.bot-card-meters{gap:9px;margin-top:11px}.meter{gap:4px}.meter-label{font-size:9px}.meter-track{height:4px}.bot-card-foot{margin-top:9px;font-size:9px}.home-screen>.btn-primary{margin-top:0}
@media(max-width:360px){.home-top-action{width:32px;height:32px;min-width:32px}.home-top-action svg{width:16px;height:16px}.summary{padding:12px}.summary-stat{padding:7px 8px}.bot-card{padding:11px 12px}}
`;

function injectRedesignStyle(){
  if(document.getElementById("dhost-redesign-style")) return;
  const style=document.createElement("style"); style.id="dhost-redesign-style"; style.textContent=REDESIGN_STYLE; document.head.appendChild(style);
}

function filteredBots() {
  const q = UI.query.trim().toLowerCase();
  return STATE.bots.filter(b => {
    const matchesQuery = !q || `${b.name} ${b.unit} ${b.platform}`.toLowerCase().includes(q);
    const matchesFilter = UI.filter === "all" || b.status === UI.filter;
    return matchesQuery && matchesFilter;
  });
}

function screenHome() {
  if (STATE.loading) return `<div class="screen home-screen"><div class="skel skel-card"></div><div class="skel skel-card"></div></div>`;
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

  return `<div class="screen home-screen">
    <div class="summary home-summary"><div class="summary-top"><div><div class="summary-count">${used}<span> / ${max}</span></div><div class="summary-meta">${t("slots")}</div></div><div class="summary-meta">${sub?.expires_at ? `${t("expires")}: ${fmtDate(sub.expires_at)}` : ""}</div></div>
      <div class="summary-progress"><div style="width:${pct}%"></div></div><div class="summary-foot"><span>${used} ${LANG === "ru" ? "использовано" : "used"}</span><span>${Math.max(max-used,0)} ${LANG === "ru" ? "доступно" : "available"}</span></div>
      <div class="summary-stats">
        <div class="summary-stat running"><div class="summary-stat-head"><span class="status-wave"></span><div class="summary-stat-value">${running}</div></div><div class="summary-stat-label">${LANG === "ru" ? "Работают" : "Running"}</div></div>
        <div class="summary-stat installing"><div class="summary-stat-head"><span class="status-wave"></span><div class="summary-stat-value">${installing}</div></div><div class="summary-stat-label">${LANG === "ru" ? "Запускаются" : "Starting"}</div></div>
        <div class="summary-stat error"><div class="summary-stat-head"><span class="status-wave"></span><div class="summary-stat-value">${errors}</div></div><div class="summary-stat-label">${LANG === "ru" ? "Ошибки" : "Errors"}</div></div>
      </div>
    </div>
    <div class="search-row"><label class="search-box">${SEARCH_ICON}<input id="bot-search" value="${UI.query.replace(/"/g,"&quot;")}" placeholder="${LANG === "ru" ? "Поиск юзербота" : "Search userbot"}" autocomplete="off"></label><button class="filter-button ${UI.filter !== "all" ? "active" : ""}" id="btn-filter" aria-label="${LANG === "ru" ? "Фильтр" : "Filter"}" title="${LANG === "ru" ? "Фильтр" : "Filter"}">${FILTER_ICON}</button></div>
    <div class="filter-menu" id="filter-menu" style="display:${UI.filter === "all" ? "none" : "flex"}"><button class="filter-chip ${UI.filter === "all" ? "active" : ""}" data-filter="all">${LANG === "ru" ? "Все" : "All"}</button><button class="filter-chip ${UI.filter === "running" ? "active" : ""}" data-filter="running">${LANG === "ru" ? "Работают" : "Running"}</button><button class="filter-chip ${UI.filter === "stopped" ? "active" : ""}" data-filter="stopped">${LANG === "ru" ? "Остановлены" : "Stopped"}</button><button class="filter-chip ${UI.filter === "error" ? "active" : ""}" data-filter="error">${LANG === "ru" ? "Ошибки" : "Errors"}</button></div>
    <div class="bot-list">${cards || `<div class="empty-search">${LANG === "ru" ? "Ничего не найдено" : "Nothing found"}</div>`}</div>
    <button class="btn btn-primary" id="btn-open-bot">${ICON.plus}${t("installNew")}</button>
  </div>`;
}

function renderHeader(screen) {
  const meta = HEADER_META[screen] || HEADER_META.home;
  const showBack = NAV.stack.length > 1;
  if(screen === "home") return `<div class="topbar topbar-home"><div class="topbar-title">${meta.title()}</div><div class="topbar-spacer"></div><div class="home-top-actions"><button class="home-top-action" id="btn-refresh-top" aria-label="${t("refresh")}" title="${t("refresh")}">${ICON.refresh}</button><button class="home-top-action primary" id="btn-open-top" aria-label="${t("installNew")}" title="${t("installNew")}">${ICON.plus}</button><button class="home-top-action" id="btn-settings" aria-label="${LANG === "ru" ? "Настройки" : "Settings"}" title="${LANG === "ru" ? "Настройки" : "Settings"}">${ICON.settings}</button></div></div>`;
  return `<div class="topbar">${showBack ? `<div class="topbar-back" id="btn-back">${ICON.back}</div>` : ""}<div><div class="topbar-title">${meta.title()}</div>${meta.sub() ? `<div class="topbar-sub">${meta.sub()}</div>` : ""}</div><div class="topbar-spacer"></div>${meta.action === "settings" ? `<div class="topbar-action" id="btn-settings">${ICON.settings}</div>` : ""}</div>`;
}

function render() {
  injectRedesignStyle();
  const app = document.getElementById("app");
  const screen = STATE.authorized === false ? "gate" : currentScreen();
  const body = {gate:screenGate,home:screenHome,detail:screenDetail,settings:screenSettings,language:screenLanguage}[screen]();
  app.innerHTML = renderHeader(screen) + body;
  syncTelegramBackButton();
  wireEvents(screen);
}

async function openInstallFlow(){
  haptic("medium");
  const sub = STATE.subscription || (await fetchSubscription());
  STATE.subscription = sub;
  if (sub && sub.used_slots >= sub.max_slots) { openInfoSheet({icon:ICON.alertCircle,title:t("limitReachedTitle"),text:t("limitReachedText"),actionLabel:t("limitOk"),danger:true}); return; }
  openTelegramLink("https://t.me/UserBotHost_Bot?start=install");
}

async function refreshHome(){
  const buttons=[document.getElementById("btn-refresh-top"),document.getElementById("btn-refresh-icon")].filter(Boolean);
  buttons.forEach(b=>{b.disabled=true;b.classList.add("spinning");});
  await loadAll();
  haptic("success");
}

function wireEvents(screen) {
  document.getElementById("btn-back")?.addEventListener("click", goBack);
  document.getElementById("btn-settings")?.addEventListener("click", () => navigateTo("settings"));
  document.getElementById("btn-open-bot")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-open-top")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-refresh-top")?.addEventListener("click", refreshHome);
  if(screen === "home") {
    const search=document.getElementById("bot-search");
    search?.addEventListener("input",e=>{UI.query=e.target.value;render();const s=document.getElementById("bot-search");s?.focus();s?.setSelectionRange(s.value.length,s.value.length)});
    document.querySelectorAll("[data-filter]").forEach(el=>el.addEventListener("click",()=>{UI.filter=el.dataset.filter;render()}));
    document.getElementById("btn-filter")?.addEventListener("click",()=>{const menu=document.getElementById("filter-menu");if(menu)menu.style.display=menu.style.display==="none"?"flex":"none"});
    document.querySelectorAll(".bot-card").forEach(card=>card.addEventListener("click",()=>{const bot=STATE.bots.find(b=>b.name===card.dataset.bot);if(bot)navigateTo("detail",{name:bot.name,unit:bot.unit})}));
  }
  if(screen === "detail") document.querySelectorAll(".action-btn[data-action]").forEach(el=>el.addEventListener("click",()=>handleBotAction(el.dataset.action,NAV.params.name)));
  if(screen === "settings") { document.getElementById("row-language")?.addEventListener("click",()=>navigateTo("language")); document.getElementById("row-support")?.addEventListener("click",()=>openTelegramLink("https://t.me/userbothostchat")); }
  if(screen === "language") document.querySelectorAll("[data-lang]").forEach(el=>el.addEventListener("click",async()=>{const lang=el.dataset.lang;if(lang===LANG)return;LANG=lang;await setLanguage(lang);haptic("light");goBack()}));
}
