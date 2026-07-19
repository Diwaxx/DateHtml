# Telegram Worker

Cloudflare Worker validates the selected time and sends it to Telegram.

Required Cloudflare secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Optional variable:

- `ALLOWED_ORIGIN` — for example, `https://diwaxx.github.io`
