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
}

const LEAD_HEADERS: Record<LeadType, string> = {
  unqualified: "🟡 НЕ КВАЛ — узнал цену",
  qualified: "🟢 КВАЛ — получить деньги",
};

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

export function formatLeadComments(input: LeadMessageInput): string {
  const { contact, valuation, price, leadType, createdAt } = input;
  const telegram = contact.telegram.trim() || "не указан";

  const lines = [
    LEAD_HEADERS[leadType],
    "",
    "Устройство",
    `Модель: ${formatModelLabel(valuation.model)}`,
    `Память: ${formatStorageLabel(valuation.storage)}`,
    `SIM: ${formatSimLabel(valuation.sim)}`,
    "",
    "Состояние",
    `АКБ: ${valuation.batteryHealth}%`,
    `Экран: ${labelFromOptions(valuation.screenCondition, SCREEN_CONDITIONS)}`,
    `Корпус: ${labelFromOptions(valuation.bodyCondition, BODY_CONDITIONS)}`,
    `Face ID: ${formatBoolean(valuation.faceIdWorks, "Работает", "Не работает")}`,
    `Камеры: ${formatBoolean(valuation.camerasWork, "Работают", "Не работают")}`,
    `Ремонт: ${labelFromOptions(valuation.repairHistory, REPAIR_OPTIONS)}`,
    "Комплект: не указано",
    "",
    `Итоговая цена выкупа: ${formatPrice(price)} ₽`,
    "",
    "Контакт",
    `Телефон: ${contact.phone}`,
    `Telegram: ${telegram}`,
    "",
    `${formatMoscowDateTime(createdAt)} (МСК)`,
  ];

  return lines.join("\n");
}

export function buildBitrixLeadPayload(input: LeadMessageInput) {
  const model = formatModelLabel(input.valuation.model);
  const storage = formatStorageLabel(input.valuation.storage);
  const sim = formatSimLabel(input.valuation.sim);

  return {
    fields: {
      TITLE: `Заявка с сайта iphonecash — ${model} ${storage} ${sim}`,
      NAME: "Клиент с сайта",
      PHONE: [{ VALUE: input.contact.phone, VALUE_TYPE: "WORK" }],
      COMMENTS: formatLeadComments(input),
      SOURCE_DESCRIPTION: input.leadType,
    },
  };
}

export function getBitrixWebhookUrl(): string | null {
  const raw = process.env.BITRIX_WEBHOOK_URL?.trim();
  if (!raw) return null;
  return raw.endsWith("/") ? raw : `${raw}/`;
}
