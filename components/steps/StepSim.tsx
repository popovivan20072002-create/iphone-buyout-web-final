"use client";

import { useMemo } from "react";
import { getSimOptionsForSelection } from "@/lib/prices";
import type { SimType, StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepSim({ value, onChange, onNext }: StepProps) {
  const options = useMemo(
    () => getSimOptionsForSelection(value.model, value.storage),
    [value.model, value.storage],
  );

  const handleSelect = (sim: SimType) => {
    onChange({ sim });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Какая версия iPhone?"
      subtitle="Выберите тип SIM-карты вашего устройства"
    >
      {options.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          selected={value.sim === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </StepLayout>
  );
}
