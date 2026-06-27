"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  getGenerationFromModelId,
  getIphoneGenerations,
  getIphoneModelsByGeneration,
} from "@/lib/iphone-models";
import { getEffectiveSim } from "@/lib/prices";
import type { StepProps } from "@/lib/types";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepLayout } from "@/components/ui/StepContainer";

type ModelView = "generations" | "models";

const ease = [0.25, 0.1, 0.25, 1] as const;

const subViewVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

function getInitialState(modelId: string) {
  const generation = getGenerationFromModelId(modelId);

  if (!generation) {
    return { view: "generations" as const, generation: null };
  }

  return { view: "models" as const, generation };
}

export function StepModel({
  value,
  onChange,
  onNext,
  registerBackOverride,
}: StepProps) {
  const initialState = getInitialState(value.model);
  const [view, setView] = useState<ModelView>(initialState.view);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(
    initialState.generation,
  );

  const generations = useMemo(() => getIphoneGenerations(), []);
  const models = useMemo(
    () => (selectedGeneration ? getIphoneModelsByGeneration(selectedGeneration) : []),
    [selectedGeneration],
  );

  useEffect(() => {
    if (view !== "models") {
      registerBackOverride?.(null);
      return;
    }

    registerBackOverride?.(() => {
      setView("generations");
    });

    return () => registerBackOverride?.(null);
  }, [view, registerBackOverride]);

  const handleGenerationSelect = (generation: string) => {
    setSelectedGeneration(generation);
    setView("models");
  };

  const handleModelSelect = (modelId: string) => {
    const updates: Partial<typeof value> = { model: modelId };

    if (value.storage) {
      updates.sim = getEffectiveSim(modelId, value.storage, value.sim);
    }

    onChange(updates);
    setTimeout(onNext, 300);
  };

  const title =
    view === "generations"
      ? "Выберите модель iPhone"
      : `iPhone ${selectedGeneration}`;

  const subtitle =
    view === "generations"
      ? "Укажите поколение вашего устройства"
      : "Выберите конкретную модель";

  return (
    <StepLayout title={title} subtitle={subtitle}>
      <AnimatePresence mode="wait">
        {view === "generations" ? (
          <motion.div
            key="generations"
            variants={subViewVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease }}
            className="flex flex-col gap-3"
          >
            {generations.map((generation) => (
              <OptionCard
                key={generation}
                label={`iPhone ${generation}`}
                selected={selectedGeneration === generation}
                onClick={() => handleGenerationSelect(generation)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="models"
            variants={subViewVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease }}
            className="flex flex-col gap-3"
          >
            {models.map((model) => (
              <OptionCard
                key={model.id}
                label={model.label}
                selected={value.model === model.id}
                onClick={() => handleModelSelect(model.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </StepLayout>
  );
}
