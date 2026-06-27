import type { ValuationFormData } from "./types";

export const ADJUSTMENTS = {
  battery: {
    "90-100": { type: "percent", value: 0 },
    "85-89": { type: "percent", value: 0.03, min: 1000, max: 4000 },
    "80-84": { type: "percent", value: 0.06, min: 2000, max: 7000 },
    "<80": { type: "percent", value: 0.1, min: 3000, max: 12000 },
  },

  body: {
    excellent: { type: "percent", value: 0 },
    good: { type: "percent", value: 0.03, min: 1000, max: 5000 },
    used: { type: "percent", value: 0.07, min: 2000, max: 9000 },
    bad: { type: "percent", value: 0.12, min: 3000, max: 15000 },
  },

  screen: {
    perfect: { type: "percent", value: 0 },
    scratches: { type: "percent", value: 0.04, min: 1000, max: 6000 },
    deep: { type: "percent", value: 0.08, min: 2500, max: 12000 },
    broken: { type: "percent", value: 0.18, min: 5000, max: 25000 },
  },

  faceId: {
    working: { type: "fixed", value: 0 },
    broken: { type: "fixed", value: -7000 },
  },

  trueTone: {
    yes: { type: "fixed", value: 0 },
    no: { type: "fixed", value: -2500 },
  },

  repair: {
    none: { type: "fixed", value: 0 },
    screen: { type: "fixed", value: -5000 },
    battery: { type: "fixed", value: -2000 },
    other: { type: "fixed", value: -5000 },
  },

  kit: {
    phone: { type: "fixed", value: 0 },
    box: { type: "fixed", value: 500 },
    full: { type: "fixed", value: 1000 },
  },
} as const;

type PercentAdjustment = {
  type: "percent";
  value: number;
  min?: number;
  max?: number;
};

type FixedAdjustment = {
  type: "fixed";
  value: number;
};

export type AdjustmentRule = PercentAdjustment | FixedAdjustment;

type AdjustmentCategory = keyof typeof ADJUSTMENTS;

function getRule(category: AdjustmentCategory, key: string): AdjustmentRule | null {
  const categoryMap = ADJUSTMENTS[category] as Record<string, AdjustmentRule>;
  return categoryMap[key] ?? null;
}

function resolveBatteryKey(health: number): string {
  if (health >= 90) return "90-100";
  if (health >= 85) return "85-89";
  if (health >= 80) return "80-84";
  return "<80";
}

export function resolveAdjustments(data: ValuationFormData): AdjustmentRule[] {
  const rules: AdjustmentRule[] = [];

  const batteryRule = getRule("battery", resolveBatteryKey(data.batteryHealth));
  if (batteryRule) rules.push(batteryRule);

  if (data.bodyCondition) {
    const rule = getRule("body", data.bodyCondition);
    if (rule) rules.push(rule);
  }

  if (data.screenCondition) {
    const rule = getRule("screen", data.screenCondition);
    if (rule) rules.push(rule);
  }

  if (data.faceIdWorks !== null) {
    const key = data.faceIdWorks ? "working" : "broken";
    const rule = getRule("faceId", key);
    if (rule) rules.push(rule);
  }

  if (data.repairHistory) {
    const rule = getRule("repair", data.repairHistory);
    if (rule) rules.push(rule);
  }

  return rules;
}

export function applyPercentDeduction(
  basePrice: number,
  rule: PercentAdjustment,
): number {
  let discount = basePrice * rule.value;

  if (rule.min !== undefined && discount < rule.min) {
    discount = rule.min;
  }

  if (rule.max !== undefined && discount > rule.max) {
    discount = rule.max;
  }

  return discount;
}
