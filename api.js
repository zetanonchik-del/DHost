/**
 * api.js — весь обмен данными с вашим бэкендом живёт здесь и больше нигде.
 *
 * Ничего не знает про авторизацию (номер/код/2FA) — это сознательно
 * не часть этого файла. Mini App только читает и меняет состояние УЖЕ
 * авторизованного юзербота: списки, метрики, действия start/stop/delete
 * и т.д. Сам вход в Telegram-аккаунт происходит в чате с ботом, как и
 * раньше (см. handlers/userbot_control.py — provisioner-визард).
 *
 * ПЕРЕКЛЮЧАТЕЛЬ МОКОВ
 * Пока нет домена/бэкенда — оставьте USE_MOCKS = true, интерфейс будет
 * работать на тестовых данных (как в превью). Как только бэкенд готов —
 * поставьте USE_MOCKS = false и впишите BASE_URL. Ничего больше менять
 * не нужно, все функции сами переключатся на настоящие запросы.
 */

const USE_MOCKS = false;
const BASE_URL = "https://adaptive-merchants-chamber-starting.trycloudflare.com";

function authHeaders() {
  // initData уже содержит подписанные Telegram user.id, auth_date и т.д.
  // Бэкенд валидирует подпись и достаёт user_id — отдельный логин не нужен.
  const initData = window.Telegram?.WebApp?.initData || "";
  return {
    "Content-Type": "application/json",
    "X-Telegram-Init-Data": initData,
  };
}

// Небольшая задержка, чтобы мок-режим ощущался как настоящая сеть
const _wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ==========================================================================
// GET /api/bots
// Ответ: [{ name, unit, status, cpu_percent, ram_used_mb, ram_limit_mb,
//           uptime_seconds, created_at, platform }]
// status ∈ "running" | "stopped" | "installing" | "error"
// ==========================================================================
async function fetchBots() {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/bots`, { headers: authHeaders() });
    if (!res.ok) throw new Error("bots_fetch_failed");
    return await res.json();
  }
  await _wait(500);
  return MOCK_BOTS;
}

// ==========================================================================
// GET /api/subscription
// Ответ: { max_slots, used_slots, expires_at (ISO 8601 | null) }
// ==========================================================================
async function fetchSubscription() {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/subscription`, { headers: authHeaders() });
    if (!res.ok) throw new Error("subscription_fetch_failed");
    return await res.json();
  }
  await _wait(300);
  return MOCK_SUBSCRIPTION;
}

// ==========================================================================
// POST /api/bots/:name/start
// POST /api/bots/:name/stop
// POST /api/bots/:name/restart
// Тело: {}
// Ответ: { success: true, status: "running" | "stopped" }
// Ошибка: { success: false, error: "service_not_found" | "already_running" | ... }
// ==========================================================================
async function botAction(name, action) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/bots/${encodeURIComponent(name)}/${action}`, {
      method: "POST",
      headers: authHeaders(),
    });
    return await res.json();
  }
  await _wait(900);
  const bot = MOCK_BOTS.find((b) => b.name === name);
  if (!bot) return { success: false, error: "service_not_found" };
  if (action === "start") bot.status = "running";
  if (action === "stop") bot.status = "stopped";
  if (action === "restart") bot.status = "running";
  return { success: true, status: bot.status };
}

// ==========================================================================
// POST /api/bots/:name/reinstall
// Тело: {}
// Ответ: { success: true } — бэкенд заново прогоняет провижининг для уже
//         авторизованного юзербота (телефон/код/2FA НЕ запрашиваются повторно,
//         сессия уже есть на сервере)
// ==========================================================================
async function reinstallBot(name) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/bots/${encodeURIComponent(name)}/reinstall`, {
      method: "POST",
      headers: authHeaders(),
    });
    return await res.json();
  }
  await _wait(1400);
  const bot = MOCK_BOTS.find((b) => b.name === name);
  if (bot) bot.status = "running";
  return { success: true };
}

