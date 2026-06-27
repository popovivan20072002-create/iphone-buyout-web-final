"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/calculate-price";
import { generatePriceSteps } from "@/lib/generate-price-steps";

interface AnimatedPriceRevealProps {
  price: number;
  onAnimationComplete: () => void;
}

type PricePhase = "masked" | "animating" | "complete";

export function AnimatedPriceReveal({ price, onAnimationComplete }: AnimatedPriceRevealProps) {
  const [phase, setPhase] = useState<PricePhase>("masked");
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("animating"), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "animating") return;

    const steps = generatePriceSteps(price);
    setDisplayPrice(steps[0]);
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      if (index >= steps.length) {
        clearInterval(interval);
        setDisplayPrice(price);
        setPhase("complete");
        onAnimationComplete();
        return;
      }
      setDisplayPrice(steps[index]);
    }, 350);

    return () => clearInterval(interval);
  }, [phase, price, onAnimationComplete]);

  return (
    <div className="flex flex-col items-center">
      <div className="min-h-[52px] sm:min-h-[68px]">
        <AnimatePresence mode="wait">
          {phase === "masked" && (
            <motion.div
              key="masked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[40px] font-semibold leading-none tracking-tight text-neutral-300 sm:text-[56px]"
            >
              ██████ ₽
            </motion.div>
          )}

          {(phase === "animating" || phase === "complete") && displayPrice !== null && (
            <motion.div
              key={displayPrice}
              initial={{ opacity: 0.6, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[40px] font-semibold leading-none tracking-tight text-black sm:text-[56px]"
            >
              {formatPrice(displayPrice)} ₽
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 min-h-10 sm:mt-4 sm:min-h-14">
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg text-white shadow-lg shadow-emerald-500/25 sm:h-14 sm:w-14 sm:text-2xl"
            >
              ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
