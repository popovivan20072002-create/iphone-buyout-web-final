import {
  BODY_CONDITIONS,
  REPAIR_OPTIONS,
  SCREEN_CONDITIONS,
} from "./constants";
import { formatPrice } from "./calculate-price";
import { MODEL_IDS, SIM_OPTIONS, getStorageLabel } from "./prices";
import type { LeadFormData, LeadType, ValuationFormData } from "./types";

const STORAGE_ID_TO_KEY: Record<string, string> = {
  "64gb": "64",
  "128gb": "128",
  "256gb": "256",
  "512gb": "512",
  "1tb": "1TB",
};

export interface LeadMessageInput {
  contact: LeadFormData;
  valuation: ValuationFormData;
  price: number;
  leadType: LeadType;
  createdAt: string;
  clientLabel?: string;
}

const LEAD_HEADERS: Record<LeadType, string> = {
  unqualified: "🟡 НЕ КВАЛ — узнал цену",
  qualified: "🟢 КВАЛ — получить деньги сегодня",
};

/** Стабильная строка, есть в каждой заявке (бот и сайт). */
export const LEAD_PRICE_MARKER = "💰 Итоговая цена выкупа:";

export { LEAD_HEADERS };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function labelFromOptions<T extends string>(
  id: T | null,
  options: readonly { id: T; label: string }[],
): string {
  if (!id) return "Не указано";
  return options.find((option) => option.id === id)?.label ?? id;
}

function formatBoolean(value: boolean | null, yes: string, no: string): string {
  if (value === true) return yes;
  if (value === false) return no;
  return "Не указано";
}

function formatStorageLabel(storageId: string): string {
  const key = STORAGE_ID_TO_KEY[storageId];
  return key ? getStorageLabel(key) : storageId;
}

function formatSimLabel(sim: ValuationFormData["sim"]): string {
  return SIM_OPTIONS.find((option) => option.id === sim)?.label ?? sim;
}

function formatModelLabel(modelId: string): string {
  return MODEL_IDS[modelId] ?? modelId;
}

function formatMoscowDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function formatLeadMessage(input: LeadMessageInput): string {
  const { contact, valuation, price, leadType, createdAt } = input;
  const telegram = contact.telegram.trim() || "не указан";

  const lines = [
    `<b>${escapeHtml(LEAD_HEADERS[leadType])}</b>`,
    "",
    `<b>Устройство</b>`,
    `Модель: ${escapeHtml(formatModelLabel(valuation.model))}`,
    `Память: ${escapeHtml(formatStorageLabel(valuation.storage))}`,
    `SIM: ${escapeHtml(formatSimLabel(valuation.sim))}`,
    "",
    `<b>Состояние</b>`,
    `АКБ: ${escapeHtml(`${valuation.batteryHealth}%`)}`,
    `Экран: ${escapeHtml(labelFromOptions(valuation.screenCondition, SCREEN_CONDITIONS))}`,
    `Корпус: ${escapeHtml(labelFromOptions(valuation.bodyCondition, BODY_CONDITIONS))}`,
    `Face ID: ${escapeHtml(formatBoolean(valuation.faceIdWorks, "Работает", "Не работает"))}`,
    `Камеры: ${escapeHtml(formatBoolean(valuation.camerasWork, "Работают", "Не работают"))}`,
    `Ремонт: ${escapeHtml(labelFromOptions(valuation.repairHistory, REPAIR_OPTIONS))}`,
    `Комплект: не указано`,
    "",
    `<b>💰 Итоговая цена выкупа:</b> ${escapeHtml(formatPrice(price))} ₽`,
    "",
    `<b>Контакт</b>`,
    `Имя: ${escapeHtml(input.clientLabel ?? "Клиент с сайта")}`,
    `Телефон: ${escapeHtml(contact.phone)}`,
    `Telegram: ${escapeHtml(telegram)}`,
    "",
    `🕐 ${escapeHtml(formatMoscowDateTime(createdAt))} (МСК)`,
  ];

  return lines.join("\n");
}

export function getAlbatoWebhookUrl(): string | null {
  const url =
    process.env.Albato?.trim() ||
    process.env.ALBATO?.trim() ||
    process.env.RELAY_URL?.trim();

  return url || null;
}
