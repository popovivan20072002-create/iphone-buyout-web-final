import type { Bot, Context } from "grammy";
import { formatPhoneMask, isPhoneComplete } from "../lib/phone";
import { sendLeadToTelegramGroup } from "./send-lead";
import { isLeadsGroupChat } from "./leads-chat";
import { registerLeadObserver } from "./lead-observer";
import { formatStatsMessage, getStats, incrementStat } from "./stats";
import { formatTelegramUsername } from "../lib/telegram";
import type {
  BodyCondition,
  RepairHistory,
  ScreenCondition,
  SimType,
} from "../lib/types";
import { CB } from "./keyboards";
import {
  advanceAfterStorage,
  buildStepReply,
  getStepAfterCameras,
} from "./flow";
import { getPreviousStep } from "./keyboards";
import { clearSession, getSession, resetSession } from "./session";
import { isValuationComplete, type BotStep } from "./types";

function getClientLabel(ctx: Context): string {
  const user = ctx.from;
  if (!user) return "Клиент из Telegram";

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.username || "Клиент из Telegram";
}

function getTelegramContact(ctx: Context): string {
  const username = ctx.from?.username;
  if (!username) return "";
  return formatTelegramUsername(username);
}

async function sendStep(ctx: Context, step: BotStep) {
  const session = getSession(ctx.chat!.id);
  session.step = step;
  const reply = buildStepReply(session);

  await ctx.reply(reply.text, {
    reply_markup: reply.reply_markup,
    parse_mode: reply.parse_mode,
  });
}

async function goBack(ctx: Context) {
  const session = getSession(ctx.chat!.id);
  const previous = getPreviousStep(session);

  if (!previous) {
    await ctx.answerCallbackQuery();
    return;
  }

  session.step = previous;
  await ctx.answerCallbackQuery();
  const reply = buildStepReply(session);

  if (session.step === "phone") {
    await ctx.reply(reply.text, { reply_markup: reply.reply_markup });
    return;
  }

  await ctx.editMessageText(reply.text, {
    reply_markup: reply.reply_markup,
    parse_mode: reply.parse_mode,
  });
}

async function submitLead(
  ctx: Context,
  leadType: "unqualified" | "qualified",
): Promise<boolean> {
  const session = getSession(ctx.chat!.id);

  if (!isValuationComplete(session.valuation) || !session.phone) {
    return false;
  }

  const result = await sendLeadToTelegramGroup(ctx.api, {
    contact: {
      phone: session.phone,
      telegram: session.telegram,
    },
    valuation: session.valuation,
    price: session.price,
    leadType,
    clientLabel: session.clientLabel,
  });

  if (!result.ok) {
    console.error("[bot] Telegram lead delivery failed");
    return false;
  }

  await incrementStat(leadType);
  return true;
}