// ==========================================================================
// DELETE /api/bots/:name
// Ответ: { success: true }
// ==========================================================================
async function deleteBot(name) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/bots/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await res.json();
  }
  await _wait(700);
  const idx = MOCK_BOTS.findIndex((b) => b.name === name);
  if (idx !== -1) MOCK_BOTS.splice(idx, 1);
  return { success: true };
}

// ==========================================================================
// GET /api/settings/language   ->  { language: "ru" | "en" }
// POST /api/settings/language  body: { language }  ->  { success: true }
// ==========================================================================
async function fetchLanguage() {
  if (!USE_MOCKS) {
    try {
      const res = await fetch(`${BASE_URL}/api/settings/language`, {
        headers: authHeaders(),
      });
      if (!res.ok) return "ru";

      const data = await res.json();
      return data.language === "en" ? "en" : "ru";
    } catch (_) {
      return "ru";
    }
  }

  await _wait(150);
  return localStorage.getItem("mock_lang") || "ru";
}

async function setLanguage(lang) {
  if (!USE_MOCKS) {
    await fetch(`${BASE_URL}/api/settings/language`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ language: lang }),
    });
    return { success: true };
  }
  localStorage.setItem("mock_lang", lang);
  return { success: true };
}

// ==========================================================================
// Статус авторизации. Проверяет, есть ли на сервере активная Telegram-сессия
// для этого пользователя (её создаёт визард в чате, НЕ Mini App).
// GET /api/auth/status -> { authorized: bool, has_bots: bool }
// ==========================================================================
async function fetchAuthStatus() {
  if (!USE_MOCKS) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/status`, {
        headers: authHeaders(),
      });
      if (!res.ok) return { authorized: false, has_bots: false };

      const data = await res.json();
      return {
        authorized: data.authorized === true,
        has_bots: data.has_bots === true,
      };
    } catch (_) {
      return { authorized: false, has_bots: false };
    }
  }

  await _wait(400);
  return { authorized: MOCK_AUTHORIZED, has_bots: MOCK_BOTS.length > 0 };
}

// ==========================================================================
// POST /api/notify-install-request
// Установка/переустановка требуют номер/код/2FA — эта ручка просто просит
// бэкенд прислать пользователю сообщение "продолжите в чате" через самого
// бота, чтобы не открывать чат вслепую без явного подтверждения.
// Тело: {} | Ответ: { success: true }
// ==========================================================================
async function notifyInstallRequest() {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/notify-install-request`, {
      method: "POST",
      headers: authHeaders(),
    });
    return await res.json();
  }
  await _wait(300);
  return { success: true };
}

// ==========================================================================
// НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ЧАТАМИ (ТОЛЬКО ДЛЯ АДМИНОВ)
// Все запросы требуют bot_name — имя юзербота, от которого берётся сессия.
// ==========================================================================

// ==========================================================================
// GET /api/getDialogs?bot_name=NAME
// Ответ: [{ id, name, type, unread, last_msg, date, pinned, folder_id, is_archived, participants }]
// ==========================================================================
async function fetchDialogs(botName) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getDialogs?bot_name=${encodeURIComponent(botName)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("dialogs_fetch_failed");
    return await res.json();
  }
  await _wait(500);
  return []; // В мок-режиме возвращаем пустой массив
}

// ==========================================================================
// GET /api/getMessages?bot_name=NAME&chat_id=123&limit=50&offset=0
// Ответ: { messages: [{ id, text, date, sender_id, sender_name, is_me, reply_to, media, media_type, edited }], total }
// ==========================================================================
async function fetchMessages(botName, chatId, limit = 50, offset = 0) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getMessages?bot_name=${encodeURIComponent(botName)}&chat_id=${encodeURIComponent(chatId)}&limit=${limit}&offset=${offset}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("messages_fetch_failed");
    return await res.json();
  }
  await _wait(400);
  return { messages: [], total: 0 };
}

