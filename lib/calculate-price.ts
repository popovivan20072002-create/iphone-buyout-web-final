import { applyPercentDeduction, resolveAdjustments } from "./adjustments";
import { getBasePrice, getEffectiveSim } from "./prices";
import type { ValuationFormData } from "./types";

const ROUND_STEP = 500;
const MIN_PRICE = 1000;

export function calculatePrice(data: ValuationFormData): number {
  const sim = getEffectiveSim(data.model, data.storage, data.sim);
  const basePrice = getBasePrice(data.model, data.storage, sim);
  if (!basePrice) return 0;

  let percentDeductions = 0;
  let fixedAdjustments = 0;

  for (const rule of resolveAdjustments(data)) {
    if (rule.type === "percent") {
      percentDeductions += applyPercentDeduction(basePrice, rule);
    } else {
      fixedAdjustments += rule.value;
    }
  }

  const finalPrice = basePrice - percentDeductions + fixedAdjustments;

  return Math.max(MIN_PRICE, roundPrice(finalPrice));
}

function roundPrice(price: number): number {
  return Math.round(price / ROUND_STEP) * ROUND_STEP;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price);
}
