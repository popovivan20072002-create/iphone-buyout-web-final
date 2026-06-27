import type { ComponentType } from "react";
import {
  StepBatteryCondition,
  StepBodyCondition,
  StepCameras,
  StepFaceId,
  StepModel,
  StepRepairHistory,
  StepScreenCondition,
  StepSim,
  StepStorage,
} from "@/components/steps";
import { requiresSimSelection } from "@/lib/prices";
import type { StepProps, ValuationFormData } from "@/lib/types";

type StepComponent = ComponentType<StepProps>;

const CONDITION_STEPS: StepComponent[] = [
  StepBatteryCondition,
  StepBodyCondition,
  StepScreenCondition,
  StepRepairHistory,
  StepFaceId,
  StepCameras,
];

export function buildValuationSteps(formData: ValuationFormData): StepComponent[] {
  const steps: StepComponent[] = [StepModel, StepStorage];

  if (requiresSimSelection(formData.model, formData.storage)) {
    steps.push(StepSim);
  }

  return [...steps, ...CONDITION_STEPS];
}

export function getValuationStepCount(formData: ValuationFormData): number {
  return buildValuationSteps(formData).length;
}
