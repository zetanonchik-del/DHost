/**
 * app.js — экраны, навигация, Telegram WebApp интеграция.
 * Без сборщика и фреймворка: маленький hash-based роутер + ручной рендер.
 * Вся авторизация (номер/код/2FA) НЕ реализована здесь — см. api.js.
 */

// ---------------------------------------------------------------------------
// Telegram WebApp bootstrap
// ---------------------------------------------------------------------------
const tg = window.Telegram?.WebApp;

function initTelegram() {
  if (!tg) return; // разработка в обычном браузере — просто не сломаемся
  tg.ready();
  tg.expand();
  try { tg.disableVerticalSwipes(); } catch (_) {}
  tg.setHeaderColor("#0b0d0e");
  tg.setBackgroundColor("#0b0d0e");
  tg.setBottomBarColor?.("#0b0d0e");
}

function haptic(type = "light") {
  if (!tg?.HapticFeedback) return;
  if (type === "success" || type === "error" || type === "warning") {
    tg.HapticFeedback.notificationOccurred(type);
  } else {
    tg.HapticFeedback.impactOccurred(type); // "light" | "medium" | "heavy"
  }
}

// ---------------------------------------------------------------------------
// Icons (inline SVG, stroke-based — без внешних зависимостей)
// ---------------------------------------------------------------------------
const ICON = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  stop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>`,
  restart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  reinstall: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>`,
  life: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M14.9 9.1l4.2-4.2M4.9 19.1l4.2-4.2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  alertCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  xCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
};

// ---------------------------------------------------------------------------
// i18n — минимальный словарь под нужды Mini App
// ---------------------------------------------------------------------------
const STR = {
  ru: {
    appTitle: "Юзерботы",
    notAuthTitle: "Аккаунт не подключён",
    notAuthText: "Авторизация в Telegram-аккаунт (номер, код, пароль) происходит в чате с ботом — это отдельный, более защищённый шаг. После входа список ваших юзерботов появится здесь.",
    openBot: "Открыть чат с ботом",
    myBots: "Мои юзерботы",
    installNew: "Установить юзербота",
    emptyTitle: "Пока нет юзерботов",
    emptyText: "Установка тоже начинается в чате с ботом — там бот проведёт вас через вход в аккаунт.",
    cpu: "CPU",
    ram: "RAM",
    created: "создан",
    uptime: "аптайм",
    start: "Запустить",
    stop: "Остановить",
    restart: "Перезапуск",
    reinstall: "Переустановить",
    delete: "Удалить",
    settings: "Настройки",
    language: "Язык",
    subscription: "Подписка",
    slots: "Слоты",
    expires: "Действует до",
    support: "Поддержка",
    confirmStart: "Запустить юзербота?",
    confirmStop: "Остановить юзербота?",
    confirmRestart: "Перезапустить юзербота?",
    confirmReinstall: "Переустановить юзербота?",
    confirmReinstallText: "Сервис будет пересобран заново. Вход в Telegram-аккаунт повторно вводить не нужно — сессия уже сохранена на сервере.",
    confirmDelete: "Удалить юзербота безвозвратно?",
    confirmDeleteText: "Сервис и все его данные на сервере будут удалены. Это действие нельзя отменить.",
    actions: "Действия",
    cancel: "Отмена",
    confirm: "Подтвердить",
    deleteConfirm: "Удалить",
    doneStart: "Юзербот запущен",
    doneStop: "Юзербот остановлен",
    doneRestart: "Юзербот перезапущен",
    doneReinstall: "Переустановка завершена",
    doneDelete: "Юзербот удалён",
    actionError: "Не удалось выполнить действие",
    loading: "Загрузка…",
    limitReachedTitle: "Вы достигли лимита создания юзерботов",
    limitReachedText: "Освободите слот (удалите один из существующих юзерботов) или продлите подписку, чтобы установить новый.",
    limitOk: "Понятно",
    manageSlots: "Управление слотами",
  },
  en: {
    appTitle: "Userbots",
    notAuthTitle: "Account not connected",
    notAuthText: "Signing in to your Telegram account (phone, code, password) happens in the bot's chat — a separate, more secure step. Once signed in, your userbots will show up here.",
    openBot: "Open bot chat",
    myBots: "My userbots",
    installNew: "Install a userbot",
    emptyTitle: "No userbots yet",
    emptyText: "Installation also starts in the bot's chat, where it walks you through signing in.",
    cpu: "CPU",
    ram: "RAM",
    created: "created",
    uptime: "uptime",
    start: "Start",
    stop: "Stop",
    restart: "Restart",
    reinstall: "Reinstall",
    delete: "Delete",
    settings: "Settings",
    language: "Language",
    subscription: "Subscription",
    slots: "Slots",
    expires: "Expires",
    support: "Support",
    confirmStart: "Start this userbot?",
    confirmStop: "Stop this userbot?",
    confirmRestart: "Restart this userbot?",
    confirmReinstall: "Reinstall this userbot?",
    confirmReinstallText: "The service will be rebuilt from scratch. You won't need to sign in again — the session is already stored on the server.",
    confirmDelete: "Delete this userbot permanently?",
    confirmDeleteText: "The service and all its data on the server will be removed. This can't be undone.",
    actions: "Actions",
    cancel: "Cancel",
    confirm: "Confirm",
    deleteConfirm: "Delete",
    doneStart: "Userbot started",
    doneStop: "Userbot stopped",
    doneRestart: "Userbot restarted",
    doneReinstall: "Reinstall complete",
    doneDelete: "Userbot deleted",
    actionError: "Action failed",
    loading: "Loading…",
    limitReachedTitle: "You've reached the userbot creation limit",
    limitReachedText: "Free up a slot (delete one of your existing userbots) or extend your subscription to install a new one.",
    limitOk: "Got it",
    manageSlots: "Manage slots",
  },
};

