"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { StepProps } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { StepLayout } from "@/components/ui/StepContainer";

export function StepBatteryCondition({ value, onChange, onNext }: StepProps) {
  return (
    <StepLayout
      title="Состояние аккумулятора"
      subtitle="Укажите текущий уровень здоровья батареи"
      footer={
        <Button fullWidth onClick={onNext}>
          Продолжить
        </Button>
      }
    >
      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-8 py-10">
        <div className="mb-8 text-center">
          <motion.span
            key={value.batteryHealth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[64px] font-semibold tracking-tight text-black"
          >
            {value.batteryHealth}%
          </motion.span>
          <p className="mt-2 text-[15px] text-neutral-500">Здоровье аккумулятора</p>
        </div>

        <input
          type="range"
          min={70}
          max={100}
          step={1}
          value={value.batteryHealth}
          onChange={(e) => onChange({ batteryHealth: Number(e.target.value) })}
          style={
            {
              "--value": `${((value.batteryHealth - 70) / 30) * 100}%`,
            } as CSSProperties
          }
          className="battery-slider w-full"
        />

        <div className="mt-3 flex justify-between text-[13px] text-neutral-400">
          <span>70%</span>
          <span>100%</span>
        </div>
      </div>
    </StepLayout>
  );
}
