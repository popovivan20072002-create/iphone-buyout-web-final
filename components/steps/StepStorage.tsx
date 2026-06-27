"use client";

import { useMemo } from "react";
import { getStorageOptionsForModel } from "@/lib/iphone-models";
import { getEffectiveSim } from "@/lib/prices";
import type { StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepStorage({ value, onChange, onNext }: StepProps) {
  const options = useMemo(
    () => getStorageOptionsForModel(value.model),
    [value.model],
  );

  const handleSelect = (storageId: string) => {
    onChange({
      storage: storageId,
      sim: getEffectiveSim(value.model, storageId, value.sim),
    });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Память"
      subtitle="Сколько памяти в вашем iPhone?"
    >
      {options.map((option) => (
        <OptionCard
          key={option.id}
          label={option.label}
          selected={value.storage === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </StepLayout>
  );
}
