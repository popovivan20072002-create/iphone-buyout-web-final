import type { Bot } from "grammy";
import { LEAD_HEADERS, LEAD_PRICE_MARKER } from "../lib/format-lead-message";
import { isLeadsGroupChat } from "./leads-chat";
import { incrementStat } from "./stats";

export function isLeadMessageText(text: string): boolean {
  return text.includes(LEAD_PRICE_MARKER);
}

export function parseLeadTypeFromText(
  text: string,
): "qualified" | "unqualified" | null {
  if (!isLeadMessageText(text)) return null;

  const isQualified = text.includes(LEAD_HEADERS.qualified);
  const isUnqualified = text.includes(LEAD_HEADERS.unqualified);

  if (isQualified && !isUnqualified) return "qualified";
  if (isUnqualified && !isQualified) return "unqualified";
  return null;
}

/**
 * Считает заявки с сайта (Albato) в группе «Лиды».
 * Собственные сообщения бота Telegram в updates не присылает —
 * их считаем в submitLead, здесь пропускаем отправителя-бота на всякий случай.
 */
export function registerLeadObserver(bot: Bot): void {
  let botUserId: number | null = null;

  void bot.api
    .getMe()
    .then((me) => {
      botUserId = me.id;
    })
    .catch((error) => {
      console.error("[bot/lead-observer] getMe failed:", error);
    });

  bot.use(async (ctx, next) => {
    const text = ctx.message?.text;
    if (!text || !isLeadsGroupChat(ctx)) {
      await next();
      return;
    }

    if (!isLeadMessageText(text)) {
      await next();
      return;
    }

    if (botUserId && ctx.from?.id === botUserId) {
      return;
    }

    const leadType = parseLeadTypeFromText(text);
    await incrementStat(leadType);
  });
}
