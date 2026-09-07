/* ==========================================================================
   UserBotHost UI Cyberpunk Redesign + Enhanced Super-Admin Panel
   ========================================================================== */

const UI = { query: "", filter: "all" };

function syncSavedLanguage() {
  try {
    const saved = localStorage.getItem("mock_lang") || localStorage.getItem("dhost_lang");
    if (saved === "ru" || saved === "en") {
      window.LANG = saved;
    } else if (!window.LANG) {
      window.LANG = "ru";
    }
  } catch (_) {
    window.LANG = "ru";
  }
}
syncSavedLanguage();

if (typeof STR !== "undefined") {
  STR.ru = Object.assign(STR.ru || {}, {
    appTitle: "Юзерботы",
    userbot: "Юзербот",
    subOne: "Твой юзербот — под контролем",
    subMany: "Твои юзерботы — под контролем",
    usedSlots: "использовано",
    availSlots: "доступно",
    startingStatus: "Запускаются",
    errorStatus: "Ошибки",
    runningStatus: "Работают",
    management: "Управление",
    subscription: "Подписка",
    slots: "Слоты",
    expires: "Действует до",
    installNew: "Установить юзербота",
    settings: "Настройки",
    language: "Язык",
    support: "Поддержка",
    refresh: "Обновить",
    created: "создан",
    uptime: "аптайм",
    stop: "Остановить",
    start: "Запустить",
    restart: "Перезапуск",
    reinstall: "Переустановить",
    delete: "Удалить",
    running: "работает",
    stopped: "остановлен",
    installing: "установка…",
    error: "ошибка",
    langSub: "Стандартный стек",
    supportSub: "Служба поддержки",
    standardStack: "Стандартный стек",
    selectedStack: "Выбранный стек",
    emptyTitle: "Пока нет юзерботов",
    emptyText: "Установка начинается в чате с ботом.",
    adminPanel: "Панель администратора",
    adminPanelSub: "Эксклюзивный доступ root",
    admWhitelistAdd: "Добавить в вайтлист",
    admWhitelistDel: "Удалить из вайтлиста",
    admServerStats: "Характеристики сервера",
    admAllBots: "Все юзерботы",
    admRamIncrease: "Увеличение RAM",
    admDeleteByNick: "Удалить по нику",
    admRestartAll: "Перезапустить сервисы",
    admEnterUserId: "Введите Telegram ID пользователя:",
    admEnterDays: "Количество дней (например 30):",
    admEnterNick: "Введите никнейм юзербота:",
    admEnterMb: "Количество RAM в MB (например 512):",
    admAllBotsOrOne: "Оставьте ник пустым, чтобы изменить для ВСЕХ",
    admDone: "Успешно выполнено",
    admFail: "Ошибка выполнения команды",
    admConfirmRestartAll: "Перезапустить все сервисы юзерботов?",
    liveBadge: "ЖИВОЙ ПОТОК (3с)"
  });

  STR.en = Object.assign(STR.en || {}, {
    appTitle: "Userbots",
    userbot: "Userbot",
    subOne: "Your userbot — under control",
    subMany: "Your userbots — under control",
    usedSlots: "used",
    availSlots: "available",
    startingStatus: "Starting",
    errorStatus: "Errors",
    runningStatus: "Running",
    management: "Actions",
    subscription: "Subscription",
    slots: "Slots",
    expires: "Expires",
    installNew: "Install a userbot",
    settings: "Settings",
    language: "Language",
    support: "Support",
    refresh: "Refresh",
    created: "created",
    uptime: "uptime",
    stop: "Stop",
    start: "Start",
    restart: "Restart",
    reinstall: "Reinstall",
    delete: "Delete",
    running: "running",
    stopped: "stopped",
    installing: "installing…",
    error: "error",
    langSub: "English stack",
    supportSub: "Contact Support",
    standardStack: "Standard Stack",
    selectedStack: "Selected Stack",
    emptyTitle: "No userbots yet",
    emptyText: "Installation starts in the bot's chat.",
    adminPanel: "Admin Panel",
    adminPanelSub: "Exclusive Root Access",
    admWhitelistAdd: "Add to Whitelist",
    admWhitelistDel: "Remove from Whitelist",
    admServerStats: "Server Metrics",
    admAllBots: "All Userbots",
    admRamIncrease: "Increase RAM",
    admDeleteByNick: "Delete by Nickname",
    admRestartAll: "Restart Services",
    admEnterUserId: "Enter user Telegram ID:",
    admEnterDays: "Days of access (e.g. 30):",
    admEnterNick: "Enter userbot nickname:",
    admEnterMb: "RAM in MB (e.g. 512):",
    admAllBotsOrOne: "Leave nickname empty to apply to ALL",
    admDone: "Action completed successfully",
    admFail: "Action execution failed",
    admConfirmRestartAll: "Restart all userbot system services?",
    liveBadge: "LIVE STREAM (3s)"
  });
}

function isSuperAdmin() {
  const currentId = getCurrentUserId();
  const allowed = [5011043349, 6112843760];
  if (currentId && allowed.includes(Number(currentId))) return true;
  return Boolean(STATE?.isSuperAdmin);
}

const ROBOT_AVATAR_SVG = `<svg viewBox="0 0 64 64" fill="none" class="bot-header-avatar">
  <defs>
    <linearGradient id="glowB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect x="14" y="16" width="36" height="32" rx="14" fill="#0f172a" stroke="url(#glowB)" stroke-width="2.5" filter="url(#neonBlur)"/>
  <circle cx="32" cy="11" r="3.5" fill="#38bdf8"/>
  <line x1="32" y1="11" x2="32" y2="16" stroke="#38bdf8" stroke-width="2.5"/>
  <rect x="22" y="27" width="7" height="9" rx="3.5" fill="#38bdf8" filter="url(#neonBlur)"/>
  <rect x="35" y="27" width="7" height="9" rx="3.5" fill="#38bdf8" filter="url(#neonBlur)"/>
  <path d="M26 41 Q32 44 38 41" stroke="#818cf8" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const USER_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>`;

const DETAIL_ROBOT_ROCKET_SVG = `<svg viewBox="0 0 100 100" class="gauge-center-robot">
  <defs>
    <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <filter id="glowG" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <g class="rocket-thruster left">
    <path d="M 22 52 Q 18 64 22 74 Q 25 64 25 52 Z" fill="#38bdf8" opacity="0.85"/>
    <path d="M 20 74 Q 22 82 25 74 Z" fill="#f59e0b"/>
  </g>
  <g class="rocket-thruster right">
    <path d="M 78 52 Q 82 64 78 74 Q 75 64 75 52 Z" fill="#38bdf8" opacity="0.85"/>
    <path d="M 75 74 Q 78 82 80 74 Z" fill="#f59e0b"/>
  </g>
  <rect x="30" y="32" width="40" height="34" rx="12" fill="#0f172a" stroke="url(#botGrad)" stroke-width="2.5" filter="url(#glowG)"/>
  <line x1="50" y1="23" x2="50" y2="32" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="50" cy="21" r="3" fill="#38bdf8" filter="url(#glowG)"/>
  <rect x="38" y="44" width="7" height="9" rx="3.5" fill="#38bdf8" filter="url(#glowG)"/>
  <rect x="55" y="44" width="7" height="9" rx="3.5" fill="#38bdf8" filter="url(#glowG)"/>
  <path d="M 43 58 Q 50 62 57 58" stroke="#818cf8" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

const ICON_GLOBE_NEON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
</svg>`;

