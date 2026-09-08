/**
 * api.js — обмен данными с бэкендом
 */

const USE_MOCKS = false;
const BASE_URL = "https://interfaces-telecom-examine-filing.trycloudflare.com";

function authHeaders() {
  const initData = window.Telegram?.WebApp?.initData || "";
  return {
    "Content-Type": "application/json",
    "X-Telegram-Init-Data": initData,
  };
}

const _wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBots() {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/bots`, { headers: authHeaders() });
    if (!res.ok) throw new Error("bots_fetch_failed");
    return await res.json();
  }
  await _wait(500);
  return MOCK_BOTS;
}

async function fetchSubscription() {
  if (!USE_MOCKS) {
    const res = await fetch(`${BASE_URL}/api/subscription`, { headers: authHeaders() });
    if (!res.ok) throw new Error("subscription_fetch_failed");
    return await res.json();
  }
  await _wait(300);
  return MOCK_SUBSCRIPTION;
}

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

async function fetchLanguage() {
  const cached = localStorage.getItem("mock_lang") || localStorage.getItem("dhost_lang") || "ru";
  if (!USE_MOCKS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${BASE_URL}/api/settings/language`, {
        headers: authHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) return cached;
      const data = await res.json();
      return data.language === "en" ? "en" : "ru";
    } catch (_) {
      return cached;
    }
  }
  await _wait(150);
  return cached;
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

async function fetchAuthStatus() {
  if (!USE_MOCKS) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/status`, {
        headers: authHeaders(),
      });
      if (!res.ok) return { authorized: false, has_bots: false, is_super_admin: false };

      const data = await res.json();
      return {
        authorized: data.authorized === true,
        has_bots: data.has_bots === true,
        can_manage_chats: data.can_manage_chats === true,
        is_super_admin: data.is_super_admin === true
      };
    } catch (_) {
      return { authorized: false, has_bots: false, is_super_admin: false };
    }
  }
  await _wait(400);
  return { authorized: MOCK_AUTHORIZED, has_bots: MOCK_BOTS.length > 0, is_super_admin: true };
}

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

// --------------------------------------------------------------------------
// АДМИНИСТРАТИВНЫЕ МЕТОДЫ (SUPER-ADMIN)
// --------------------------------------------------------------------------
async function fetchServerStats() {
  const res = await fetch(`${BASE_URL}/api/admin/server-stats`, { headers: authHeaders() });
  if (!res.ok) throw new Error("admin_stats_failed");
  return await res.json();
}

async function fetchAdminAllBots() {
  const res = await fetch(`${BASE_URL}/api/admin/all-bots`, { headers: authHeaders() });
  if (!res.ok) throw new Error("admin_bots_failed");
  return await res.json();
}

async function adminAddWhitelist(userId, days) {
  const res = await fetch(`${BASE_URL}/api/admin/whitelist/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ user_id: userId, days: Number(days) })
  });
  if (!res.ok) throw new Error("whitelist_add_failed");
  return await res.json();
}

async function adminRemoveWhitelist(userId) {
  const res = await fetch(`${BASE_URL}/api/admin/whitelist/remove`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error("whitelist_remove_failed");
  return await res.json();
}

async function adminSetRam(botName, mb) {
  const res = await fetch(`${BASE_URL}/api/admin/set-ram`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ bot_name: botName, mb: Number(mb) })
  });
  if (!res.ok) throw new Error("ram_set_failed");
  return await res.json();
}

async function adminDeleteBotByName(botName) {
  const res = await fetch(`${BASE_URL}/api/admin/delete-ubot`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ bot_name: botName })
  });
  if (!res.ok) throw new Error("bot_delete_failed");
  return await res.json();
}

async function adminRestartAllServices() {
  const res = await fetch(`${BASE_URL}/api/admin/restart-all`, {
    method: "POST",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("restart_all_failed");
  return await res.json();
}

// --------------------------------------------------------------------------
// ЧАТЫ
// --------------------------------------------------------------------------
async function fetchDialogs(botName) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getDialogs?bot_name=${encodeURIComponent(botName)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("dialogs_fetch_failed");
    return await res.json();
  }
  return [];
}

async function fetchMessages(botName, chatId, limit = 50, offset = 0) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getMessages?bot_name=${encodeURIComponent(botName)}&chat_id=${encodeURIComponent(chatId)}&limit=${limit}&offset=${offset}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("messages_fetch_failed");
    return await res.json();
  }
  return { messages: [], total: 0 };
}

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
  return { success: true, id: Date.now(), date: Math.floor(Date.now() / 1000), text };
}

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
  return { success: true };
}

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
  return { success: true };
}

async function fetchFolders(botName) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getFolders?bot_name=${encodeURIComponent(botName)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("folders_fetch_failed");
    return await res.json();
  }
  return [];
}

async function fetchChatInfo(botName, chatId) {
  if (!USE_MOCKS) {
    const res = await fetch(
      `${BASE_URL}/api/getChatInfo?bot_name=${encodeURIComponent(botName)}&chat_id=${encodeURIComponent(chatId)}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("chat_info_fetch_failed");
    return await res.json();
  }
  return { id: chatId, title: "Unknown", type: "private", participants: 0 };
}

let MOCK_AUTHORIZED = true;
let MOCK_BOTS = [
  {
    name: "andre",
    unit: "ubandre.service",
    status: "running",
    cpu_percent: 0.1,
    ram_used_mb: 76,
    ram_limit_mb: 500,
    uptime_seconds: 3480,
    created_at: "2026-09-03",
    platform: "Heroku",
  }
];
let MOCK_SUBSCRIPTION = { max_slots: 5, used_slots: 3, expires_at: "2027-08-03T00:00:00Z" };

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
  fetchDialogs,
  fetchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  fetchFolders,
  fetchChatInfo,
  fetchServerStats,
  fetchAdminAllBots,
  adminAddWhitelist,
  adminRemoveWhitelist,
  adminSetRam,
  adminDeleteBotByName,
  adminRestartAllServices
};