// ==========================================================================
// POST /api/sendMessage
// Тело: { bot_name, chat_id, text, reply_to (опционально) }
// Ответ: { success: true, id, date, text }
// ==========================================================================
async function sendMessage(botName, chatId, text, replyTo = null) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/sendMessage`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ bot_name: botName, chat_id: chatId, text, reply_to: replyTo }),
    });
    if (!res.ok) throw new Error("send_message_failed");
    return await res.json();
  }
  await _wait(600);
  return { success: true, id: Date.now(), date: Math.floor(Date.now() / 1000), text };
}

// ==========================================================================
// POST /api/editMessage
// Тело: { bot_name, chat_id, message_id, new_text }
// Ответ: { success: true }
// ==========================================================================
async function editMessage(botName, chatId, messageId, newText) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/editMessage`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ bot_name: botName, chat_id: chatId, message_id: messageId, new_text: newText }),
    });
    if (!res.ok) throw new Error("edit_message_failed");
    return await res.json();
  }
  await _wait(400);
  return { success: true };
}

// ==========================================================================
// POST /api/deleteMessage
// Тело: { bot_name, chat_id, message_id }
// Ответ: { success: true }
// ==========================================================================
async function deleteMessage(botName, chatId, messageId) {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/deleteMessage`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ bot_name: botName, chat_id: chatId, message_id: messageId }),
    });
    if (!res.ok) throw new Error("delete_message_failed");
    return await res.json();
  }
  await _wait(500);
  return { success: true };
}

// ==========================================================================
// GET /api/getFolders?bot_name=NAME
// Ответ: [{ id, name, chat_ids }]
// ==========================================================================
async function fetchFolders(botName) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getFolders?bot_name=${encodeURIComponent(botName)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("folders_fetch_failed");
    return await res.json();
  }
  await _wait(300);
  return [];
}

// ==========================================================================
// GET /api/getChatInfo?bot_name=NAME&chat_id=123
// Ответ: { id, title, type, participants, about, photo }
// ==========================================================================
async function fetchChatInfo(botName, chatId) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getChatInfo?bot_name=${encodeURIComponent(botName)}&chat_id=${encodeURIComponent(chatId)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("chat_info_fetch_failed");
    return await res.json();
  }
  await _wait(200);
  return { id: chatId, title: "Unknown", type: "private", participants: 0 };
}

// ==========================================================================
// Мок-данные — используются только пока USE_MOCKS = true.
// Когда переключите на false, этот блок больше не читается — можно
// оставить как есть или удалить, роли не играет.
// ==========================================================================
let MOCK_AUTHORIZED = true;

let MOCK_BOTS = [
  {
    name: "phoenix",
    unit: "ubphoenix.service",
    status: "running",
    cpu_percent: 12.4,
    ram_used_mb: 340,
    ram_limit_mb: 1024,
    uptime_seconds: 267300,
    created_at: "2026-05-14",
    platform: "Hikka",
  },
  {
    name: "nova21",
    unit: "ubnova21.service",
    status: "installing",
    cpu_percent: 0,
    ram_used_mb: 0,
    ram_limit_mb: 512,
    uptime_seconds: 0,
    created_at: "2026-08-15",
    platform: "Heroku",
  },
];

let MOCK_SUBSCRIPTION = {
  max_slots: 3,
  used_slots: 2,
  expires_at: "2026-09-20T00:00:00Z",
};

// ==========================================================================
// ЭКСПОРТ (если используется модульная система)
// ==========================================================================
// api.js is loaded as a classic script, so ES-module `export` would abort
// the entire file before app.js can call these functions.
window.DHostAPI = {
  fetchBots,
  fetchSubscription,
  botAction,
  reinstallBot,
  deleteBot,
  fetchLanguage,
  setLanguage,
  fetchAuthStatus,
  notifyInstallRequest,
  // Новые функции
  fetchDialogs,
  fetchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  fetchFolders,
  fetchChatInfo,
};
