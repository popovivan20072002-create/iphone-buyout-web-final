import type { ValuationFormData } from "../lib/types";

export type BotStep =
  | "welcome"
  | "generation"
  | "model"
  | "storage"
  | "sim"
  | "battery"
  | "body"
  | "screen"
  | "repair"
  | "faceId"
  | "cameras"
  | "price"
  | "phone"
  | "qualified"
  | "done";

export interface BotSession {
  step: BotStep;
  generation?: string;
  valuation: Partial<ValuationFormData>;
  price: number;
  phone: string;
  clientLabel: string;
  telegram: string;
}

export function createEmptySession(): BotSession {
  return {
    step: "welcome",
    valuation: {},
    price: 0,
    phone: "",
    clientLabel: "Клиент из Telegram",
    telegram: "",
  };
}

export function isValuationComplete(
  valuation: Partial<ValuationFormData>,
): valuation is ValuationFormData {
  return (
    typeof valuation.model === "string" &&
    valuation.model.length > 0 &&
    typeof valuation.storage === "string" &&
    valuation.storage.length > 0 &&
    typeof valuation.sim === "string" &&
    typeof valuation.batteryHealth === "number" &&
    valuation.bodyCondition !== null &&
    valuation.bodyCondition !== undefined &&
    valuation.screenCondition !== null &&
    valuation.screenCondition !== undefined &&
    valuation.repairHistory !== null &&
    valuation.repairHistory !== undefined &&
    valuation.faceIdWorks !== null &&
    valuation.faceIdWorks !== undefined &&
    valuation.camerasWork !== null &&
    valuation.camerasWork !== undefined
  );
}
