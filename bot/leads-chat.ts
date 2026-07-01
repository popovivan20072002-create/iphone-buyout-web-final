import type { Context } from "grammy";

export function getLeadsChatId(): string | number | null {
  const raw = process.env.LEADS_CHAT_ID?.trim();
  if (!raw) return null;
  const asNumber = Number(raw);
  if (Number.isFinite(asNumber)) return asNumber;
  return raw;
}

export function isLeadsGroupChat(ctx: Context): boolean {
  const leadsChatId = getLeadsChatId();
  if (!leadsChatId || ctx.chat?.id == null) return false;
  return String(ctx.chat.id) === String(leadsChatId);
}
