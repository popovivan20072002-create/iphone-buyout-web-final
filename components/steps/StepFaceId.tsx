"use client";

import type { StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepFaceId({ value, onChange, onNext }: StepProps) {
  const handleSelect = (works: boolean) => {
    onChange({ faceIdWorks: works });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Работает ли Face ID?"
      subtitle="Проверьте распознавание лица на устройстве"
    >
      <OptionCard
        label="Да"
        description="Face ID работает корректно"
        selected={value.faceIdWorks === true}
        onClick={() => handleSelect(true)}
      />
      <OptionCard
        label="Нет"
        description="Face ID не работает или отключён"
        selected={value.faceIdWorks === false}
        onClick={() => handleSelect(false)}
      />
    </StepLayout>
  );
}
