import { calculatePrice, formatPrice } from "../lib/calculate-price";
import { DEFAULT_SIM, getEffectiveSim, MODEL_IDS, requiresSimSelection } from "../lib/prices";
import type { BotSession, BotStep } from "./types";
import { isValuationComplete } from "./types";
import {
  backKeyboard,
  batteryKeyboard,
  bodyKeyboard,
  finalKeyboard,
  generationKeyboard,
  modelKeyboard,
  phoneKeyboard,
  qualifiedKeyboard,
  repairKeyboard,
  screenKeyboard,
  simKeyboard,
  storageKeyboard,
  welcomeKeyboard,
  yesNoKeyboard,
} from "./keyboards";

type StepReply = {
  text: string;
  reply_markup?: ReturnType<typeof welcomeKeyboard> | ReturnType<typeof phoneKeyboard> | { remove_keyboard: true };
  parse_mode?: "HTML";
};

export function resolveSimForSession(session: BotSession): void {
  const { model, storage, sim } = session.valuation;
  if (!model || !storage) return;

  session.valuation.sim = getEffectiveSim(model, storage, sim ?? DEFAULT_SIM);
}

export function advanceAfterStorage(session: BotSession): BotStep {
  const { model, storage } = session.valuation;
  if (!model || !storage) return "storage";

  if (requiresSimSelection(model, storage)) {
    return "sim";
  }

  resolveSimForSession(session);
  return "battery";
}

export function buildStepReply(session: BotSession): StepReply {
  switch (session.step) {
    case "welcome":
      return {
        text:
          "👋 Привет! Я помогу быстро оценить ваш iPhone.\n\n" +
          "Ответьте на несколько вопросов — займёт около 2 минут.",
        reply_markup: welcomeKeyboard(),
      };

    case "generation":
      return {
        text: "📱 Выберите поколение iPhone:",
        reply_markup: generationKeyboard(),
      };

    case "model":
      return {
        text: `📱 iPhone ${session.generation}\n\nВыберите модель:`,
        reply_markup: modelKeyboard(session.generation ?? ""),
      };

    case "storage": {
      const modelId = session.valuation.model ?? "";
      const label = MODEL_IDS[modelId] ?? modelId;
      return {
        text: `${label}\n\n💾 Выберите объём памяти:`,
        reply_markup: storageKeyboard(modelId),
      };
    }

    case "sim":
      return {
        text: "📶 Какая версия iPhone?\n\nВыберите тип SIM:",
        reply_markup: simKeyboard(
          session.valuation.model ?? "",
          session.valuation.storage ?? "",
        ),
      };

    case "battery":
      return {
        text:
          "🔋 Укажите здоровье аккумулятора (70–100%).\n\n" +
          "Можно выбрать диапазон или отправить число сообщением.",
        reply_markup: batteryKeyboard(),
      };

    case "body":
      return {
        text: "📦 Какое состояние корпуса?",
        reply_markup: bodyKeyboard(),
      };

    case "screen":
      return {
        text: "🖥 Какое состояние экрана?",
        reply_markup: screenKeyboard(),
      };

    case "repair":
      return {
        text: "🔧 Был ли ремонт?",
        reply_markup: repairKeyboard(),
      };

    case "faceId":
      return {
        text: "🔐 Работает ли Face ID?",
        reply_markup: yesNoKeyboard("face"),
      };

    case "cameras":
      return {
        text: "📷 Работают ли камеры?",
        reply_markup: yesNoKeyboard("cam"),
      };

    case "price": {
      resolveSimForSession(session);

      if (isValuationComplete(session.valuation)) {
        session.price = calculatePrice(session.valuation);
      }

      return {
        text:
          `✅ Оценка готова!\n\n` +
          `💰 <b>Предварительная цена выкупа: ${formatPrice(session.price)} ₽</b>\n\n` +
          "Оставьте номер телефона, чтобы закрепить предложение.",
        parse_mode: "HTML",
      };
    }

    case "phone":
      return {
        text: "📞 Отправьте номер телефона кнопкой ниже или введите в формате +7…",
        reply_markup: phoneKeyboard(),
      };

    case "qualified":
      return {
        text:
          "🎉 Отлично! Предложение закреплено.\n\n" +
          "Готовы сдать iPhone и получить деньги сегодня?",
        reply_markup: qualifiedKeyboard(),
      };

    case "done":
      return {
        text:
          "✅ Спасибо! Менеджер свяжется с вами в течение 3 минут.\n\n" +
          "Хотите оценить другой iPhone?",
        reply_markup: finalKeyboard(),
      };

    default:
      return {
        text: "Нажмите /start, чтобы начать оценку.",
        reply_markup: welcomeKeyboard(),
      };
  }
}

export function getStepAfterCameras(): BotStep {
  return "price";
}
