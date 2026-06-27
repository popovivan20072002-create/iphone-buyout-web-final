export type BodyCondition = "excellent" | "good" | "used";
export type ScreenCondition = "perfect" | "scratches" | "broken";
export type RepairHistory = "none" | "screen" | "battery" | "other";
export type { SimType } from "./prices";
import type { SimType } from "./prices";

export interface ValuationFormData {
  model: string;
  storage: string;
  sim: SimType;
  batteryHealth: number;
  bodyCondition: BodyCondition | null;
  screenCondition: ScreenCondition | null;
  repairHistory: RepairHistory | null;
  faceIdWorks: boolean | null;
  camerasWork: boolean | null;
}

export interface LeadFormData {
  phone: string;
  telegram: string;
}

export type LeadType = "unqualified" | "qualified";

export interface Lead extends LeadFormData {
  valuation: ValuationFormData;
  price: number;
  leadType: LeadType;
  createdAt: string;
}

export type AppPhase =
  | "hero"
  | "form"
  | "analysis"
  | "lead-capture"
  | "result"
  | "success";

export interface StepProps {
  value: ValuationFormData;
  onChange: (updates: Partial<ValuationFormData>) => void;
  onNext: () => void;
  onBack?: () => void;
  registerBackOverride?: (handler: (() => void) | null) => void;
}
