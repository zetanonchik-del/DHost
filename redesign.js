/* DHost UI: Cyber-Glow Redesign with Radial Metrics & Custom Header */
const UI = { query: "", filter: "all" };

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

const REDESIGN_STYLE = `
:root {
  --neon-blue: #3b82f6;
  --neon-cyan: #38bdf8;
  --neon-purple: #8b5cf6;
  --neon-green: #10b981;
}

/* Custom Header */
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

/* Home Controls in Topbar */
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

/* Summary Box */
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

/* Bot Cyber Cards */
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
.bot-name-text { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.bot-status-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px;
  background: rgba(16, 185, 129, 0.12); color: #10b981;
}

/* Metric Circles (Radial Progress) */
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
`;

function injectRedesignStyle() {
  let s = document.getElementById("dhost-cyber-style");
  if (!s) {
    s = document.createElement("style");
    s.id = "dhost-cyber-style";
    document.head.appendChild(s);
  }
  s.textContent = REDESIGN_STYLE;
}

// Рендер кругового SVG прогресс-бара
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

function renderHeader(screen) {
  if (screen === "home") {
    return `
      <div class="topbar topbar-home">
        <div class="header-brand">
          <div class="header-brand-avatar">${ROBOT_AVATAR_SVG}</div>
          <div class="header-brand-text">
            <div class="header-title-row">UserBot<span>Host</span></div>
            <div class="header-subtitle">Твои юзерботы — под контролем</div>
          </div>
        </div>
        <div class="home-top-actions">
          <button class="home-top-action" id="btn-settings" title="Настройки">${ICON.settings}</button>
          <button class="home-top-action" id="btn-refresh-top" title="Обновить">${ICON.refresh}</button>
          <button class="home-top-action primary" id="btn-open-top" title="Создать">${ICON.plus}</button>
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
      <button class="btn btn-primary" id="btn-open-bot">${ICON.plus}${t("installNew")}</button>
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
            <div class="bot-status-tag"><span class="stat-dot ok"></span> ${b.status === "running" ? "Работает" : b.status}</div>
          </div>
          <div style="color:var(--text-faint)">›</div>
        </div>

        <div class="bot-metrics-row">
          ${renderRadial(cpu, "CPU", `${cpu.toFixed(0)}%`, `${cpu.toFixed(1)}%`)}
          ${renderRadial(ram, "RAM", `${Math.round(ram)}%`, `${Math.round(ru)}/${Math.round(rl)}MB`)}
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
            <div class="summary-label">Слоты</div>
          </div>
          <div class="summary-expiry">
            ${sub?.expires_at ? `Действует до: ${fmtDate(sub.expires_at)}` : ""}
          </div>
        </div>
        <div class="summary-progress"><div style="width:${pct}%"></div></div>
        <div class="summary-foot">
          <span>${used} использовано</span>
          <span>${Math.max(max - used, 0)} доступно</span>
        </div>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot ok"></span><div class="summary-stat-val">${running}</div></div>
            <div class="summary-stat-txt">Работают</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot warn"></span><div class="summary-stat-val">${installing}</div></div>
            <div class="summary-stat-txt">Запускаются</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot err"></span><div class="summary-stat-val">${errors}</div></div>
            <div class="summary-stat-txt">Ошибки</div>
          </div>
        </div>
      </div>

      <div class="bot-list">${cards}</div>
      <button class="btn btn-primary" id="btn-open-bot" style="margin-top:4px">${ICON.plus} Установить юзербота</button>
    </div>
  `;
}

function render() {
  injectRedesignStyle();
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
