/* ==========================================================================
   UserBotHost UI Cyberpunk Redesign (Settings & Language Screen Upgrade)
   - Обновленный экран настроек: круговой циферблат слотов + 3D кнопки
   - Экран выбора языка с анимированными оптоволоконными лучами и 3D флагами
   - Полная интеграция с i18n, Telegram WebApp и автообновлением
   ========================================================================== */

const UI = { query: "", filter: "all" };

try {
  const saved = localStorage.getItem("mock_lang") || localStorage.getItem("dhost_lang");
  if (saved === "ru" || saved === "en") {
    LANG = saved;
  }
} catch (_) {}

if (typeof STR !== "undefined") {
  STR.ru = Object.assign(STR.ru || {}, {
    subOne: "Твой юзербот — под контролем",
    subMany: "Твои юзерботы — под контролем",
    usedSlots: "использовано",
    availSlots: "доступно",
    startingStatus: "Запускаются",
    errorStatus: "Ошибки",
    runningStatus: "Работают",
    management: "Управление",
    slots: "Слоты",
    expires: "Действует до",
    installNew: "Установить юзербота",
    settings: "Настройки",
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
    langSub: "Текущий стек",
    supportSub: "Служба поддержки",
    statusActive: "Активна",
    standardStack: "Стандартный стек",
    selectedStack: "Выбранный стек"
  });

  STR.en = Object.assign(STR.en || {}, {
    subOne: "Your userbot — under control",
    subMany: "Your userbots — under control",
    usedSlots: "used",
    availSlots: "available",
    startingStatus: "Starting",
    errorStatus: "Errors",
    runningStatus: "Running",
    management: "Actions",
    slots: "Slots",
    expires: "Expires",
    installNew: "Install a userbot",
    settings: "Settings",
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
    statusActive: "Active",
    standardStack: "Standard Stack",
    selectedStack: "Selected Stack"
  });
}

/* --- SVG ИКОНКИ --- */
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

const FLAG_RU_SVG = `<svg viewBox="0 0 32 32" class="flag-icon-svg ru-badge">
  <defs>
    <filter id="flagShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="32" height="32" rx="7" fill="#fff" filter="url(#flagShadow)"/>
  <path d="M0 10.66h32v10.68H0z" fill="#0039A6"/>
  <path d="M0 21.34h32V32H0z" fill="#D52B1E"/>
  <rect width="32" height="32" rx="7" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
</svg>`;

const FLAG_US_GB_SVG = `<div class="flags-overlap">
  <svg viewBox="0 0 32 32" class="flag-mini flag-us">
    <rect width="32" height="32" rx="16" fill="#bd3d44"/>
    <path d="M0 4.9h32M0 9.8h32M0 14.7h32M0 19.6h32M0 24.5h32M0 29.4h32" stroke="#fff" stroke-width="2.4"/>
    <rect width="14" height="15" fill="#192f5d"/>
  </svg>
  <svg viewBox="0 0 32 32" class="flag-mini flag-gb">
    <clipPath id="circleClip"><circle cx="16" cy="16" r="16"/></clipPath>
    <g clip-path="url(#circleClip)">
      <rect width="32" height="32" fill="#012169"/>
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#fff" stroke-width="5"/>
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" stroke-width="2.5"/>
      <path d="M16 0 V32 M0 16 H32" stroke="#fff" stroke-width="7"/>
      <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" stroke-width="4"/>
    </g>
    <circle cx="16" cy="16" r="15.5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
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
    <filter id="rimGlow">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="24" cy="24" r="22" fill="url(#metallicRim)" filter="url(#rimGlow)"/>
  <circle cx="24" cy="24" r="19" fill="#0b1329"/>
  <g clip-path="url(#gbInnerCircle)">
    <rect width="48" height="48" fill="#012169"/>
    <path d="M0 0 L48 48 M48 0 L0 48" stroke="#fff" stroke-width="7"/>
    <path d="M0 0 L48 48 M48 0 L0 48" stroke="#C8102E" stroke-width="3.5"/>
    <path d="M24 0 V48 M0 24 H48" stroke="#fff" stroke-width="10"/>
    <path d="M24 0 V48 M0 24 H48" stroke="#C8102E" stroke-width="5.5"/>
  </g>
  <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
</svg>`;