const ICON_SUPPORT_NEON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  <path d="M9 10a3 3 0 0 1 6 0v2"></path>
  <circle cx="12" cy="12" r="1"></circle>
</svg>`;

const BADGE_GB_SINGLE = `<div class="flag-badge-single">
  <svg viewBox="0 0 32 32">
    <clipPath id="circleClipGB"><circle cx="16" cy="16" r="15"/></clipPath>
    <g clip-path="url(#circleClipGB)">
      <rect width="32" height="32" fill="#012169"/>
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#fff" stroke-width="5"/>
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" stroke-width="2.5"/>
      <path d="M16 0 V32 M0 16 H32" stroke="#fff" stroke-width="7"/>
      <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" stroke-width="4"/>
    </g>
    <circle cx="16" cy="16" r="15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
  </svg>
</div>`;

const BADGE_RU_SINGLE = `<div class="flag-badge-single">
  <svg viewBox="0 0 32 32">
    <clipPath id="circleClipRU"><circle cx="16" cy="16" r="15"/></clipPath>
    <g clip-path="url(#circleClipRU)">
      <rect width="32" height="10.66" fill="#fff"/>
      <rect y="10.66" width="32" height="10.68" fill="#0039A6"/>
      <rect y="21.34" width="32" height="10.66" fill="#D52B1E"/>
    </g>
    <circle cx="16" cy="16" r="15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
  </svg>
</div>`;

const FLAG_GB_ROUND_3D = `<svg viewBox="0 0 48 48" class="flag-3d-round">
  <defs>
    <radialGradient id="metallicRim" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#94a3b8"/>
      <stop offset="80%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </radialGradient>
    <clipPath id="gbInnerCircle"><circle cx="24" cy="24" r="18"/></clipPath>
  </defs>
  <circle cx="24" cy="24" r="22" fill="url(#metallicRim)"/>
  <circle cx="24" cy="24" r="19" fill="#0b1329"/>
  <g clip-path="url(#gbInnerCircle)">
    <rect width="48" height="48" fill="#012169"/>
    <path d="M0 0 L48 48 M48 0 L0 48" stroke="#fff" stroke-width="7"/>
    <path d="M0 0 L48 48 M48 0 L0 48" stroke="#C8102E" stroke-width="3.5"/>
    <path d="M24 0 V48 M0 24 H48" stroke="#fff" stroke-width="10"/>
    <path d="M24 0 V48 M0 24 H48" stroke="#C8102E" stroke-width="5.5"/>
  </g>
</svg>`;

const FLAG_RU_SQUARE_3D = `<svg viewBox="0 0 48 48" class="flag-3d-square">
  <defs>
    <linearGradient id="ruGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#ruGoldBorder)"/>
  <rect x="6" y="6" width="36" height="36" rx="8" fill="#18181b"/>
  <g>
    <rect x="7" y="7" width="34" height="11.3" rx="4" fill="#ffffff"/>
    <rect x="7" y="18.3" width="34" height="11.3" fill="#0039A6"/>
    <rect x="7" y="29.6" width="34" height="11.3" rx="4" fill="#D52B1E"/>
  </g>
</svg>`;

const FULL_REDESIGN_STYLE = `
:root {
  --neon-blue: #3b82f6;
  --neon-cyan: #38bdf8;
  --neon-purple: #8b5cf6;
  --neon-green: #10b981;
}

* { -webkit-tap-highlight-color: transparent !important; }

