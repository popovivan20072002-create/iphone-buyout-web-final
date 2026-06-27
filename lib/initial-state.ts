import { DEFAULT_SIM } from "./prices";
import type { LeadFormData, ValuationFormData } from "./types";

export const initialValuationData: ValuationFormData = {
  model: "",
  storage: "",
  sim: DEFAULT_SIM,
  batteryHealth: 85,
  bodyCondition: null,
  screenCondition: null,
  repairHistory: null,
  faceIdWorks: null,
  camerasWork: null,
};

export const initialLeadData: LeadFormData = {
  phone: "+7",
  telegram: "",
};
