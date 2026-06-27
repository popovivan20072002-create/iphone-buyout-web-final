"use client";

import { BODY_CONDITIONS } from "@/lib/constants";
import type { BodyCondition, StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepBodyCondition({ value, onChange, onNext }: StepProps) {
  const handleSelect = (condition: BodyCondition) => {
    onChange({ bodyCondition: condition });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Состояние корпуса"
      subtitle="Оцените внешний вид корпуса устройства"
    >
      {BODY_CONDITIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          description={option.description}
          selected={value.bodyCondition === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </StepLayout>
  );
}