export function registerHandlers(bot: Bot) {
  registerLeadObserver(bot);

  bot.command("start", async (ctx) => {
    resetSession(ctx.chat.id);
    const session = getSession(ctx.chat.id);
    session.clientLabel = getClientLabel(ctx);
    session.telegram = getTelegramContact(ctx);
    await sendStep(ctx, "welcome");
  });

  bot.command("cancel", async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply("❌ Оценка отменена. Нажмите /start, чтобы начать заново.");
  });

  bot.command("stats", async (ctx) => {
    const OWNER_ID = 1953345120;

    if (ctx.from?.id !== OWNER_ID) {
      await ctx.reply("Команда доступна только владельцу.");
      return;
    }

    const stats = await getStats();
    await ctx.reply(formatStatsMessage(stats), { parse_mode: "HTML" });
  });

  bot.callbackQuery(CB.START, async (ctx) => {
    const session = getSession(ctx.chat!.id);
    session.clientLabel = getClientLabel(ctx);
    session.telegram = getTelegramContact(ctx);
    session.step = "generation";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(CB.BACK, async (ctx) => {
    await goBack(ctx);
  });

  bot.callbackQuery(CB.NEW, async (ctx) => {
    resetSession(ctx.chat!.id);
    const session = getSession(ctx.chat!.id);
    session.clientLabel = getClientLabel(ctx);
    session.telegram = getTelegramContact(ctx);
    await ctx.answerCallbackQuery();
    await sendStep(ctx, "welcome");
  });

  bot.callbackQuery(/^gen:/, async (ctx) => {
    const generation = ctx.callbackQuery.data.slice(4);
    const session = getSession(ctx.chat!.id);
    session.generation = generation;
    session.step = "model";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^model:/, async (ctx) => {
    const modelId = ctx.callbackQuery.data.slice(6);
    const session = getSession(ctx.chat!.id);
    session.valuation.model = modelId;
    session.step = "storage";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^storage:/, async (ctx) => {
    const storageId = ctx.callbackQuery.data.slice(8);
    const session = getSession(ctx.chat!.id);
    session.valuation.storage = storageId;
    session.step = advanceAfterStorage(session);
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^sim:/, async (ctx) => {
    const sim = ctx.callbackQuery.data.slice(4) as SimType;
    const session = getSession(ctx.chat!.id);
    session.valuation.sim = sim;
    session.step = "battery";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^battery:/, async (ctx) => {
    const health = Number(ctx.callbackQuery.data.slice(8));
    const session = getSession(ctx.chat!.id);
    session.valuation.batteryHealth = health;
    session.step = "body";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^body:/, async (ctx) => {
    const body = ctx.callbackQuery.data.slice(5) as BodyCondition;
    const session = getSession(ctx.chat!.id);
    session.valuation.bodyCondition = body;
    session.step = "screen";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^screen:/, async (ctx) => {
    const screen = ctx.callbackQuery.data.slice(7) as ScreenCondition;
    const session = getSession(ctx.chat!.id);
    session.valuation.screenCondition = screen;
    session.step = "repair";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^repair:/, async (ctx) => {
    const repair = ctx.callbackQuery.data.slice(7) as RepairHistory;
    const session = getSession(ctx.chat!.id);
    session.valuation.repairHistory = repair;
    session.step = "faceId";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^face:/, async (ctx) => {
    const works = ctx.callbackQuery.data.slice(5) === "1";
    const session = getSession(ctx.chat!.id);
    session.valuation.faceIdWorks = works;
    session.step = "cameras";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(/^cam:/, async (ctx) => {
    const works = ctx.callbackQuery.data.slice(4) === "1";
    const session = getSession(ctx.chat!.id);
    session.valuation.camerasWork = works;
    session.step = getStepAfterCameras();
    await ctx.answerCallbackQuery();

    const priceReply = buildStepReply(session);
    await ctx.editMessageText(priceReply.text, {
      parse_mode: priceReply.parse_mode,
    });

    session.step = "phone";
    const phoneReply = buildStepReply(session);
    await ctx.reply(phoneReply.text, {
      reply_markup: phoneReply.reply_markup,
    });
  });

  bot.callbackQuery(CB.QUALIFIED_YES, async (ctx) => {
    const session = getSession(ctx.chat!.id);
    await ctx.answerCallbackQuery({ text: "Отправляем заявку…" });

    await submitLead(ctx, "qualified");

    session.step = "done";
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.callbackQuery(CB.QUALIFIED_NO, async (ctx) => {
    const session = getSession(ctx.chat!.id);
    session.step = "done";
    await ctx.answerCallbackQuery();
    const reply = buildStepReply(session);
    await ctx.editMessageText(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.on("message:contact", async (ctx) => {
    if (isLeadsGroupChat(ctx)) return;

    const session = getSession(ctx.chat.id);
    if (session.step !== "phone" && session.step !== "price") return;

    const phone = formatPhoneMask(ctx.message.contact.phone_number);
    if (!isPhoneComplete(phone)) {
      await ctx.reply("Не удалось распознать номер. Попробуйте ещё раз.");
      return;
    }

    session.phone = phone;
    await submitLead(ctx, "unqualified");

    await ctx.reply("✅ Номер получен!", { reply_markup: { remove_keyboard: true } });

    session.step = "qualified";
    const reply = buildStepReply(session);
    await ctx.reply(reply.text, { reply_markup: reply.reply_markup });
  });

  bot.on("message:text", async (ctx) => {
    if (isLeadsGroupChat(ctx)) return;

    const session = getSession(ctx.chat.id);
    const text = ctx.message.text.trim();

    if (session.step === "battery") {
      const health = Number(text);
      if (!Number.isInteger(health) || health < 70 || health > 100) {
        await ctx.reply("Введите число от 70 до 100 или выберите кнопку.");
        return;
      }

      session.valuation.batteryHealth = health;
      session.step = "body";
      const reply = buildStepReply(session);
      await ctx.reply(reply.text, { reply_markup: reply.reply_markup });
      return;
    }

    if (session.step === "phone" || session.step === "price") {
      const phone = formatPhoneMask(text);
      if (!isPhoneComplete(phone)) {
        await ctx.reply("Введите корректный номер (+7…) или нажмите кнопку «Отправить номер».");
        return;
      }

      session.phone = phone;
      await submitLead(ctx, "unqualified");

      await ctx.reply("✅ Номер получен!", { reply_markup: { remove_keyboard: true } });

      session.step = "qualified";
      const reply = buildStepReply(session);
      await ctx.reply(reply.text, { reply_markup: reply.reply_markup });
      return;
    }

    if (session.step === "welcome") {
      await ctx.reply("Нажмите «Начать» или отправьте /start.");
      return;
    }

    await ctx.reply("Используйте кнопки под сообщением или /cancel для отмены.");
  });
}
