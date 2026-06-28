# Telegram-бот оценки iPhone

Бот повторяет логику сайта: собирает параметры устройства, считает цену через `lib/calculate-price.ts` и отправляет заявки напрямую в Telegram-группу «Лиды».

## Требования

- **Node.js 20+** (рекомендуется LTS 20 или 22)
- npm 9+

## Установка

Из корня репозитория:

```bash
npm install
```

## Переменные окружения

Создайте `.env` в корне проекта (или экспортируйте переменные на VPS):

```env
BOT_TOKEN=123456:ABC-DEF...
LEADS_CHAT_ID=-1001234567890
```

- `BOT_TOKEN` — токен бота от [@BotFather](https://t.me/BotFather)
- `LEADS_CHAT_ID` — ID группы, куда падают заявки (бот должен быть добавлен в группу)

## Запуск

```bash
npm run bot
```

Бот работает в режиме **long polling** — публичный URL не нужен.

## Команды бота

| Команда | Действие |
|---|---|
| `/start` | Начать оценку |
| `/cancel` | Отменить текущую сессию |

## Деплой на VPS

1. Клонировать репозиторий, `npm install`
2. Прописать `BOT_TOKEN` и `LEADS_CHAT_ID` в env
3. Запустить через **pm2** или systemd:

```bash
pm2 start npm --name iphone-bot -- run bot
pm2 save
```

## Структура

```
bot/
  index.ts      — точка входа, polling
  handlers.ts   — обработчики шагов и callback-кнопок
  send-lead.ts  — отправка заявки в Telegram-группу
  flow.ts       — тексты шагов и переходы
  keyboards.ts  — inline-клавиатуры, «Назад»
  session.ts    — in-memory Map<chatId, state>
  types.ts      — типы сессии
```

Общая бизнес-логика — в `lib/` (цены, расчёт, формат заявки).
