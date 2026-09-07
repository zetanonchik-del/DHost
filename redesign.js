/* ==========================================================================
   UserBotHost UI Cyberpunk Redesign (i18n Ready)
   - Поддержка переключения языков RU / EN
   - Динамический подзаголовок в зависимости от количества юзерботов
   - Радиальные круги метрик
   - Экран деталей со спидометром и роботом-ракетой
   ========================================================================== */

const UI = { query: "", filter: "all" };

/* --- SVG ИКОНКИ И МАСКОТЫ --- */
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

/* --- ЕДИНАЯ ТАБЛИЦА СТИЛЕЙ КИБЕРПАНК-ДИЗАЙНА --- */
const FULL_REDESIGN_STYLE = `
:root {
  --neon-blue: #3b82f6;
  --neon-cyan: #38bdf8;
  --neon-purple: #8b5cf6;
  --neon-green: #10b981;
}

/* Header */
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

/* Bot Cards (Главная) */
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

/* Экран деталей (screenDetail) */
.detail-cyber-card {
  background: linear-gradient(165deg, #121820 0%, #0a0e14 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px; padding: 18px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative; overflow: hidden;
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
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.gauge-arc-ram {
  fill: none; stroke: #06b6d4; stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.6));
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
  display: flex; justify-content: space-between; margin-top: 14px; padding: 0 10px;
}
.metric-col { display: flex; flex-direction: column; }
.metric-col.right { align-items: flex-end; }
.metric-val-bold { font-size: 19px; font-weight: 800; font-family: var(--font-mono); color: #fff; }
.metric-label-sub { font-size: 11px; color: var(--text-faint); font-weight: 600; margin-top: 2px; }

.detail-meta-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.detail-meta-cell { display: flex; flex-direction: column; }
.meta-lbl { font-size: 11px; color: var(--text-faint); margin-bottom: 4px; }
.meta-val { font-size: 14px; font-weight: 700; font-family: var(--font-mono); color: #e2e8f0; }

/* Кнопки управления */
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
.act-btn-v2 svg {
  width: 22px; height: 22px; color: #94a3b8;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
}

/* Анимации при клике */
.act-btn-v2.spin-active svg { animation: actRotate 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes actRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.act-btn-v2.pulse-active svg { animation: actPulse 0.4s ease-in-out; }
@keyframes actPulse { 0% { transform: scale(1); } 50% { transform: scale(0.75); } 100% { transform: scale(1); } }

.act-btn-v2.danger { color: #f87171; border-color: rgba(239, 68, 68, 0.2); }
.act-btn-v2.danger svg { color: #ef4444; }
.act-btn-v2.danger.trash-active svg { animation: actTrashShake 0.45s ease-in-out; }
@keyframes actTrashShake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-14deg) translateY(-2px); }
  50% { transform: rotate(14deg); }
  75% { transform: rotate(-6deg); }
  100% { transform: rotate(0deg); }
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

/* Функция получения адаптивного подзаголовка с учётом языка и количества ботов */
function getHeaderSubtitle() {
  const count = STATE?.bots?.length || 0;
  if (typeof LANG !== "undefined" && LANG === "en") {
    return count === 1 ? "Your userbot — under control" : "Your userbots — under control";
  }
  return count === 1 ? "Твой юзербот — под контролем" : "Твои юзерботы — под контролем";
}

/* --- РЕНДЕР HEADER --- */
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

/* --- РЕНДЕР ГЛАВНОГО ЭКРАНА --- */
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
  const isEn = typeof LANG !== "undefined" && LANG === "en";

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
            <div class="bot-status-tag"><span class="stat-dot ok"></span> ${statusPill(b.status)}</div>
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
          <span>${used} ${isEn ? "used" : "использовано"}</span>
          <span>${Math.max(max - used, 0)} ${isEn ? "available" : "доступно"}</span>
        </div>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot ok"></span><div class="summary-stat-val">${running}</div></div>
            <div class="summary-stat-txt">${isEn ? "Running" : "Работают"}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot warn"></span><div class="summary-stat-val">${installing}</div></div>
            <div class="summary-stat-txt">${isEn ? "Starting" : "Запускаются"}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-head"><span class="stat-dot err"></span><div class="summary-stat-val">${errors}</div></div>
            <div class="summary-stat-txt">${isEn ? "Errors" : "Ошибки"}</div>
          </div>
        </div>
      </div>

      <div class="bot-list">${cards}</div>
      <button class="btn btn-primary" id="btn-open-bot" style="margin-top:4px">${ICON.plus}${t("installNew")}</button>
    </div>
  `;
}

/* --- РЕНДЕР ЭКРАНА ДЕТАЛЕЙ (DETAIL) --- */
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
          <div class="bot-status-tag">
            <span class="stat-dot ok"></span> ${statusPill(bot.status)}
          </div>
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
          <div class="metric-col">
            <span class="metric-val-bold">${cpuPct.toFixed(1)}%</span>
            <span class="metric-label-sub">${t("cpu")}</span>
          </div>
          <div class="metric-col right">
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

      <div class="section-label" style="margin-top:16px;">${t("actions")}</div>
      
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

/* --- ОБРАБОТКА СОБЫТИЙ И АНИМАЦИИ КНОПОК --- */
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
        await setLanguage(lang);
        haptic("light");
        goBack();
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

/* --- ГЛАВНЫЙ RENDER --- */
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
