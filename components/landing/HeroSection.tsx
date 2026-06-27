"use client";

import { motion } from "framer-motion";
import { HERO_BENEFITS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";

interface HeroSectionProps {
  onStart: () => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease },
});

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <ScreenWrapper className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <motion.p
          {...fadeUp(0.05)}
          className="mb-8 text-[12px] font-medium uppercase tracking-[0.22em] text-neutral-400 sm:mb-10 sm:text-[13px]"
        >
          Выкуп iPhone
        </motion.p>

        <motion.h1
          {...fadeUp(0.12)}
          className="max-w-[16ch] text-[42px] font-semibold leading-[1.08] tracking-tight text-black sm:max-w-none sm:text-[56px] sm:leading-[1.06] md:text-[64px]"
        >
          Узнай цену своего iPhone уже сегодня.
        </motion.h1>

        <motion.p
          {...fadeUp(0.22)}
          className="mt-8 max-w-[34ch] text-[17px] leading-[1.55] text-neutral-500 sm:mt-10 sm:max-w-lg sm:text-[19px] sm:leading-relaxed"
        >
          Ответьте на 7 коротких вопросов и получите честную цену всего за 30
          секунд.
        </motion.p>

        <motion.ul
          {...fadeUp(0.32)}
          className="mt-12 flex w-full flex-col gap-3 text-left sm:mt-14 sm:gap-4"
        >
          {HERO_BENEFITS.map((benefit, index) => (
            <motion.li
              key={benefit.text}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 + index * 0.07, duration: 0.55, ease }}
              className="flex items-start gap-3.5 rounded-3xl border border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6 sm:py-5"
            >
              <span className="mt-0.5 text-[22px] leading-none sm:text-2xl">
                {benefit.icon}
              </span>
              <span className="text-[15px] leading-snug text-neutral-600 sm:text-[16px]">
                {benefit.text}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          {...fadeUp(0.62)}
          className="mt-12 w-full sm:mt-16"
        >
          <Button
            fullWidth
            onClick={onStart}
            className="h-16 text-[18px] sm:h-[68px] sm:text-[19px]"
          >
            Рассчитать цену
          </Button>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}
