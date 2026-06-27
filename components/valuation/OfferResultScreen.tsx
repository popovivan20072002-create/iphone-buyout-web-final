"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { AnimatedPriceReveal } from "@/components/valuation/AnimatedPriceReveal";
import { Button } from "@/components/ui/Button";

interface OfferResultScreenProps {
  price: number;
  onAcceptOffer: () => void;
}

export function OfferResultScreen({ price, onAcceptOffer }: OfferResultScreenProps) {
  const [showExtras, setShowExtras] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setTimeout(() => setShowExtras(true), 300);
  }, []);

  return (
    <div className="bg-white">
      <section className="flex h-[100dvh] flex-col items-center justify-center px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-lg text-center"
        >
          <p className="text-[15px] font-medium text-neutral-500 sm:text-[16px]">
            Ваш iPhone оценен
          </p>

          <div className="mt-2 sm:mt-3">
            <AnimatedPriceReveal
              price={price}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          <p className="mt-1 text-[14px] text-neutral-400 sm:text-[15px]">
            Предварительная стоимость выкупа
          </p>

          <div className="mt-4 min-h-14 sm:mt-5">
            {showExtras && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Button fullWidth onClick={onAcceptOffer}>
                  💳 Получить деньги сегодня
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {showExtras && (
        <section className="mx-auto flex w-full max-w-lg flex-col gap-3 px-5 pb-8 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-3xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 sm:px-6 sm:py-5"
          >
            <p className="text-[16px] font-medium leading-snug text-black sm:text-[17px]">
              🎉 Отличная новость!
            </p>
            <p className="mt-1.5 text-[14px] leading-snug text-neutral-600 sm:text-[15px]">
              Мы готовы купить ваш iPhone за эту сумму уже сегодня.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-3xl border border-neutral-200 bg-neutral-50/80 px-5 py-4 sm:px-6 sm:py-5"
          >
            <p className="text-[14px] font-medium text-black sm:text-[15px]">
              Ваш персональный менеджер
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[13px]">🟢</span>
              <span className="text-[13px] font-medium text-emerald-600 sm:text-[14px]">
                Онлайн
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-neutral-500 sm:text-[14px]">
              Ответит в течение 3 минут.
            </p>
          </motion.div>
        </section>
      )}
    </div>
  );
}
