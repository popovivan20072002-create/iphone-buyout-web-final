"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  children,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={[
        "w-full rounded-3xl border px-6 py-5 text-left transition-all duration-200",
        selected
          ? "border-black bg-black text-white"
          : "border-neutral-200 bg-white text-black hover:border-neutral-400",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[17px] font-medium leading-snug">{label}</p>
          {description && (
            <p
              className={[
                "mt-1 text-[14px] leading-snug",
                selected ? "text-neutral-300" : "text-neutral-500",
              ].join(" ")}
            >
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </motion.button>
  );
}