const FLAG_RU_SQUARE_3D = `<svg viewBox="0 0 48 48" class="flag-3d-square">
  <defs>
    <linearGradient id="ruGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="leatherShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity="0.7"/>
    </filter>
  </defs>
  <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#ruGoldBorder)" filter="url(#leatherShadow)"/>
  <rect x="6" y="6" width="36" height="36" rx="8" fill="#18181b"/>
  <g>
    <rect x="7" y="7" width="34" height="11.3" rx="4" fill="#ffffff"/>
    <rect x="7" y="18.3" width="34" height="11.3" fill="#0039A6"/>
    <rect x="7" y="29.6" width="34" height="11.3" rx="4" fill="#D52B1E"/>
  </g>
  <rect x="6" y="6" width="36" height="36" rx="8" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" stroke-dasharray="2,2"/>
</svg>`;

const FULL_REDESIGN_STYLE = `
:root {
  --neon-blue: #3b82f6;
  --neon-cyan: #38bdf8;
  --neon-purple: #8b5cf6;
  --neon-green: #10b981;
}

* {
  -webkit-tap-highlight-color: transparent !important;
}

/* Неоновый отклик при касании */
.mobile-touch-glow {
  position: fixed !important;
  width: 60px !important;
  height: 60px !important;
  margin-left: -30px !important;
  margin-top: -30px !important;
  border-radius: 50% !important;
  pointer-events: none !important;
  z-index: 9999999 !important;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.7) 0%, rgba(99, 102, 241, 0.35) 45%, transparent 70%) !important;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.6) !important;
  animation: tapExpand 0.4s ease-out forwards !important;
}
@keyframes tapExpand {
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
  flex-shrink: 0 !important;
  display: inline-block !important;
}
.status-dot::before, .status-dot::after { display: none !important; }
.status-running .status-dot { background: #10b981 !important; box-shadow: 0 0 8px #10b981 !important; }
.status-installing .status-dot { background: #f59e0b !important; box-shadow: 0 0 8px #f59e0b !important; }
.status-error .status-dot { background: #ef4444 !important; box-shadow: 0 0 8px #ef4444 !important; }

/* Topbar Header */
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

/* Главный summary box */
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
.stat-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; position: relative; }
.stat-dot.ok { background: #10b981; box-shadow: 0 0 8px #10b981; }
.stat-dot.warn { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
.stat-dot.err { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

/* Bot Cards */
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

/* Detail Screen */
.detail-cyber-card {
  background: linear-gradient(165deg, #121820 0%, #0a0e14 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 24px !important;
  padding: 18px !important;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.5) !important;
  position: relative !important;
  overflow: hidden !important;
}
.detail-cyber-card::before {
  content: ''; position: absolute; top: -40px; left: 50%;
  transform: translateX(-50%); width: 140px; height: 140px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
  pointer-events: none;
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
  position: relative; overflow: hidden;
}
.act-btn-v2:active { transform: scale(0.96); border-color: rgba(255, 255, 255, 0.2); }
.act-btn-v2 svg { width: 22px; height: 22px; color: #94a3b8; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s; }

/* ==========================================================================
   НОВЫЙ ДИЗАЙН НАСТРОЕК (СКРИНШОТЫ 2 и 3)
   ========================================================================== */
.sub-cyber-card {
  background: linear-gradient(145deg, #121820, #0c1015);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

/* Круговой индикатор слотов */
.dial-wrapper {
  position: relative;
  width: 82px;
  height: 82px;
  flex-shrink: 0;
}
.dial-svg {
  width: 82px;
  height: 82px;
  transform: rotate(-90deg);
}
.dial-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 5;
}
.dial-fill {
  fill: none;
  stroke: url(#dialGlowGrad);
  stroke-width: 5.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.7));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dial-center-box {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.dial-val {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 14px;
  color: #fff;
  line-height: 1.1;
}
.dial-sub {
  font-size: 9.5px;
  color: var(--text-faint);
  font-weight: 600;
  margin-top: 1px;
}

/* Правая колонка информации о подписке */
.sub-cyber-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sub-cyber-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.sub-cyber-lbl {
  font-size: 12px;
  color: var(--text-faint);
  font-weight: 500;
}
.sub-cyber-val {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.sub-cyber-val span {
  font-size: 10px;
  color: var(--text-faint);
  font-weight: normal;
}
.sub-cyber-track {
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  margin: 2px 0;
}
.sub-cyber-progress {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
  transition: width 0.5s ease;
}
.status-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #10b981;
  font-size: 12px;
  font-weight: 700;
}
.status-active-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* 3D Неоновые кнопки (Скриншот 3) */
.cyber-list-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.cyber-btn-row {
  background: linear-gradient(160deg, #111722, #0b0f15);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
}
.cyber-btn-row:active {
  transform: scale(0.985);
  border-color: rgba(56, 189, 248, 0.3);
}
.cyber-btn-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.cyber-btn-icon-box.globe {
  background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}
.cyber-btn-icon-box.support {
  background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
}
.cyber-btn-icon-box svg {
  width: 24px;
  height: 24px;
}
.cyber-btn-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.cyber-btn-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.cyber-btn-sub {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 2px;
}

/* Перекрывающиеся мини-флаги */
.flags-overlap {
  display: flex;
  align-items: center;
  position: relative;
  width: 44px;
  height: 24px;
}
.flag-mini {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  border: 1.5px solid rgba(255,255,255,0.2);
}
.flag-us { left: 0; z-index: 1; }
.flag-gb { left: 16px; z-index: 2; }
.cyber-btn-chevron {
  color: var(--text-faint);
  font-size: 16px;
  margin-left: 6px;
}

/* ==========================================================================
   НОВЫЙ ЭКРАН ВЫБОРА ЯЗЫКА С АНИМИРОВАННЫМ ФОНОМ (СКРИНШОТ 4)
   ========================================================================== */
.lang-screen-container {
  position: relative;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  overflow: hidden;
}

/* Анимированные неоновые лучи / оптоволокно на фоне */
.fiber-rays-bg {
  position: absolute;
  inset: -20px 0;
  pointer-events: none;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.fiber-svg {
  width: 100%;
  height: 100%;
  max-width: 480px;
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4));
}
.fiber-path {
  fill: none;
  stroke-linecap: round;
  opacity: 0.75;
  animation: cyberFlow 4s ease-in-out infinite alternate;
}
@keyframes cyberFlow {
  0% { stroke-dashoffset: 0; opacity: 0.4; }
  50% { opacity: 0.85; stroke: #38bdf8; }
  100% { stroke-dashoffset: 80; opacity: 0.5; }
}

/* Плавающие искры пыли */
.fiber-sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
  animation: floatDust 5s ease-in-out infinite;
}
@keyframes floatDust {
  0%, 100% { transform: translateY(0) scale(0.6); opacity: 0.2; }
  50% { transform: translateY(-30px) scale(1.3); opacity: 0.9; }
}

/* Стеклянная полупрозрачная карточка (Glassmorphism) */
.lang-glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  background: rgba(13, 19, 28, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(56, 189, 248, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Строки языков */
.lang-select-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-radius: 20px;
  background: rgba(18, 24, 34, 0.5);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.lang-select-item:active {
  transform: scale(0.98);
}
.lang-select-item.active {
  background: rgba(14, 30, 45, 0.7);
  border-color: #38bdf8;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.12);
}

/* 3D Иконки флагов */
.lang-flag-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: flagFloat 4s ease-in-out infinite alternate;
}
@keyframes flagFloat {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-2.5px) rotate(1deg); }
}
.flag-3d-round, .flag-3d-square {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
}

.lang-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.lang-item-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
.lang-item-title span {
  color: #94a3b8;
  margin-right: 6px;
  font-weight: 800;
}
.lang-item-sub {
  font-size: 12px;
  color: var(--text-faint);
  margin-top: 2px;
}
.lang-select-item.active .lang-item-sub {
  color: #67e8f9;
}

.lang-check-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  filter: drop-shadow(0 0 8px #38bdf8);
}
.lang-check-icon svg {
  width: 20px;
  height: 20px;
}
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
    setTimeout(() => wave.remove(), 420);
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

      <div class="bot-list">${cards}</div>
      <button class="btn btn-primary" id="btn-open-bot" style="margin-top:4px">${ICON.plus} ${t("installNew")}</button>
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
        <div class="act-btn-v2" data-action="${isRunning ? "stop" : "start"}" data-anim="pulse">
          ${isRunning ? ICON.stop : ICON.play}
          <span>${isRunning ? t("stop") : t("start")}</span>
        </div>
        <div class="act-btn-v2" data-action="restart" data-anim="spin">
          ${ICON.restart}
          <span>${t("restart")}</span>
        </div>
        <div class="act-btn-v2" data-action="reinstall" data-anim="spin">
          ${ICON.reinstall}
          <span>${t("reinstall")}</span>
        </div>
        <div class="act-btn-v2 danger" data-action="delete" data-anim="trash">
          ${ICON.trash}
          <span>${t("delete")}</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   ЭКРАН НАСТРОЕК (ПО СКРИНШОТАМ 2 и 3)
   ========================================================================== */
function screenSettings() {
  const sub = STATE.subscription;
  const used = sub?.used_slots ?? STATE.bots.length;
  const max = sub?.max_slots ?? (used || 1);
  const pct = Math.min((used / max) * 100, 100);

  // Параметры для кругового циферблата
  const radius = 32;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const currentLangLabel = LANG === "ru" ? "Русский" : "English (US)";
  const currentLangSub = LANG === "ru" ? "Стандартный стек" : "English stack";

  return `
    <div class="screen">
      <div class="section-label">${t("subscription")}</div>
      
      <div class="sub-cyber-card">
        <div class="dial-wrapper">
          <svg class="dial-svg" viewBox="0 0 82 82">
            <defs>
              <linearGradient id="dialGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="100%" stop-color="#818cf8"/>
              </linearGradient>
            </defs>
            <circle class="dial-bg" cx="41" cy="41" r="${radius}" />
            <circle class="dial-fill" cx="41" cy="41" r="${radius}" 
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
          </svg>
          <div class="dial-center-box">
            <span class="dial-val">${used} / ${max}</span>
            <span class="dial-sub">Slots</span>
          </div>
        </div>

        <div class="sub-cyber-info">
          <div class="sub-cyber-row">
            <span class="sub-cyber-lbl">Slots:</span>
            <span class="sub-cyber-val">${used} / ${max} <span>(Next unlock at ${max})</span></span>
          </div>
          
          <div class="sub-cyber-track">
            <div class="sub-cyber-progress" style="width:${pct}%"></div>
          </div>

          <div class="sub-cyber-row" style="margin-top:2px;">
            <span class="sub-cyber-lbl">Expires:</span>
            <span class="sub-cyber-val">${sub?.expires_at ? fmtDate(sub.expires_at) : "—"}</span>
          </div>

          <div class="sub-cyber-row">
            <span class="sub-cyber-lbl">Status:</span>
            <span class="status-active-badge"><span class="dot"></span>${t("statusActive")}</span>
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
            <div class="cyber-btn-sub">${currentLangSub}</div>
          </div>
          <div class="flags-overlap">
            ${FLAG_US_GB_SVG}
          </div>
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

