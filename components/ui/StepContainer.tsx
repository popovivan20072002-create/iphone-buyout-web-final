"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface StepContainerProps {
  stepKey: string | number;
  children: ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function StepContainer({ stepKey, children }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait" custom={1}>
      <motion.div
        key={stepKey}
        custom={1}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex w-full flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function StepLayout({ title, subtitle, children, footer }: StepLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-10">
        <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-black sm:text-[40px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[17px] leading-relaxed text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3">{children}</div>

      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
}
