const ALLOWED_TIMES = new Set(["17:00", "18:00", "19:00", "20:00"]);

function corsHeaders(origin, allowedOrigin) {
  const isAllowed = !allowedOrigin || origin === allowedOrigin;
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin || "*" : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers });
    }

    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
      return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers });
    }

    if (!ALLOWED_TIMES.has(body.time)) {
      return Response.json({ ok: false, error: "Invalid time" }, { status: 400, headers });
    }

    const message = [
      "💌 Ответ на приглашение",
      "",
      "Она согласна на свидание!",
      "📅 Понедельник, 20 июля 2026",
      `🕐 Выбранное время: ${body.time}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message }),
      },
    );

    if (!telegramResponse.ok) {
      return Response.json({ ok: false, error: "Telegram delivery failed" }, { status: 502, headers });
    }

    return Response.json({ ok: true }, { headers });
  },
};
