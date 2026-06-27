"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ANALYSIS_MESSAGES, ANALYSIS_STEP_DURATION_MS } from "@/lib/constants";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";

interface AnalysisScreenProps {
  onComplete: () => void;
}

export function AnalysisScreen({ onComplete }: AnalysisScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= ANALYSIS_MESSAGES.length - 1) {
      const timer = setTimeout(onComplete, ANALYSIS_STEP_DURATION_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setActiveIndex((prev) => prev + 1);
    }, ANALYSIS_STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, onComplete]);

  return (
    <ScreenWrapper>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-2 border-neutral-200 border-t-black"
          />
        </motion.div>

        <div className="flex min-h-[200px] w-full flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {ANALYSIS_MESSAGES.slice(0, activeIndex + 1).map((message, index) => (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className={[
                  "flex items-center gap-4 rounded-3xl px-6 py-4 text-left transition-colors duration-300",
                  index === activeIndex
                    ? "bg-black text-white"
                    : "bg-neutral-50 text-neutral-400",
                ].join(" ")}
              >
                <span className="text-2xl">{message.icon}</span>
                <span className="text-[16px] font-medium leading-snug">{message.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ScreenWrapper>
  );
}
