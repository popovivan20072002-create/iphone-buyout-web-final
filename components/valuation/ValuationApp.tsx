"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { calculatePrice } from "@/lib/calculate-price";
import { initialLeadData, initialValuationData } from "@/lib/initial-state";
import { getEffectiveSim } from "@/lib/prices";
import { saveLead } from "@/lib/save-lead";
import type { AppPhase, LeadFormData, ValuationFormData } from "@/lib/types";
import { getValuationStepCount } from "@/components/valuation/valuation-steps";
import { HeroSection } from "@/components/landing/HeroSection";
import { AnalysisScreen } from "./AnalysisScreen";
import { LeadCaptureScreen } from "./LeadCaptureScreen";
import { OfferResultScreen } from "./OfferResultScreen";
import { SuccessScreen } from "./SuccessScreen";
import { ValuationForm } from "./ValuationForm";

export function ValuationApp() {
  const [phase, setPhase] = useState<AppPhase>("hero");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ValuationFormData>(initialValuationData);
  const [leadData, setLeadData] = useState<LeadFormData>(initialLeadData);

  const price = useMemo(() => calculatePrice(formData), [formData]);
  const totalSteps = useMemo(() => getValuationStepCount(formData), [formData.model, formData.storage]);

  const handleStart = () => {
    setPhase("form");
    setCurrentStep(0);
  };

  const handleChange = useCallback((updates: Partial<ValuationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setPhase("analysis");
    }
  }, [currentStep, totalSteps]);

  useEffect(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(Math.max(0, totalSteps - 1));
    }
  }, [currentStep, totalSteps]);

  useEffect(() => {
    if (!formData.model || !formData.storage) return;

    const sim = getEffectiveSim(formData.model, formData.storage, formData.sim);
    if (sim === formData.sim) return;

    setFormData((prev) => ({ ...prev, sim }));
  }, [formData.model, formData.storage, formData.sim]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setPhase("hero");
    }
  }, [currentStep]);

  const handleAnalysisComplete = useCallback(() => {
    setPhase("lead-capture");
  }, []);

  const handleLeadSubmit = useCallback(
    async (contact: LeadFormData) => {
      setLeadData(contact);
      await saveLead({ contact, valuation: formData, price, leadType: "unqualified" });
      setPhase("result");
    },
    [formData, price],
  );

  const handleAcceptOffer = useCallback(async () => {
    await saveLead({ contact: leadData, valuation: formData, price, leadType: "qualified" });
    setPhase("success");
  }, [leadData, formData, price]);

  if (phase === "hero") {
    return <HeroSection onStart={handleStart} />;
  }

  if (phase === "analysis") {
    return <AnalysisScreen onComplete={handleAnalysisComplete} />;
  }

  if (phase === "lead-capture") {
    return <LeadCaptureScreen onSubmit={handleLeadSubmit} />;
  }

  if (phase === "result") {
    return <OfferResultScreen price={price} onAcceptOffer={handleAcceptOffer} />;
  }

  if (phase === "success") {
    return <SuccessScreen />;
  }

  return (
    <ValuationForm
      formData={formData}
      currentStep={currentStep}
      onChange={handleChange}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
