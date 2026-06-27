"use client";

import { REPAIR_OPTIONS } from "@/lib/constants";
import type { RepairHistory, StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepRepairHistory({ value, onChange, onNext }: StepProps) {
  const handleSelect = (repair: RepairHistory) => {
    onChange({ repairHistory: repair });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Был ли ремонт?"
      subtitle="Укажите, проводился ли ремонт устройства"
    >
      {REPAIR_OPTIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          selected={value.repairHistory === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </StepLayout>
  );
}
