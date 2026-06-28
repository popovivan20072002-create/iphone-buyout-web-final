import { InlineKeyboard, Keyboard } from "grammy";
import {
  BODY_CONDITIONS,
  REPAIR_OPTIONS,
  SCREEN_CONDITIONS,
} from "../lib/constants";
import {
  getIphoneGenerations,
  getIphoneModelsByGeneration,
  getStorageOptionsForModel,
} from "../lib/iphone-models";
import { SIM_OPTIONS, requiresSimSelection } from "../lib/prices";
import type { BotSession } from "./types";

export const CB = {
  START: "start",
  BACK: "back",
  QUALIFIED_YES: "qual:yes",
  QUALIFIED_NO: "qual:no",
  NEW: "new",
} as const;

export function welcomeKeyboard() {
  return new InlineKeyboard().text("▶️ Начать", CB.START);
}

export function backKeyboard(extra?: InlineKeyboard) {
  const keyboard = extra ?? new InlineKeyboard();
  return keyboard.row().text("◀️ Назад", CB.BACK);
}

export function generationKeyboard() {
  const keyboard = new InlineKeyboard();
  const generations = getIphoneGenerations();

  for (const generation of generations) {
    keyboard.text(`iPhone ${generation}`, `gen:${generation}`).row();
  }

  return backKeyboard(keyboard);
}

export function modelKeyboard(generation: string) {
  const keyboard = new InlineKeyboard();
  const models = getIphoneModelsByGeneration(generation);

  for (const model of models) {
    keyboard.text(model.label, `model:${model.id}`).row();
  }

  return backKeyboard(keyboard);
}

export function storageKeyboard(modelId: string) {
  const keyboard = new InlineKeyboard();
  const options = getStorageOptionsForModel(modelId);

  for (const option of options) {
    keyboard.text(option.label, `storage:${option.id}`).row();
  }

  return backKeyboard(keyboard);
}

export function simKeyboard(modelId: string, storageId: string) {
  const keyboard = new InlineKeyboard();

  if (!requiresSimSelection(modelId, storageId)) {
    return keyboard;
  }

  for (const option of SIM_OPTIONS) {
    keyboard.text(option.label, `sim:${option.id}`).row();
  }

  return backKeyboard(keyboard);
}

export function batteryKeyboard() {
  const keyboard = new InlineKeyboard()
    .text("90–100%", "battery:95")
    .text("85–89%", "battery:87")
    .row()
    .text("80–84%", "battery:82")
    .text("Меньше 80%", "battery:75")
    .row();

  return backKeyboard(keyboard);
}

export function bodyKeyboard() {
  const keyboard = new InlineKeyboard();
  for (const option of BODY_CONDITIONS) {
    keyboard.text(option.label, `body:${option.id}`).row();
  }
  return backKeyboard(keyboard);
}

export function screenKeyboard() {
  const keyboard = new InlineKeyboard();
  for (const option of SCREEN_CONDITIONS) {
    keyboard.text(option.label, `screen:${option.id}`).row();
  }
  return backKeyboard(keyboard);
}

export function repairKeyboard() {
  const keyboard = new InlineKeyboard();
  for (const option of REPAIR_OPTIONS) {
    keyboard.text(option.label, `repair:${option.id}`).row();
  }
  return backKeyboard(keyboard);
}

export function yesNoKeyboard(prefix: "face" | "cam") {
  const keyboard = new InlineKeyboard()
    .text("Да", `${prefix}:1`)
    .text("Нет", `${prefix}:0`)
    .row();

  return backKeyboard(keyboard);
}

export function qualifiedKeyboard() {
  return new InlineKeyboard()
    .text("💳 Получить деньги сегодня", CB.QUALIFIED_YES)
    .row()
    .text("Пока просто смотрю", CB.QUALIFIED_NO)
    .row()
    .text("◀️ Назад", CB.BACK);
}

export function phoneKeyboard() {
  return new Keyboard().requestContact("📱 Отправить номер телефона").resized();
}

export function removeKeyboard() {
  return { remove_keyboard: true as const };
}

export function finalKeyboard() {
  return new InlineKeyboard().text("🔄 Новая оценка", CB.NEW);
}

export function getPreviousStep(session: BotSession) {
  const { step, valuation } = session;

  switch (step) {
    case "generation":
      return "welcome" as const;
    case "model":
      return "generation" as const;
    case "storage":
      return "model" as const;
    case "sim":
      return "storage" as const;
    case "battery":
      if (
        valuation.model &&
        valuation.storage &&
        requiresSimSelection(valuation.model, valuation.storage)
      ) {
        return "sim" as const;
      }
      return "storage" as const;
    case "body":
      return "battery" as const;
    case "screen":
      return "body" as const;
    case "repair":
      return "screen" as const;
    case "faceId":
      return "repair" as const;
    case "cameras":
      return "faceId" as const;
    case "phone":
      return "price" as const;
    case "qualified":
      return "phone" as const;
    default:
      return null;
  }
}
