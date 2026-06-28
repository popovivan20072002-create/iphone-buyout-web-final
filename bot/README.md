# Telegram-бот оценки iPhone

Бот повторяет логику сайта: собирает параметры устройства, считает цену через `lib/calculate-price.ts` и отправляет заявки в Albato (группа «Лиды»).

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
Albato=https://h.albato.ru/wh/...
```

`Albato` — тот же webhook, что и у сайта (также читаются `ALBATO`, `RELAY_URL`).

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
2. Прописать `BOT_TOKEN` и `Albato` в env
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
  flow.ts       — тексты шагов и переходы
  keyboards.ts  — inline-клавиатуры, «Назад»
  session.ts    — in-memory Map<chatId, state>
  types.ts      — типы сессии
```

Общая бизнес-логика — в `lib/` (цены, расчёт, формат заявки, Albato).
