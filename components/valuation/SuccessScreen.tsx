"use client";

import { motion } from "framer-motion";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";

export function SuccessScreen() {
  return (
    <ScreenWrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-[0_8px_60px_rgba(0,0,0,0.06)] sm:p-14"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl text-white"
        >
          ✓
        </motion.div>

        <h2 className="text-[32px] font-semibold tracking-tight text-black sm:text-[36px]">
          Заявка успешно отправлена
        </h2>

        <p className="mt-5 text-[17px] leading-relaxed text-neutral-500">
          Наш менеджер уже получил информацию о вашем устройстве.
        </p>
        <p className="mt-2 text-[17px] leading-relaxed text-neutral-500">
          Мы свяжемся с вами в течение нескольких минут.
        </p>
      </motion.div>
    </ScreenWrapper>
  );
}