/* ==========================================================================
   ЭКРАН ВЫБОРА ЯЗЫКА (ПО СКРИНШОТУ 4 С АНИМАЦИЕЙ)
   ========================================================================== */
function screenLanguage() {
  const isRu = LANG === "ru";
  const isEn = LANG === "en";

  return `
    <div class="screen" style="padding-top: 0;">
      <div class="lang-screen-container">
        
        <!-- Анимированный оптоволоконный фон -->
        <div class="fiber-rays-bg">
          <div class="fiber-sparkle" style="top:20%; left:25%; animation-delay:0.2s;"></div>
          <div class="fiber-sparkle" style="top:45%; left:75%; animation-delay:1.5s;"></div>
          <div class="fiber-sparkle" style="top:70%; left:35%; animation-delay:0.8s;"></div>
          <div class="fiber-sparkle" style="top:85%; left:65%; animation-delay:2.1s;"></div>
          
          <svg class="fiber-svg" viewBox="0 0 400 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.1"/>
                <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.8"/>
                <stop offset="50%" stop-color="#818cf8" stop-opacity="0.9"/>
                <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
              </linearGradient>
            </defs>
            <path class="fiber-path" stroke="url(#fiberGrad)" stroke-width="1.8" d="M150 0 Q190 250 150 600" stroke-dasharray="120 40"/>
            <path class="fiber-path" stroke="url(#fiberGrad)" stroke-width="2.5" d="M180 0 Q205 270 180 600" stroke-dasharray="160 50" style="animation-delay: -1s;"/>
            <path class="fiber-path" stroke="url(#fiberGrad)" stroke-width="3" d="M200 0 Q200 300 200 600" stroke-dasharray="140 30" style="animation-delay: -2s;"/>
            <path class="fiber-path" stroke="url(#fiberGrad)" stroke-width="2.5" d="M220 0 Q195 270 220 600" stroke-dasharray="160 50" style="animation-delay: -0.5s;"/>
            <path class="fiber-path" stroke="url(#fiberGrad)" stroke-width="1.8" d="M250 0 Q210 250 250 600" stroke-dasharray="120 40" style="animation-delay: -1.5s;"/>
          </svg>
        </div>

        <!-- Стеклянная карточка выбора языка -->
        <div class="lang-glass-card">
          <div class="lang-select-item ${isRu ? "active" : ""}" data-lang="ru">
            <div class="lang-flag-wrapper">
              ${FLAG_RU_SQUARE_3D}
            </div>
            <div class="lang-item-content">
              <div class="lang-item-title"><span>RU</span>Русский</div>
              <div class="lang-item-sub">${isRu ? t("selectedStack") : t("standardStack")}</div>
            </div>
            ${isRu ? `<div class="lang-check-icon">${ICON.check}</div>` : ""}
          </div>

          <div class="lang-select-item ${isEn ? "active" : ""}" data-lang="en">
            <div class="lang-flag-wrapper">
              ${FLAG_GB_ROUND_3D}
            </div>
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

function wireEvents(screen) {
  document.getElementById("btn-back")?.addEventListener("click", goBack);
  document.getElementById("btn-settings")?.addEventListener("click", () => navigateTo("settings"));
  document.getElementById("btn-open-bot")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-open-top")?.addEventListener("click", openInstallFlow);
  document.getElementById("btn-refresh-top")?.addEventListener("click", refreshHome);

  if (screen === "home") {
    document.querySelectorAll(".bot-card").forEach((card) => {
      card.addEventListener("click", () => {
        const bot = STATE.bots.find((b) => b.name === card.dataset.bot);
        if (bot) navigateTo("detail", { name: bot.name, unit: bot.unit });
      });
    });
  }

  if (screen === "detail") {
    document.querySelectorAll(".act-btn-v2").forEach((btn) => {
      btn.addEventListener("click", () => {
        const anim = btn.dataset.anim;
        if (anim === "spin") btn.classList.add("spin-active");
        if (anim === "pulse") btn.classList.add("pulse-active");
        if (anim === "trash") btn.classList.add("trash-active");

        setTimeout(() => {
          btn.classList.remove("spin-active", "pulse-active", "trash-active");
        }, 600);

        if (typeof handleBotAction === "function") {
          handleBotAction(btn.dataset.action, NAV.params.name);
        }
      });
    });
  }

  if (screen === "settings") {
    document.getElementById("row-language")?.addEventListener("click", () => navigateTo("language"));
    document.getElementById("row-support")?.addEventListener("click", () => openTelegramLink("https://t.me/userbothostchat"));
  }

  if (screen === "language") {
    document.querySelectorAll("[data-lang]").forEach((el) => {
      el.addEventListener("click", async () => {
        const lang = el.dataset.lang;
        if (lang === LANG) return;
        LANG = lang;
        try {
          localStorage.setItem("mock_lang", lang);
          localStorage.setItem("dhost_lang", lang);
        } catch (_) {}
        await setLanguage(lang);
        haptic("light");
        NAV.stack = ["home"];
        render();
      });
    });
  }
}

async function openInstallFlow() {
  haptic("medium");
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
  haptic("success");
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
    chats: typeof screenChats === "function" ? screenChats : () => "",
    chat: typeof screenChat === "function" ? screenChat : () => ""
  }[screen]();

  app.innerHTML = renderHeader(screen) + body;
  syncTelegramBackButton();
  wireEvents(screen);
}

window.render = render;

/* --- ТИХОЕ АВТООБНОВЛЕНИЕ КАЖДЫЕ 3 СЕКУНДЫ --- */
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
