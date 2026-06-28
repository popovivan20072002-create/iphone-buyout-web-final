import type { Api } from "grammy";
import { formatLeadMessage } from "../lib/format-lead-message";
import type { SendLeadToAlbatoInput } from "../lib/send-lead-to-albato";

export interface SendLeadToTelegramResult {
  ok: boolean;
}

function getLeadsChatId(): string | number | null {
  const raw = process.env.LEADS_CHAT_ID?.trim();
  if (!raw) return null;
  // Как в env: -5376425055 или -100... — Telegram API принимает string и number
  const asNumber = Number(raw);
  if (Number.isFinite(asNumber)) return asNumber;
  return raw;
}

export async function sendLeadToTelegramGroup(
  api: Api,
  input: SendLeadToAlbatoInput,
): Promise<SendLeadToTelegramResult> {
  const chatId = getLeadsChatId();

  if (!chatId) {
    console.error("[bot] LEADS_CHAT_ID missing");
    return { ok: false };
  }

  const text = formatLeadMessage({
    contact: input.contact,
    valuation: input.valuation,
    price: input.price,
    leadType: input.leadType,
    createdAt: input.createdAt ?? new Date().toISOString(),
    clientLabel: input.clientLabel,
  });

  try {
    await api.sendMessage(chatId, text, { parse_mode: "HTML" });
    return { ok: true };
  } catch (error) {
    console.error("[bot] Telegram lead delivery failed:", error);
    return { ok: false };
  }
}
