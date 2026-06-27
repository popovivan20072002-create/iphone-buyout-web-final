"use client";

import { useCallback, useMemo, useRef } from "react";
import type { ValuationFormData } from "@/lib/types";
import { buildValuationSteps } from "@/components/valuation/valuation-steps";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepContainer } from "@/components/ui/StepContainer";

interface ValuationFormProps {
  formData: ValuationFormData;
  currentStep: number;
  onChange: (updates: Partial<ValuationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ValuationForm({
  formData,
  currentStep,
  onChange,
  onNext,
  onBack,
}: ValuationFormProps) {
  const steps = useMemo(() => buildValuationSteps(formData), [formData.model, formData.storage]);
  const totalSteps = steps.length;
  const StepComponent = steps[currentStep] ?? steps[0];
  const backOverrideRef = useRef<(() => void) | null>(null);

  const registerBackOverride = useCallback((handler: (() => void) | null) => {
    backOverrideRef.current = handler;
  }, []);

  const handleBack = useCallback(() => {
    if (backOverrideRef.current) {
      backOverrideRef.current();
      return;
    }

    onBack();
  }, [onBack]);

  const handleStepNext = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="md" onClick={handleBack} className="shrink-0 px-0">
            ← Назад
          </Button>
          <div className="flex-1">
            <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />
          </div>
        </div>

        <StepContainer stepKey={currentStep}>
          <StepComponent
            value={formData}
            onChange={onChange}
            onNext={handleStepNext}
            onBack={onBack}
            registerBackOverride={registerBackOverride}
          />
        </StepContainer>
      </div>
    </div>
  );
}
