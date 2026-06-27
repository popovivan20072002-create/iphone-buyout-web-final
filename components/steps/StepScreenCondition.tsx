"use client";

import { SCREEN_CONDITIONS } from "@/lib/constants";
import type { ScreenCondition, StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepScreenCondition({ value, onChange, onNext }: StepProps) {
  const handleSelect = (condition: ScreenCondition) => {
    onChange({ screenCondition: condition });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Состояние экрана"
      subtitle="Как выглядит дисплей вашего iPhone?"
    >
      {SCREEN_CONDITIONS.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          description={option.description}
          selected={value.screenCondition === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </StepLayout>
  );
}
