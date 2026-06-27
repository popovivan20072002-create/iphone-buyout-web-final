"use client";

import type { StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepCameras({ value, onChange, onNext }: StepProps) {
  const handleSelect = (works: boolean) => {
    onChange({ camerasWork: works });
    setTimeout(onNext, 300);
  };

  return (
    <StepLayout
      title="Работают ли камеры?"
      subtitle="Проверьте основную и фронтальную камеры"
    >
      <OptionCard
        label="Да"
        description="Обе камеры работают без проблем"
        selected={value.camerasWork === true}
        onClick={() => handleSelect(true)}
      />
      <OptionCard
        label="Нет"
        description="Есть проблемы с одной или обеими камерами"
        selected={value.camerasWork === false}
        onClick={() => handleSelect(false)}
      />
    </StepLayout>
  );
}