let LANG = "ru";
const t = (key) => STR[LANG][key] || key;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
const NAV = { stack: ["home"], params: {} };

function currentScreen() { return NAV.stack[NAV.stack.length - 1]; }

function navigateTo(screen, params = {}) {
  NAV.stack.push(screen);
  NAV.params = params;
  haptic("light");
  render();
}

function goBack() {
  if (NAV.stack.length <= 1) {
    tg?.close?.();
    return;
  }
  NAV.stack.pop();
  haptic("light");
  render();
}

// Telegram's own back button (header chevron on iOS/Android/Desktop clients)
function syncTelegramBackButton() {
  if (!tg?.BackButton) return;
  if (NAV.stack.length > 1) {
    tg.BackButton.show();
  } else {
    tg.BackButton.hide();
  }
}
tg?.BackButton?.onClick(() => goBack());

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function toast(message, kind = "ok") {
  const wrap = document.createElement("div");
  wrap.className = "toast-wrap";
  wrap.innerHTML = `<div class="toast ${kind}">${kind === "ok" ? ICON.checkCircle : ICON.xCircle}<span>${message}</span></div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.querySelector(".toast").classList.add("show"));
  setTimeout(() => {
    wrap.querySelector(".toast").classList.remove("show");
    setTimeout(() => wrap.remove(), 250);
  }, 2200);
}

// ---------------------------------------------------------------------------
// Confirm sheet
// ---------------------------------------------------------------------------
function openSheet({ icon, iconClass, title, text, confirmLabel, danger, onConfirm }) {
  const overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-icon" style="background:${danger ? "var(--err-bg)" : "var(--accent-bg)"};color:${danger ? "var(--err)" : "var(--accent)"}">${icon}</div>
    <div class="sheet-title">${title}</div>
    <div class="sheet-text">${text}</div>
    <div class="btn-row" style="margin-bottom:8px">
      <button class="btn btn-ghost btn-sm" data-act="cancel">${t("cancel")}</button>
      <button class="btn ${danger ? "btn-danger" : "btn-primary"} btn-sm" data-act="confirm">${confirmLabel}</button>
    </div>
  `;
  document.body.append(overlay, sheet);
  requestAnimationFrame(() => { overlay.classList.add("open"); sheet.classList.add("open"); });

  const close = () => {
    overlay.classList.remove("open");
    sheet.classList.remove("open");
    setTimeout(() => { overlay.remove(); sheet.remove(); }, 220);
  };
  overlay.addEventListener("click", close);
  sheet.querySelector('[data-act="cancel"]').addEventListener("click", () => { haptic("light"); close(); });
  sheet.querySelector('[data-act="confirm"]').addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>`;
    haptic(danger ? "warning" : "medium");
    try {
      await onConfirm();
    } finally {
      close();
    }
  });
}

// ---------------------------------------------------------------------------
// Info sheet — как openSheet, но без "Отмена": один действие-кнопка.
// Используется, например, для "лимит слотов исчерпан".
// ---------------------------------------------------------------------------
function openInfoSheet({ icon, title, text, actionLabel, danger, onAction }) {
  const overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-icon" style="background:${danger ? "var(--err-bg)" : "var(--warn-bg)"};color:${danger ? "var(--err)" : "var(--warn)"}">${icon}</div>
    <div class="sheet-title">${title}</div>
    <div class="sheet-text">${text}</div>
    <button class="btn btn-primary" data-act="ok" style="margin-bottom:8px">${actionLabel}</button>
  `;
  document.body.append(overlay, sheet);
  requestAnimationFrame(() => { overlay.classList.add("open"); sheet.classList.add("open"); });

  const close = () => {
    overlay.classList.remove("open");
    sheet.classList.remove("open");
    setTimeout(() => { overlay.remove(); sheet.remove(); }, 220);
  };
  overlay.addEventListener("click", close);
  sheet.querySelector('[data-act="ok"]').addEventListener("click", () => {
    haptic("light");
    close();
    onAction?.();
  });
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
function fmtUptime(sec) {
  if (!sec) return "—";
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}${LANG === "ru" ? "д" : "d"} ${h}${LANG === "ru" ? "ч" : "h"}`;
  if (h > 0) return `${h}${LANG === "ru" ? "ч" : "h"} ${m}${LANG === "ru" ? "м" : "m"}`;
  return `${m}${LANG === "ru" ? "м" : "m"}`;
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(LANG === "ru" ? "ru-RU" : "en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS_META = {
  running:     { cls: "status-running",     label: { ru: "работает",      en: "running" } },
  stopped:     { cls: "status-stopped",     label: { ru: "остановлен",    en: "stopped" } },
  installing:  { cls: "status-installing",  label: { ru: "установка…",    en: "installing…" } },
  error:       { cls: "status-error",       label: { ru: "ошибка",        en: "error" } },
};

function statusPill(status) {
  const meta = STATUS_META[status] || STATUS_META.stopped;
  return `<span class="status-pill ${meta.cls}"><span class="status-dot"></span>${meta.label[LANG]}</span>`;
}

function meterFillClass(percent) {
  if (percent >= 90) return "err";
  if (percent >= 70) return "warn";
  return "";
}

// ---------------------------------------------------------------------------
// App state
// ---------------------------------------------------------------------------
const STATE = {
  authorized: null,
  bots: [],
  subscription: null,
  loading: true,
};

async function loadAll() {
  STATE.loading = true;
  render();
  const auth = await fetchAuthStatus();
  STATE.authorized = auth.authorized;
  if (auth.authorized) {
    const [bots, sub] = await Promise.all([fetchBots(), fetchSubscription()]);
    STATE.bots = bots;
    STATE.subscription = sub;
  }
  STATE.loading = false;
  render();
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
function screenGate() {
  return `
    <div class="gate">
      <div class="gate-icon">${ICON.lock}</div>
      <div class="gate-title">${t("notAuthTitle")}</div>
      <div class="gate-text">${t("notAuthText")}</div>
      <button class="btn btn-primary" id="btn-open-bot">${t("openBot")}</button>
    </div>
  `;
}

function screenHome() {
  if (STATE.loading) {
    return `
      <div class="screen">
        <div class="skel skel-card"></div>
        <div class="skel skel-card"></div>
      </div>
    `;
  }

  if (STATE.bots.length === 0) {
    return `
      <div class="gate">
        <div class="gate-icon">${ICON.server}</div>
        <div class="gate-title">${t("emptyTitle")}</div>
        <div class="gate-text">${t("emptyText")}</div>
        <button class="btn btn-primary" id="btn-open-bot">${t("installNew")}</button>
        ${STATE.subscription ? `<div class="topbar-sub" style="margin-top:2px">${STATE.subscription.used_slots}/${STATE.subscription.max_slots} slots</div>` : ""}
      </div>
    `;
  }

  const cards = STATE.bots.map((b) => {
    const cpuPct = Math.min(b.cpu_percent, 100);
    const ramPct = b.ram_limit_mb ? Math.min((b.ram_used_mb / b.ram_limit_mb) * 100, 100) : 0;
    return `
      <div class="bot-card" data-bot="${b.name}">
        <div class="bot-card-top">
          <div>
            <div class="bot-card-name">${b.name}</div>
            <div class="bot-card-unit">${b.unit}</div>
          </div>
          <div class="bot-card-spacer"></div>
          ${statusPill(b.status)}
        </div>
        <div class="bot-card-meters">
          <div class="meter">
            <div class="meter-label"><span>${t("cpu")}</span><b>${cpuPct.toFixed(1)}%</b></div>
            <div class="meter-track"><div class="meter-fill ${meterFillClass(cpuPct)}" style="width:${cpuPct}%"></div></div>
          </div>
          <div class="meter">
            <div class="meter-label"><span>${t("ram")}</span><b>${Math.round(b.ram_used_mb)}/${Math.round(b.ram_limit_mb)}MB</b></div>
            <div class="meter-track"><div class="meter-fill ${meterFillClass(ramPct)}" style="width:${ramPct}%"></div></div>
          </div>
        </div>
        <div class="bot-card-foot">
          <span>${t("created")} ${fmtDate(b.created_at)}</span>
          <span>${b.platform} · ${fmtUptime(b.uptime_seconds)}</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="screen">
      <div class="section-label">${t("myBots")}</div>
      ${cards}
      <button class="btn btn-ghost" id="btn-open-bot" style="margin-top:4px">${ICON.plus}${t("installNew")}</button>
      ${STATE.subscription ? `<div class="topbar-sub" style="text-align:center">${STATE.subscription.used_slots}/${STATE.subscription.max_slots} slots</div>` : ""}
    </div>
  `;
}

function screenDetail() {
  const bot = STATE.bots.find((b) => b.name === NAV.params.name);
  if (!bot) return `<div class="screen"><div class="gate-text">Not found</div></div>`;

  const cpuPct = Math.min(bot.cpu_percent, 100);
  const ramPct = bot.ram_limit_mb ? Math.min((bot.ram_used_mb / bot.ram_limit_mb) * 100, 100) : 0;
  const isRunning = bot.status === "running";
  const isBusy = bot.status === "installing";

  return `
    <div class="screen">
      <div class="detail-hero">
        <div class="detail-hero-top">
          <div>
            <div class="detail-name">${bot.name}</div>
            <div class="detail-unit">${bot.unit}</div>
          </div>
          ${statusPill(bot.status)}
        </div>
        <div class="detail-meters">
          <div>
            <div class="detail-meter-value">${cpuPct.toFixed(1)}%</div>
            <div class="detail-meter-cap">${t("cpu")}</div>
            <div class="meter-track" style="margin-top:8px"><div class="meter-fill ${meterFillClass(cpuPct)}" style="width:${cpuPct}%"></div></div>
          </div>
          <div>
            <div class="detail-meter-value">${Math.round(ramPct)}%</div>
            <div class="detail-meter-cap">${t("ram")} · ${Math.round(bot.ram_used_mb)}/${Math.round(bot.ram_limit_mb)}MB</div>
            <div class="meter-track" style="margin-top:8px"><div class="meter-fill ${meterFillClass(ramPct)}" style="width:${ramPct}%"></div></div>
          </div>
        </div>
      </div>

      <div class="detail-info-grid">
        <div class="info-card">
          <div class="info-card-label">${t("created")}</div>
          <div class="info-card-value">${fmtDate(bot.created_at)}</div>
        </div>
        <div class="info-card">
          <div class="info-card-label">${t("uptime")}</div>
          <div class="info-card-value">${fmtUptime(bot.uptime_seconds)}</div>
        </div>
      </div>

      <div class="section-label">${t("actions")}</div>
      <div class="action-grid">
        <div class="action-btn" data-action="${isRunning ? "stop" : "start"}" ${isBusy ? "style='opacity:.4;pointer-events:none'" : ""}>
          ${isRunning ? ICON.stop : ICON.play}
          <span>${isRunning ? t("stop") : t("start")}</span>
        </div>
        <div class="action-btn" data-action="restart" ${isBusy ? "style='opacity:.4;pointer-events:none'" : ""}>
          ${ICON.restart}<span>${t("restart")}</span>
        </div>
        <div class="action-btn" data-action="reinstall" ${isBusy ? "style='opacity:.4;pointer-events:none'" : ""}>
          ${ICON.reinstall}<span>${t("reinstall")}</span>
        </div>
        <div class="action-btn danger" data-action="delete">
          ${ICON.trash}<span>${t("delete")}</span>
        </div>
      </div>
    </div>
  `;
}

function screenSettings() {
  const sub = STATE.subscription;
  const slotsPct = sub ? Math.min((sub.used_slots / sub.max_slots) * 100, 100) : 0;

  return `
    <div class="screen">
      <div class="section-label">${t("subscription")}</div>
      <div class="sub-card">
        <div class="sub-row">
          <span class="sub-label">${t("slots")}</span>
          <span class="sub-value">${sub ? `${sub.used_slots} / ${sub.max_slots}` : "—"}</span>
        </div>
        <div class="sub-slots-track"><div class="sub-slots-fill" style="width:${slotsPct}%"></div></div>
        <div class="sub-row" style="margin-top:14px">
          <span class="sub-label">${t("expires")}</span>
          <span class="sub-value">${sub?.expires_at ? fmtDate(sub.expires_at) : "—"}</span>
        </div>
      </div>

      <div class="section-label">${t("settings")}</div>
      <div class="list-card">
        <div class="list-row" id="row-language">
          <div class="list-row-icon">${ICON.globe}</div>
          <div class="list-row-label">${t("language")}</div>
          <div class="list-row-value">${LANG === "ru" ? "Русский" : "English"}</div>
          <div class="list-row-chevron">${ICON.chevronRight}</div>
        </div>
        <div class="list-row" id="row-support">
          <div class="list-row-icon">${ICON.life}</div>
          <div class="list-row-label">${t("support")}</div>
          <div class="list-row-chevron">${ICON.chevronRight}</div>
        </div>
      </div>
    </div>
  `;
}

function screenLanguage() {
  const opts = [
    { code: "ru", label: "🇷🇺 Русский" },
    { code: "en", label: "🇬🇧 English" },
  ];
  return `
    <div class="screen">
      <div class="list-card">
        ${opts.map((o) => `
          <div class="list-row ${LANG === o.code ? "selected" : ""}" data-lang="${o.code}">
            <div class="list-row-label">${o.label}</div>
            ${LANG === o.code ? `<div class="list-row-check">${ICON.check}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Header per screen
// ---------------------------------------------------------------------------
const HEADER_META = {
  home:     { title: () => t("appTitle"), sub: () => (STATE.subscription ? `${STATE.subscription.used_slots}/${STATE.subscription.max_slots} slots` : "") , action: "settings" },
  detail:   { title: () => NAV.params.name, sub: () => NAV.params.unit || "", action: null },
  settings: { title: () => t("settings"), sub: () => "", action: null },
  language: { title: () => t("language"), sub: () => "", action: null },
  gate:     { title: () => t("appTitle"), sub: () => "", action: null },
};

function renderHeader(screen) {
  const meta = HEADER_META[screen] || HEADER_META.home;
  const showBack = NAV.stack.length > 1;
  return `
    <div class="topbar">
      ${showBack ? `<div class="topbar-back" id="btn-back">${ICON.back}</div>` : ""}
      <div>
        <div class="topbar-title">${meta.title()}</div>
        ${meta.sub() ? `<div class="topbar-sub">${meta.sub()}</div>` : ""}
      </div>
      <div class="topbar-spacer"></div>
      ${meta.action === "settings" ? `<div class="topbar-action" id="btn-settings">${ICON.settings}</div>` : ""}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Render + event wiring
// ---------------------------------------------------------------------------
function render() {
  const app = document.getElementById("app");
  const screen = STATE.authorized === false ? "gate" : currentScreen();

  const body = {
    gate: screenGate,
    home: screenHome,
    detail: screenDetail,
    settings: screenSettings,
    language: screenLanguage,
  }[screen]();

  app.innerHTML = renderHeader(screen) + body;
  syncTelegramBackButton();
  wireEvents(screen);
}

function wireEvents(screen) {
  document.getElementById("btn-back")?.addEventListener("click", goBack);
  document.getElementById("btn-settings")?.addEventListener("click", () => navigateTo("settings"));

  // "Открыть чат с ботом" — вся авторизация и установка остаются там.
  // Перед этим проверяем лимит слотов, чтобы не гонять человека в чат
  // просто ради сообщения "лимит исчерпан" — покажем сразу здесь.
  document.getElementById("btn-open-bot")?.addEventListener("click", async () => {
    haptic("medium");
    const sub = STATE.subscription || (await fetchSubscription());
    STATE.subscription = sub;

    if (sub && sub.used_slots >= sub.max_slots) {
      openInfoSheet({
        icon: ICON.alertCircle,
        title: t("limitReachedTitle"),
        text: t("limitReachedText"),
        actionLabel: t("limitOk"),
        danger: true,
      });
      return;
    }

    // TODO: подставьте username вашего бота
    tg?.openTelegramLink?.("https://t.me/your_userbot_hosting_bot?start=install");
  });

  if (screen === "home") {
    document.querySelectorAll(".bot-card").forEach((card) => {
      card.addEventListener("click", () => {
        const bot = STATE.bots.find((b) => b.name === card.dataset.bot);
        navigateTo("detail", { name: bot.name, unit: bot.unit });
      });
    });
  }

  if (screen === "detail") {
    document.querySelectorAll(".action-btn[data-action]").forEach((el) => {
      el.addEventListener("click", () => handleBotAction(el.dataset.action, NAV.params.name));
    });
  }

  if (screen === "settings") {
    document.getElementById("row-language")?.addEventListener("click", () => navigateTo("language"));
    document.getElementById("row-support")?.addEventListener("click", () => {
      tg?.openTelegramLink?.("https://t.me/your_support_username");
    });
  }

  if (screen === "language") {
    document.querySelectorAll("[data-lang]").forEach((el) => {
      el.addEventListener("click", async () => {
        const lang = el.dataset.lang;
        if (lang === LANG) return;
        LANG = lang;
        await setLanguage(lang);
        haptic("light");
        goBack();
      });
    });
  }
}

async function handleBotAction(action, name) {
  const bot = STATE.bots.find((b) => b.name === name);
  if (!bot) return;

  const sheets = {
    start:     { icon: ICON.play, title: t("confirmStart"), text: bot.name, confirmLabel: t("start"), danger: false, done: t("doneStart") },
    stop:      { icon: ICON.stop, title: t("confirmStop"), text: bot.name, confirmLabel: t("stop"), danger: false, done: t("doneStop") },
    restart:   { icon: ICON.restart, title: t("confirmRestart"), text: bot.name, confirmLabel: t("restart"), danger: false, done: t("doneRestart") },
    reinstall: { icon: ICON.reinstall, title: t("confirmReinstall"), text: t("confirmReinstallText"), confirmLabel: t("reinstall"), danger: false, done: t("doneReinstall") },
    delete:    { icon: ICON.trash, title: t("confirmDelete"), text: t("confirmDeleteText"), confirmLabel: t("deleteConfirm"), danger: true, done: t("doneDelete") },
  };
  const cfg = sheets[action];

  openSheet({
    icon: cfg.icon,
    title: cfg.title,
    text: cfg.text,
    confirmLabel: cfg.confirmLabel,
    danger: cfg.danger,
    onConfirm: async () => {
      try {
        let res;
        if (action === "delete") res = await deleteBot(name);
        else if (action === "reinstall") res = await reinstallBot(name);
        else res = await botAction(name, action);

        if (res.success) {
          haptic("success");
          toast(cfg.done, "ok");
          if (action === "delete") {
            NAV.stack = ["home"];
          } else {
            STATE.bots = await fetchBots();
          }
          render();
        } else {
          throw new Error(res.error || "unknown");
        }
      } catch (e) {
        haptic("error");
        toast(t("actionError"), "err");
      }
    },
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
(async function boot() {
  initTelegram();
  LANG = await fetchLanguage();
  document.getElementById("boot-screen")?.remove();
  await loadAll();
})();