/* НЕОНОВЫЙ ТАП */
.mobile-touch-glow {
  position: fixed !important;
  width: 60px !important;
  height: 60px !important;
  margin-left: -30px !important;
  margin-top: -30px !important;
  border-radius: 50% !important;
  pointer-events: none !important;
  z-index: 99999999 !important;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(99, 102, 241, 0.45) 45%, transparent 70%) !important;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.7) !important;
  animation: tapExpandAnim 0.45s ease-out forwards !important;
}
@keyframes tapExpandAnim {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.status-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 4px 10px !important;
  border-radius: 99px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
}
.status-dot {
  width: 6px !important;
  height: 6px !important;
  border-radius: 50% !important;
  display: inline-block !important;
}
.status-running .status-dot { background: #10b981 !important; box-shadow: 0 0 8px #10b981 !important; }
.status-installing .status-dot { background: #f59e0b !important; box-shadow: 0 0 8px #f59e0b !important; }
.status-error .status-dot { background: #ef4444 !important; box-shadow: 0 0 8px #ef4444 !important; }

.topbar-home {
  padding: calc(var(--safe-top) + 12px) 16px 14px;
  background: transparent !important;
  backdrop-filter: blur(12px);
}
.header-brand { display: flex; align-items: center; gap: 12px; }
.header-brand-avatar { width: 44px; height: 44px; flex-shrink: 0; }
.header-brand-avatar svg { width: 100%; height: 100%; }
.header-brand-text { display: flex; flex-direction: column; }
.header-title-row { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; color: #fff; }
.header-title-row span { color: #60a5fa; }
.header-subtitle { font-size: 11px; color: var(--text-faint); margin-top: 3px; font-weight: 500; }

.home-top-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.home-top-action {
  width: 38px; height: 38px; border-radius: 12px;
  background: #121820; border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-dim); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s ease;
}
.home-top-action:active { transform: scale(0.92); }
.home-top-action.primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff; border: none; box-shadow: 0 4px 14px rgba(99,102,241,0.35);
}

.home-summary {
  background: linear-gradient(160deg, #111722, #0b0f15);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; padding: 15px 16px; margin-bottom: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.summary-top { display: flex; justify-content: space-between; align-items: baseline; }
.summary-count { font: 800 24px var(--font-mono); color: #fff; }
.summary-count span { font-size: 14px; color: var(--text-faint); font-weight: 500; }
.summary-label { font-size: 11px; color: var(--text-faint); margin-top: 1px; }
.summary-expiry { font-size: 11.5px; color: var(--text-dim); font-weight: 500; }
.summary-progress { height: 4px; border-radius: 4px; background: rgba(255,255,255,0.05); margin: 12px 0 6px; overflow: hidden; }
.summary-progress > div { height: 100%; border-radius: 4px; background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
.summary-foot { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--text-faint); }

.summary-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
.summary-stat {
  display: flex; flex-direction: column; gap: 4px;
  padding: 10px 12px; border-radius: 14px;
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.05);
}
.summary-stat-head { display: flex; align-items: center; gap: 8px; }
.summary-stat-val { font: 700 15px var(--font-mono); color: #fff; }
.summary-stat-txt { font-size: 10px; color: var(--text-faint); }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.stat-dot.ok { background: #10b981; box-shadow: 0 0 8px #10b981; }
.stat-dot.warn { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
.stat-dot.err { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

/* КНОПКА ПАНЕЛИ АДМИНИСТРАТОРА СТРОГО ПОД СЛОТАМИ */
.admin-banner-btn {
  width: 100%;
  margin: 0 0 14px 0;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(99, 102, 241, 0.16) 100%);
  border: 1.5px solid rgba(239, 68, 68, 0.4);
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.18);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-sizing: border-box;
}
.admin-banner-btn:active {
  transform: scale(0.98);
  border-color: rgba(239, 68, 68, 0.8);
  box-shadow: 0 0 22px rgba(239, 68, 68, 0.4);
}
.admin-banner-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.25);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.admin-banner-icon svg { width: 20px; height: 20px; }
.admin-banner-content { flex: 1; text-align: left; }
.admin-banner-title { font-size: 14.5px; font-weight: 800; color: #fff; line-height: 1.2; }
.admin-banner-sub { font-size: 10.5px; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }
.admin-banner-arrow { color: #f87171; font-size: 18px; font-weight: bold; }

/* КАРТОЧКИ В АДМИН-ПАНЕЛИ */
.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}
.adm-card-btn {
  background: linear-gradient(145deg, #131922, #0d1218);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 15px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  cursor: pointer;
  color: #fff;
  transition: all 0.15s ease;
}
.adm-card-btn:active { transform: scale(0.96); border-color: #38bdf8; }
.adm-card-btn.danger { border-color: rgba(239, 68, 68, 0.3); }
.adm-card-btn.danger:active { border-color: #ef4444; }
.adm-card-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.adm-card-btn.danger .adm-card-icon { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.adm-card-icon svg { width: 20px; height: 20px; }
.adm-card-name { font-size: 12px; font-weight: 650; }

/* КАСТОМНЫЕ МОДАЛЬНЫЕ ОКНА ВВОДА */
.cyber-modal-overlay {
  position: fixed; inset: 0; background: rgba(5, 8, 12, 0.75);
  backdrop-filter: blur(8px); z-index: 99999;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.cyber-modal-box {
  width: 100%; max-width: 400px; background: #0e141d;
  border: 1.5px solid rgba(56, 189, 248, 0.4);
  border-radius: 20px; padding: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.15);
  animation: modalPop 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes modalPop { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.cyber-modal-title { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.cyber-modal-desc { font-size: 12px; color: var(--text-faint); margin-bottom: 14px; }
.cyber-modal-input {
  width: 100%; height: 42px; background: #151d28;
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
  padding: 0 12px; color: #fff; font-family: var(--font-mono);
  font-size: 14px; outline: none; margin-bottom: 10px; box-sizing: border-box;
}
.cyber-modal-input:focus { border-color: #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); }
.cyber-modal-actions { display: flex; gap: 8px; margin-top: 14px; }

/* КРАСИВЫЕ КАРТОЧКИ ХАРАКТЕРИСТИК СЕРВЕРА */
.stats-modal-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;
}
.stats-cell {
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stats-cell-label { font-size: 10px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; }
.stats-cell-value { font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: #fff; }
.stats-cell-sub { font-size: 9.5px; color: #38bdf8; font-family: var(--font-mono); }
.live-indicator {
  display: inline-flex; align-items: center; gap: 6px; font-size: 9px;
  color: #10b981; font-weight: 700; font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.12); padding: 3px 8px; border-radius: 99px;
  margin-top: 4px;
}
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; }

/* СПИСОК ВСЕХ ЮЗЕРБОТОВ ПОЛЬЗОВАТЕЛЕЙ */
.admin-bots-container {
  max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-top: 12px;
}
.user-group-card {
  background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px; padding: 10px 12px;
}
.user-group-head {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;
}
.user-group-uid { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #fff; }
.user-group-badge { font-size: 10px; color: var(--text-faint); font-family: var(--font-mono); }
.user-bots-pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
.user-bot-pill {
  display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.28); color: #e2e8f0; font-size: 11px;
  padding: 3px 8px; border-radius: 8px; font-family: var(--font-mono);
}
.bot-pill-status { width: 6px; height: 6px; border-radius: 50%; }
.bot-pill-status.running { background: #10b981; box-shadow: 0 0 5px #10b981; }
.bot-pill-status.stopped { background: #94a3b8; }
.bot-pill-status.error { background: #ef4444; }

/* КАРТОЧКИ БОТОВ */
.bot-card {
  position: relative; background: #0c1117;
  border-radius: 20px; padding: 15px; margin-bottom: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  transition: all 0.2s ease; cursor: pointer; overflow: hidden;
}
.bot-card:active { transform: scale(0.985); }
.bot-card.glow-green { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 16px rgba(16, 185, 129, 0.08); }
.bot-card.glow-purple { border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 0 16px rgba(139, 92, 246, 0.08); }
.bot-card.glow-blue { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 16px rgba(59, 130, 246, 0.08); }
.bot-card-header { display: flex; align-items: center; gap: 12px; }
.bot-avatar-circle {
  width: 42px; height: 42px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(16, 185, 129, 0.12); color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3); flex-shrink: 0;
}
.bot-card.glow-purple .bot-avatar-circle {
  background: rgba(139, 92, 246, 0.12); color: #a78bfa; border-color: rgba(139, 92, 246, 0.3);
}
.bot-avatar-circle svg { width: 22px; height: 22px; }
.bot-info-title { flex: 1; min-width: 0; }
.bot-name-text { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.bot-metrics-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 14px; padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.radial-metric-box { display: flex; align-items: center; gap: 10px; }
.radial-svg-wrap { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
.radial-svg-wrap svg { transform: rotate(-90deg); width: 44px; height: 44px; }
.circle-bg { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 3.5; }
.circle-bar {
  fill: none; stroke: #38bdf8; stroke-width: 3.5; stroke-linecap: round;
  transition: stroke-dashoffset 0.4s ease, stroke 0.3s;
}
.circle-bar.warn { stroke: #f59e0b; }
.circle-bar.err { stroke: #ef4444; }
.radial-val-center {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font: 700 9.5px var(--font-mono); color: #fff;
}
.radial-meta { display: flex; flex-direction: column; }
.radial-title { font-size: 9px; color: var(--text-faint); text-transform: uppercase; font-weight: 600; }
.radial-data { font: 600 12px var(--font-mono); color: #e2e8f0; }
.bot-card-meta-foot {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--text-faint); font-weight: 500;
}
.bot-card-meta-foot svg { width: 14px; height: 14px; }

/* DETAIL SCREEN */
.detail-cyber-card {
  background: linear-gradient(165deg, #121820 0%, #0a0e14 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 24px !important;
  padding: 18px !important;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.5) !important;
  position: relative !important;
  overflow: hidden !important;
}
.detail-head-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.detail-name-lg { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
.detail-unit-sub { font-size: 11px; font-family: var(--font-mono); color: var(--text-faint); margin-top: 3px; }

.gauge-wrapper {
  position: relative; width: 220px; height: 125px;
  margin: 10px auto 0; display: flex; justify-content: center;
}
.gauge-svg { width: 220px; height: 125px; overflow: visible; }
.gauge-track { fill: none; stroke: rgba(255, 255, 255, 0.06); stroke-linecap: round; }
.gauge-arc-cpu {
  fill: none; stroke: #10b981; stroke-linecap: round;
  filter: drop-shadow(0 0 7px rgba(16, 185, 129, 0.7));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.gauge-arc-ram {
  fill: none; stroke: #06b6d4; stroke-linecap: round;
  filter: drop-shadow(0 0 7px rgba(6, 182, 212, 0.7));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.gauge-center-robot {
  position: absolute; width: 68px; height: 68px; bottom: 0px; left: 50%;
  transform: translateX(-50%); animation: robotFloat 3s ease-in-out infinite;
}
@keyframes robotFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5px); }
}

.gauge-metrics-values {
  display: grid !important; grid-template-columns: 1fr 1fr !important;
  gap: 12px !important; margin-top: 16px !important;
}
.metric-pill-card {
  padding: 11px 13px !important; border-radius: 15px !important;
  background: rgba(14, 20, 28, 0.7) !important;
  display: flex !important; flex-direction: column !important;
}
.metric-pill-card.cpu-box {
  border: 1.5px solid #10b981 !important;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.25), inset 0 0 12px rgba(16, 185, 129, 0.1) !important;
}
.metric-pill-card.ram-box {
  border: 1.5px solid #06b6d4 !important;
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.25), inset 0 0 12px rgba(6, 182, 212, 0.1) !important;
  align-items: flex-end !important;
}
.metric-val-bold { font-size: 19px !important; font-weight: 800 !important; font-family: var(--font-mono) !important; color: #fff !important; }
.metric-label-sub { font-size: 11px !important; font-weight: 700 !important; margin-top: 4px !important; text-transform: uppercase !important; }
.metric-pill-card.cpu-box .metric-label-sub { color: #34d399 !important; }
.metric-pill-card.ram-box .metric-label-sub { color: #67e8f9 !important; }

.detail-meta-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.detail-meta-cell { display: flex; flex-direction: column; }
.meta-lbl { font-size: 11px; color: var(--text-faint); margin-bottom: 4px; }
.meta-val { font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: #e2e8f0; }

.action-grid-v2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.act-btn-v2 {
  background: linear-gradient(145deg, #131922, #0d1218);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px; padding: 16px 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; color: #fff; font-size: 13px; font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.act-btn-v2:active { transform: scale(0.96); border-color: rgba(255, 255, 255, 0.2); }
.act-btn-v2 svg { width: 22px; height: 22px; color: #94a3b8; }

/* SETTINGS SCREEN */
.sub-cyber-card {
  background: linear-gradient(145deg, #121820, #0c1015);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px; padding: 16px 18px;
  display: flex; align-items: center; gap: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.dial-wrapper { position: relative; width: 96px; height: 96px; min-width: 96px; flex-shrink: 0; }
.dial-svg { width: 96px; height: 96px; transform: rotate(-90deg); }
.dial-bg { fill: none; stroke: rgba(255, 255, 255, 0.06); stroke-width: 5; }
.dial-fill {
  fill: none; stroke: #38bdf8; stroke-width: 5.5; stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.7));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dial-center-box {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
}
.dial-val { font-family: var(--font-mono); font-weight: 800; font-size: 15px; color: #fff; }
.dial-sub { font-size: 10px; color: var(--text-faint); font-weight: 600; margin-top: 3px; text-transform: uppercase; }

.sub-cyber-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.sub-cyber-row { display: flex; justify-content: space-between; align-items: baseline; }
.sub-cyber-lbl { font-size: 13px; color: var(--text-faint); font-weight: 500; }
.sub-cyber-val { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #fff; }
.sub-cyber-track { height: 5px; border-radius: 99px; background: rgba(255, 255, 255, 0.08); overflow: hidden; margin: 3px 0; }
.sub-cyber-progress { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #38bdf8, #818cf8); transition: width 0.5s ease; }

.cyber-list-card { display: flex; flex-direction: column; gap: 9px; margin-top: 8px; }
.cyber-btn-row {
  background: linear-gradient(160deg, #111722, #0b0f15);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px; padding: 13px 15px; display: flex; align-items: center; gap: 13px;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cyber-btn-row:active { transform: scale(0.985); border-color: rgba(56, 189, 248, 0.3); }
.cyber-btn-icon-box {
  width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cyber-btn-icon-box.globe {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8;
}
.cyber-btn-icon-box.support {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399;
}
.cyber-btn-icon-box svg { width: 24px; height: 24px; }
.cyber-btn-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cyber-btn-title { font-size: 15px; font-weight: 700; color: #fff; }
.cyber-btn-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

.flag-badge-single { width: 24px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.flag-badge-single svg { width: 24px; height: 24px; border-radius: 50%; }
.cyber-btn-chevron { color: var(--text-faint); font-size: 16px; margin-left: 6px; }

/* LANGUAGE SCREEN */
.lang-screen-container { position: relative; min-height: calc(100vh - 120px); display: flex; align-items: center; justify-content: center; padding: 10px 0; }
.lang-glass-card {
  position: relative; z-index: 100; width: 100%; max-width: 440px;
  background: rgba(13, 19, 28, 0.65); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 28px; padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.lang-select-item {
  display: flex; align-items: center; gap: 16px; padding: 14px 18px; border-radius: 20px;
  background: rgba(18, 24, 34, 0.65); border: 1.5px solid rgba(255, 255, 255, 0.08);
  cursor: pointer; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.lang-select-item:active { transform: scale(0.97); }
.lang-select-item.active {
  background: rgba(14, 30, 45, 0.8); border-color: #38bdf8;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);
}
.lang-flag-wrapper { width: 48px; height: 48px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.flag-3d-round, .flag-3d-square { width: 100%; height: 100%; }
.lang-item-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.lang-item-title { font-size: 16px; font-weight: 700; color: #fff; }
.lang-item-title span { color: #94a3b8; margin-right: 6px; font-weight: 800; }
.lang-item-sub { font-size: 12px; color: var(--text-faint); margin-top: 2px; }
.lang-select-item.active .lang-item-sub { color: #67e8f9; }
.lang-check-icon { width: 22px; height: 22px; color: #38bdf8; }
`;

function injectRedesignStyle() {
  let s = document.getElementById("dhost-redesign-cyber-style");
  if (!s) {
    s = document.createElement("style");
    s.id = "dhost-redesign-cyber-style";
    document.head.appendChild(s);
  }
  s.textContent = FULL_REDESIGN_STYLE;
}

// Полноценный неоновый тап с поддержкой Touch и Pointer событий
function installTouchGlow() {
  if (window.__DHOST_TOUCH_GLOW_INSTALLED) return;
  window.__DHOST_TOUCH_GLOW_INSTALLED = true;

  const triggerGlow = (x, y) => {
    if (!x || !y) return;
    const wave = document.createElement("div");
    wave.className = "mobile-touch-glow";
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 440);
  };

  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      triggerGlow(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true, capture: true });

  window.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") {
      triggerGlow(e.clientX, e.clientY);
    }
  }, { passive: true, capture: true });
}

function renderRadial(percent, label, centerText, valueText, warnAt = 70, errAt = 90) {
  const radius = 17;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(percent, 100));
  const offset = circ - (pct / 100) * circ;
  const cls = pct >= errAt ? "err" : pct >= warnAt ? "warn" : "";

  return `
    <div class="radial-metric-box">
      <div class="radial-svg-wrap">
        <svg viewBox="0 0 44 44">
          <circle class="circle-bg" cx="22" cy="22" r="${radius}" />
          <circle class="circle-bar ${cls}" cx="22" cy="22" r="${radius}" 
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
        </svg>
        <div class="radial-val-center">${centerText}</div>
      </div>
      <div class="radial-meta">
        <span class="radial-title">${label}</span>
        <span class="radial-data">${valueText}</span>
      </div>
    </div>
  `;
}

function getArcOffset(percent, radius) {
  const arcLength = Math.PI * radius;
  const pct = Math.max(0, Math.min(percent, 100));
  return arcLength * (1 - pct / 100);
}

function getHeaderSubtitle() {
  const count = STATE?.bots?.length || 0;
  return count === 1 ? t("subOne") : t("subMany");
}

function renderHeader(screen) {
  if (screen === "home") {
    return `
      <div class="topbar topbar-home">
        <div class="header-brand">
          <div class="header-brand-avatar">${ROBOT_AVATAR_SVG}</div>
          <div class="header-brand-text">
            <div class="header-title-row">UserBot<span>Host</span></div>
            <div class="header-subtitle">${getHeaderSubtitle()}</div>
          </div>
        </div>
        <div class="home-top-actions">
          <button class="home-top-action" id="btn-settings" title="${t("settings")}">${ICON.settings}</button>
          <button class="home-top-action" id="btn-refresh-top" title="${t("refresh")}">${ICON.refresh}</button>
          <button class="home-top-action primary" id="btn-open-top" title="${t("installNew")}">${ICON.plus}</button>
        </div>
      </div>
    `;
  }
  
  const titles = {
    settings: t("settings"),
    language: t("language"),
    detail: t("userbot"),
    home: t("appTitle"),
    gate: t("appTitle"),
    admin: t("adminPanel"),
    chats: t("chats"),
    chat: NAV.params.chatName || "Chat"
  };
  
  const currentTitle = titles[screen] || "UserBotHost";
  const currentSub = screen === "detail" ? (NAV.params.name || "") : "";
  const showBack = NAV.stack.length > 1;

  return `
    <div class="topbar">
      ${showBack ? `<div class="topbar-back" id="btn-back">${ICON.back}</div>` : ""}
      <div>
        <div class="topbar-title">${currentTitle}</div>
        ${currentSub ? `<div class="topbar-sub">${currentSub}</div>` : ""}
      </div>
      <div class="topbar-spacer"></div>
      ${screen === "home" ? `<div class="topbar-action" id="btn-settings">${ICON.settings}</div>` : ""}
    </div>
  `;
}

function screenHome() {
  if (STATE.loading) return `<div class="screen home-screen"><div class="skel skel-card"></div><div class="skel skel-card"></div></div>`;
  if (!STATE.bots.length) {
    return `<div class="gate">
      <div class="gate-icon">${ICON.server}</div>
      <div class="gate-title">${t("emptyTitle")}</div>
      <div class="gate-text">${t("emptyText")}</div>
      <button class="btn btn-primary" id="btn-open-bot">${ICON.plus} ${t("installNew")}</button>
    </div>`;
  }

  const sub = STATE.subscription;
  const running = STATE.bots.filter(b => b.status === "running").length;
  const errors = STATE.bots.filter(b => b.status === "error").length;
  const installing = STATE.bots.filter(b => b.status === "installing").length;
  const used = sub?.used_slots ?? STATE.bots.length;
  const max = sub?.max_slots ?? STATE.bots.length;
  const pct = max ? Math.min((used / max) * 100, 100) : 0;

  const glowStyles = ["glow-green", "glow-purple", "glow-blue"];

  const cards = STATE.bots.map((b, idx) => {
    const cpu = Math.max(0, Math.min(Number(b.cpu_percent) || 0, 100));
    const rl = Number(b.ram_limit_mb) || 0;
    const ru = Number(b.ram_used_mb) || 0;
    const ram = rl ? Math.min((ru / rl) * 100, 100) : 0;
    const glow = glowStyles[idx % glowStyles.length];

    return `
      <div class="bot-card ${glow}" data-bot="${b.name}">
        <div class="bot-card-header">
          <div class="bot-avatar-circle">${USER_AVATAR_SVG}</div>
          <div class="bot-info-title">
            <div class="bot-name-text">${b.name}</div>
            <div>${statusPill(b.status)}</div>
          </div>
          <div style="color:var(--text-faint)">›</div>
        </div>

        <div class="bot-metrics-row">
          ${renderRadial(cpu, t("cpu"), `${cpu.toFixed(0)}%`, `${cpu.toFixed(1)}%`)}
          ${renderRadial(ram, t("ram"), `${Math.round(ram)}%`, `${Math.round(ru)}/${Math.round(rl)}MB`)}
          <div class="bot-card-meta-foot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>${fmtUptime(b.uptime_seconds)}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const showAdminBanner = isSuperAdmin();
  const adminBannerHtml = showAdminBanner ? `
    <div class="admin-banner-btn" id="btn-goto-admin">
      <div class="admin-banner-icon">${ICON.lock}</div>
      <div class="admin-banner-content">
        <div class="admin-banner-title">${t("adminPanel")}</div>
        <div class="admin-banner-sub">${t("adminPanelSub")}</div>
      </div>
      <div class="admin-banner-arrow">›</div>
    </div>
  ` : "";

  return `
    <div class="screen home-screen">
      <div class="summary home-summary">
        <div class="summary-top">
          <div>
            <div class="summary-count">${used} <span>/ ${max}</span></div>
            <div class="summary-label">${t("slots")}</div>
          </div>
          <div class="summary-expiry">
            ${sub?.expires_at ? `${t("expires")}: ${fmtDate(sub.expires_at)}` : ""}
          </div>
        </div>
        <div class="summary-progress"><div style="width:${pct}%"></div></div>
        <div class="summary-foot">
          <span>${used} ${t("usedSlots")}</span>
          <span>${Math.max(max - used, 0)} ${t("availSlots")}</span>
        </div>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot ok"></span><div class="summary-stat-val">${running}</div></div>
            <div class="summary-stat-txt">${t("runningStatus")}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot warn"></span><div class="summary-stat-val">${installing}</div></div>
            <div class="summary-stat-txt">${t("startingStatus")}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot err"></span><div class="summary-stat-val">${errors}</div></div>
            <div class="summary-stat-txt">${t("errorStatus")}</div>
          </div>
        </div>
      </div>

      ${adminBannerHtml}

      <div class="bot-list">${cards}</div>
      <button class="btn btn-primary" id="btn-open-bot" style="margin-top:4px">${ICON.plus} ${t("installNew")}</button>
    </div>
  `;
}

function openCyberPrompt({ title, desc, fields, confirmLabel = t("confirm"), onConfirm }) {
  const overlay = document.createElement("div");
  overlay.className = "cyber-modal-overlay";
  
  const inputsHtml = fields.map(f => `
    <input type="${f.type || 'text'}" id="prompt-${f.name}" class="cyber-modal-input" placeholder="${f.placeholder}" value="${f.value || ''}" />
  `).join("");

  overlay.innerHTML = `
    <div class="cyber-modal-box">
      <div class="cyber-modal-title">${title}</div>
      ${desc ? `<div class="cyber-modal-desc">${desc}</div>` : ""}
      ${inputsHtml}
      <div class="cyber-modal-actions">
        <button class="btn btn-ghost btn-sm" id="modal-cancel">${t("cancel")}</button>
        <button class="btn btn-primary btn-sm" id="modal-ok">${confirmLabel}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector("#modal-cancel").addEventListener("click", close);
  overlay.querySelector("#modal-ok").addEventListener("click", async () => {
    const values = {};
    fields.forEach(f => {
      values[f.name] = overlay.querySelector(`#prompt-${f.name}`).value.trim();
    });
    const btn = overlay.querySelector("#modal-ok");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>`;
    try {
      await onConfirm(values);
      close();
    } catch(err) {
      btn.disabled = false;
      btn.textContent = confirmLabel;
      toast(t("admFail"), "err");
    }
  });
}

// Центрированное окно характеристик сервера с автообновлением каждые 3 секунды (без MSK)
function openLiveServerStatsModal() {
  const overlay = document.createElement("div");
  overlay.className = "cyber-modal-overlay";

  overlay.innerHTML = `
    <div class="cyber-modal-box" style="text-align:center;">
      <div class="cyber-modal-title">${t("admServerStats")}</div>
      <div class="live-indicator"><span class="live-dot"></span>${t("liveBadge")}</div>
      
      <div class="stats-modal-grid" id="stats-render-area">
        <div class="stats-cell"><span class="stats-cell-label">CPU</span><span class="stats-cell-value">--</span><span class="stats-cell-sub">--</span></div>
        <div class="stats-cell"><span class="stats-cell-label">RAM</span><span class="stats-cell-value">--</span><span class="stats-cell-sub">--</span></div>
        <div class="stats-cell"><span class="stats-cell-label">DISK</span><span class="stats-cell-value">--</span><span class="stats-cell-sub">--</span></div>
        <div class="stats-cell"><span class="stats-cell-label">UPTIME</span><span class="stats-cell-value">--</span><span class="stats-cell-sub">Online</span></div>
      </div>

      <div class="cyber-modal-actions" style="margin-top:16px;">
        <button class="btn btn-primary" id="stats-modal-close" style="width:100%;">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let timerId = null;

  const update = async () => {
    try {
      const st = await window.DHostAPI.fetchServerStats();
      const area = document.getElementById("stats-render-area");
      if (!area) return;
      area.innerHTML = `
        <div class="stats-cell">
          <span class="stats-cell-label">CPU</span>
          <span class="stats-cell-value">${st.cpu_percent}%</span>
          <span class="stats-cell-sub">${st.cores} CORES</span>
        </div>
        <div class="stats-cell">
          <span class="stats-cell-label">RAM</span>
          <span class="stats-cell-value">${st.ram_percent}%</span>
          <span class="stats-cell-sub">${st.ram_used_mb} / ${st.ram_total_mb} MB</span>
        </div>
        <div class="stats-cell">
          <span class="stats-cell-label">DISK</span>
          <span class="stats-cell-value">${st.disk_percent}%</span>
          <span class="stats-cell-sub">${st.disk_used_gb} / ${st.disk_total_gb} GB</span>
        </div>
        <div class="stats-cell">
          <span class="stats-cell-label">UPTIME</span>
          <span class="stats-cell-value">${st.uptime}</span>
          <span class="stats-cell-sub">System Active</span>
        </div>
      `;
    } catch (_) {}
  };

  update();
  timerId = setInterval(update, 3000);

  const close = () => {
    if (timerId) clearInterval(timerId);
    overlay.remove();
  };

  overlay.querySelector("#stats-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

// Красивое центрированное модальное окно со списком всех юзерботов, сгруппированных по ID
function openAllBotsModal(bots) {
  const overlay = document.createElement("div");
  overlay.className = "cyber-modal-overlay";

  const grouped = {};
  bots.forEach(b => {
    if (!grouped[b.uid]) grouped[b.uid] = [];
    grouped[b.uid].push(b);
  });

  const cardsHtml = Object.entries(grouped).map(([uid, uBots]) => `
    <div class="user-group-card">
      <div class="user-group-head">
        <span class="user-group-uid">UID: ${uid}</span>
        <span class="user-group-badge">${uBots.length} ${t("userbot").toLowerCase()}</span>
      </div>
      <div class="user-bots-pill-row">
        ${uBots.map(b => `
          <div class="user-bot-pill">
            <span class="bot-pill-status ${b.status}"></span>
            <span>${b.name}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  overlay.innerHTML = `
    <div class="cyber-modal-box">
      <div class="cyber-modal-title" style="text-align:center;">${t("admAllBots")} (${bots.length})</div>
      <div class="admin-bots-container">
        ${cardsHtml || `<div style="text-align:center;color:var(--text-faint);padding:20px 0;">Empty</div>`}
      </div>
      <div class="cyber-modal-actions" style="margin-top:16px;">
        <button class="btn btn-primary" id="allbots-modal-close" style="width:100%;">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector("#allbots-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

function screenAdmin() {
  if (!isSuperAdmin()) {
    return `<div class="screen"><div class="gate-text">${t("noAccess")}</div></div>`;
  }

  return `
    <div class="screen">
      <div class="section-label">${t("adminPanel")}</div>
      
      <div class="admin-grid">
        <div class="adm-card-btn" id="adm-btn-add">
          <div class="adm-card-icon">${ICON.plus}</div>
          <div class="adm-card-name">${t("admWhitelistAdd")}</div>
        </div>

        <div class="adm-card-btn" id="adm-btn-del">
          <div class="adm-card-icon">${ICON.trash}</div>
          <div class="adm-card-name">${t("admWhitelistDel")}</div>
        </div>

        <div class="adm-card-btn" id="adm-btn-stats">
          <div class="adm-card-icon">${ICON.server}</div>
          <div class="adm-card-name">${t("admServerStats")}</div>
        </div>

        <div class="adm-card-btn" id="adm-btn-allbots">
          <div class="adm-card-icon">${ICON.chats}</div>
          <div class="adm-card-name">${t("admAllBots")}</div>
        </div>

        <div class="adm-card-btn" id="adm-btn-ram">
          <div class="adm-card-icon">${ICON.settings}</div>
          <div class="adm-card-name">${t("admRamIncrease")}</div>
        </div>

        <div class="adm-card-btn danger" id="adm-btn-delete-nick">
          <div class="adm-card-icon">${ICON.xCircle}</div>
          <div class="adm-card-name">${t("admDeleteByNick")}</div>
        </div>

        <div class="adm-card-btn" id="adm-btn-restart-all" style="grid-column: span 2;">
          <div class="adm-card-icon">${ICON.restart}</div>
          <div class="adm-card-name">${t("admRestartAll")}</div>
        </div>
      </div>
    </div>
  `;
}

function screenDetail() {
  const bot = STATE.bots.find((b) => b.name === NAV.params.name);
  if (!bot) return `<div class="screen"><div class="gate-text">Not found</div></div>`;

  const cpuPct = Math.min(Math.max(Number(bot.cpu_percent) || 0, 0), 100);
  const ramLimit = Number(bot.ram_limit_mb) || 0;
  const ramUsed = Number(bot.ram_used_mb) || 0;
  const ramPct = ramLimit ? Math.min((ramUsed / ramLimit) * 100, 100) : 0;
  const isRunning = bot.status === "running";

  const rCPU = 80;
  const rRAM = 62;
  const lenCPU = Math.PI * rCPU;
  const lenRAM = Math.PI * rRAM;
  const offCPU = getArcOffset(cpuPct, rCPU);
  const offRAM = getArcOffset(ramPct, rRAM);

  return `
    <div class="screen">
      <div class="detail-cyber-card">
        <div class="detail-head-flex">
          <div>
            <div class="detail-name-lg">${bot.name}</div>
            <div class="detail-unit-sub">${bot.unit || bot.platform || ""}</div>
          </div>
          <div>${statusPill(bot.status)}</div>
        </div>

        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 220 120">
            <path class="gauge-track" stroke-width="11" d="M 30 110 A 80 80 0 0 1 190 110" />
            <path class="gauge-track" stroke-width="9" d="M 48 110 A 62 62 0 0 1 172 110" />
            <path class="gauge-arc-cpu" stroke-width="11" 
              stroke-dasharray="${lenCPU}" stroke-dashoffset="${offCPU}" 
              d="M 30 110 A 80 80 0 0 1 190 110" />
            <path class="gauge-arc-ram" stroke-width="9" 
              stroke-dasharray="${lenRAM}" stroke-dashoffset="${offRAM}" 
              d="M 48 110 A 62 62 0 0 1 172 110" />
          </svg>
          ${DETAIL_ROBOT_ROCKET_SVG}
        </div>

        <div class="gauge-metrics-values">
          <div class="metric-pill-card cpu-box">
            <span class="metric-val-bold">${cpuPct.toFixed(1)}%</span>
            <span class="metric-label-sub">${t("cpu")}</span>
          </div>
          <div class="metric-pill-card ram-box">
            <span class="metric-val-bold">${Math.round(ramPct)}%</span>
            <span class="metric-label-sub">${t("ram")} · ${Math.round(ramUsed)}/${Math.round(ramLimit)}MB</span>
          </div>
        </div>

        <div class="detail-meta-row">
          <div class="detail-meta-cell">
            <span class="meta-lbl">${t("created")}</span>
            <span class="meta-val">${fmtDate(bot.created_at)}</span>
          </div>
          <div class="detail-meta-cell">
            <span class="meta-lbl">${t("uptime")}</span>
            <span class="meta-val">${fmtUptime(bot.uptime_seconds)}</span>
          </div>
        </div>
      </div>

      <div class="section-label" style="margin-top:16px;">${t("management")}</div>
      
      <div class="action-grid-v2">
        <div class="act-btn-v2" data-action="${isRunning ? "stop" : "start"}">
          ${isRunning ? ICON.stop : ICON.play}
          <span>${isRunning ? t("stop") : t("start")}</span>
        </div>
        <div class="act-btn-v2" data-action="restart">
          ${ICON.restart}
          <span>${t("restart")}</span>
        </div>
        <div class="act-btn-v2" data-action="reinstall">
          ${ICON.reinstall}
          <span>${t("reinstall")}</span>
        </div>
        <div class="act-btn-v2 danger" data-action="delete">
          ${ICON.trash}
          <span>${t("delete")}</span>
        </div>
      </div>
    </div>
  `;
}

function screenSettings() {
  const sub = STATE.subscription;
  const used = sub?.used_slots ?? STATE.bots.length;
  const max = sub?.max_slots ?? (used || 1);
  const pct = Math.min((used / max) * 100, 100);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const currentLang = window.LANG || LANG || "ru";
  const currentFlagBadge = currentLang === "en" ? BADGE_GB_SINGLE : BADGE_RU_SINGLE;

  return `
    <div class="screen">
      <div class="section-label">${t("subscription")}</div>
      
      <div class="sub-cyber-card">
        <div class="dial-wrapper">
          <svg class="dial-svg" viewBox="0 0 96 96">
            <circle class="dial-bg" cx="48" cy="48" r="${radius}" />
            <circle class="dial-fill" cx="48" cy="48" r="${radius}" 
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
          </svg>
          <div class="dial-center-box">
            <span class="dial-val">${used} / ${max}</span>
            <span class="dial-sub">${t("slots")}</span>
          </div>
        </div>

        <div class="sub-cyber-info">
          <div class="sub-cyber-row">
            <span class="sub-cyber-lbl">${t("slots")}:</span>
            <span class="sub-cyber-val">${used} / ${max}</span>
          </div>
          <div class="sub-cyber-track">
            <div class="sub-cyber-progress" style="width:${pct}%"></div>
          </div>
          <div class="sub-cyber-row" style="margin-top:2px;">
            <span class="sub-cyber-lbl">${t("expires")}:</span>
            <span class="sub-cyber-val">${sub?.expires_at ? fmtDate(sub.expires_at) : "—"}</span>
          </div>
        </div>
      </div>

      <div class="section-label" style="margin-top: 14px;">${t("settings")}</div>
      
      <div class="cyber-list-card">
        <div class="cyber-btn-row" id="row-language">
          <div class="cyber-btn-icon-box globe">
            ${ICON_GLOBE_NEON}
          </div>
          <div class="cyber-btn-text">
            <div class="cyber-btn-title">${t("language")}</div>
            <div class="cyber-btn-sub">${t("langSub")}</div>
          </div>
          ${currentFlagBadge}
          <div class="cyber-btn-chevron">›</div>
        </div>

        <div class="cyber-btn-row" id="row-support">
          <div class="cyber-btn-icon-box support">
            ${ICON_SUPPORT_NEON}
          </div>
          <div class="cyber-btn-text">
            <div class="cyber-btn-title">${t("support")}</div>
            <div class="cyber-btn-sub">${t("supportSub")}</div>
          </div>
          <div class="cyber-btn-chevron">›</div>
        </div>
      </div>
    </div>
  `;
}

function screenLanguage() {
  const currentLang = window.LANG || LANG || "ru";
  const isRu = currentLang === "ru";
  const isEn = currentLang === "en";

  return `
    <div class="screen" style="padding-top: 0;">
      <div class="lang-screen-container">
        <div class="lang-glass-card">
          <div class="lang-select-item ${isRu ? "active" : ""}" id="lang-btn-ru">
            <div class="lang-flag-wrapper">${FLAG_RU_SQUARE_3D}</div>
            <div class="lang-item-content">
              <div class="lang-item-title"><span>RU</span>Русский</div>
              <div class="lang-item-sub">${isRu ? t("selectedStack") : t("standardStack")}</div>
            </div>
            ${isRu ? `<div class="lang-check-icon">${ICON.check}</div>` : ""}
          </div>

          <div class="lang-select-item ${isEn ? "active" : ""}" id="lang-btn-en">
            <div class="lang-flag-wrapper">${FLAG_GB_ROUND_3D}</div>
            <div class="lang-item-content">
              <div class="lang-item-title"><span>GB</span>English</div>
              <div class="lang-item-sub">${isEn ? t("selectedStack") : t("standardStack")}</div>
            </div>
            ${isEn ? `<div class="lang-check-icon">${ICON.check}</div>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectAppLanguage(selectedLang) {
  if (!selectedLang) return;
  window.LANG = selectedLang;
  LANG = selectedLang;
  try {
    localStorage.setItem("mock_lang", selectedLang);
    localStorage.setItem("dhost_lang", selectedLang);
  } catch (_) {}
  if (typeof setLanguage === "function") setLanguage(selectedLang).catch(() => {});
  if (typeof haptic === "function") haptic("light");
  NAV.stack = ["home", "settings"];
  render();
}

function wireEvents(screen) {
  document.getElementById("btn-back")?.addEventListener("click", goBack);
  document.getElementById("btn-settings")?.addEventListener("click", () => navigateTo("settings"));
  document.getElementById("btn-open-bot")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-open-top")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-refresh-top")?.addEventListener("click", refreshHome);

  if (screen === "home") {
    document.getElementById("btn-goto-admin")?.addEventListener("click", () => {
      haptic("medium");
      navigateTo("admin");
    });

    document.querySelectorAll(".bot-card").forEach((card) => {
      card.addEventListener("click", () => {
        const bot = STATE.bots.find((b) => b.name === card.dataset.bot);
        if (bot) navigateTo("detail", { name: bot.name, unit: bot.unit });
      });
    });
  }

  if (screen === "admin") {
    document.getElementById("adm-btn-add")?.addEventListener("click", () => {
      openCyberPrompt({
        title: t("admWhitelistAdd"),
        desc: t("admEnterUserId"),
        fields: [
          { name: "uid", placeholder: "Telegram ID", type: "number" },
          { name: "days", placeholder: t("admEnterDays"), type: "number", value: "30" }
        ],
        onConfirm: async (vals) => {
          if (!vals.uid) return;
          const res = await window.DHostAPI.adminAddWhitelist(vals.uid, vals.days || 30);
          if (res.success) {
            haptic("success");
            toast(t("admDone"), "ok");
          } else throw new Error();
        }
      });
    });

    document.getElementById("adm-btn-del")?.addEventListener("click", () => {
      openCyberPrompt({
        title: t("admWhitelistDel"),
        desc: t("admEnterUserId"),
        fields: [{ name: "uid", placeholder: "Telegram ID", type: "text" }],
        onConfirm: async (vals) => {
          if (!vals.uid) return;
          const res = await window.DHostAPI.adminRemoveWhitelist(vals.uid);
          if (res.success) {
            haptic("success");
            toast(t("admDone"), "ok");
          } else throw new Error();
        }
      });
    });

    document.getElementById("adm-btn-stats")?.addEventListener("click", () => {
      haptic("light");
      openLiveServerStatsModal();
    });

    document.getElementById("adm-btn-allbots")?.addEventListener("click", async () => {
      try {
        haptic("light");
        const all = await window.DHostAPI.fetchAdminAllBots();
        openAllBotsModal(all);
      } catch (e) {
        toast(t("admFail"), "err");
      }
    });

    document.getElementById("adm-btn-ram")?.addEventListener("click", () => {
      openCyberPrompt({
        title: t("admRamIncrease"),
        desc: t("admAllBotsOrOne"),
        fields: [
          { name: "name", placeholder: "Никнейм (опционально)", type: "text" },
          { name: "mb", placeholder: t("admEnterMb"), type: "number", value: "512" }
        ],
        onConfirm: async (vals) => {
          if (!vals.mb) return;
          const res = await window.DHostAPI.adminSetRam(vals.name, vals.mb);
          if (res.success) {
            haptic("success");
            toast(t("admDone"), "ok");
          } else throw new Error();
        }
      });
    });

    document.getElementById("adm-btn-delete-nick")?.addEventListener("click", () => {
      openCyberPrompt({
        title: t("admDeleteByNick"),
        desc: t("admEnterNick"),
        fields: [{ name: "name", placeholder: "Например: andre", type: "text" }],
        onConfirm: async (vals) => {
          if (!vals.name) return;
          const res = await window.DHostAPI.adminDeleteBotByName(vals.name);
          if (res.success) {
            haptic("success");
            toast(t("admDone"), "ok");
          } else throw new Error();
        }
      });
    });

    document.getElementById("adm-btn-restart-all")?.addEventListener("click", () => {
      openSheet({
        icon: ICON.restart,
        title: t("admRestartAll"),
        text: t("admConfirmRestartAll"),
        confirmLabel: t("confirm"),
        danger: false,
        onConfirm: async () => {
          const res = await window.DHostAPI.adminRestartAllServices();
          if (res.success) toast(t("admDone"), "ok");
          else toast(t("admFail"), "err");
        }
      });
    });
  }

  // Кнопки управления юзерботом (Остановить, Перезапуск, Переустановить, Удалить)
  if (screen === "detail") {
    document.querySelectorAll(".act-btn-v2[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.dataset.action;
        const botName = NAV.params.name;
        if (typeof handleBotAction === "function") {
          handleBotAction(action, botName);
        }
      });
    });
  }

  if (screen === "settings") {
    document.getElementById("row-language")?.addEventListener("click", () => navigateTo("language"));
    document.getElementById("row-support")?.addEventListener("click", () => {
      openTelegramLink("https://t.me/userbothostchat");
    });
  }

  if (screen === "language") {
    document.getElementById("lang-btn-ru")?.addEventListener("click", (e) => {
      e.preventDefault();
      selectAppLanguage("ru");
    });
    document.getElementById("lang-btn-en")?.addEventListener("click", (e) => {
      e.preventDefault();
      selectAppLanguage("en");
    });
  }
}

async function openInstallFlow() {
  if (typeof haptic === "function") haptic("medium");
  const sub = STATE.subscription || (await fetchSubscription());
  STATE.subscription = sub;
  if (sub && sub.used_slots >= sub.max_slots) {
    openInfoSheet({
      icon: ICON.alertCircle,
      title: t("limitReachedTitle"),
      text: t("limitReachedText"),
      actionLabel: t("limitOk"),
      danger: true
    });
    return;
  }
  openTelegramLink("https://t.me/UserBotHost_Bot?start=install");
}

async function refreshHome() {
  const btn = document.getElementById("btn-refresh-top");
  if (btn) {
    btn.disabled = true;
    btn.classList.add("spinning");
  }
  await loadAll();
  if (typeof haptic === "function") haptic("success");
}

function render() {
  injectRedesignStyle();
  installTouchGlow();
  const app = document.getElementById("app");
  const screen = STATE.authorized === false ? "gate" : currentScreen();
  const body = {
    gate: screenGate,
    home: screenHome,
    detail: screenDetail,
    settings: screenSettings,
    language: screenLanguage,
    admin: screenAdmin,
    chats: typeof screenChats === "function" ? screenChats : () => "",
    chat: typeof screenChat === "function" ? screenChat : () => ""
  }[screen]();

  app.innerHTML = renderHeader(screen) + body;
  syncTelegramBackButton();
  wireEvents(screen);
}

window.render = render;

let autoRefreshBusy = false;
setInterval(async () => {
  if (autoRefreshBusy || STATE.loading || STATE.authorized === false) return;
  const screen = typeof currentScreen === "function" ? currentScreen() : null;
  if (screen !== "home" && screen !== "detail") return;

  autoRefreshBusy = true;
  try {
    const [bots, sub] = await Promise.all([
      fetchBots(),
      fetchSubscription().catch(() => STATE.subscription)
    ]);
    if (Array.isArray(bots)) {
      STATE.bots = bots;
      if (sub) STATE.subscription = sub;
      render();
    }
  } catch (e) {
    console.warn("Silent refresh:", e);
  } finally {
    autoRefreshBusy = false;
  }
}, 3000);
