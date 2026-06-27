"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { isPhoneComplete } from "@/lib/phone";
import { formatTelegramUsername } from "@/lib/telegram";
import type { LeadFormData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { TelegramInput } from "@/components/ui/TelegramInput";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";

interface LeadCaptureScreenProps {
  onSubmit: (data: LeadFormData) => void;
}

export function LeadCaptureScreen({ onSubmit }: LeadCaptureScreenProps) {
  const [form, setForm] = useState<LeadFormData>({ phone: "+7", telegram: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneComplete(form.phone)) return;

    setIsSubmitting(true);
    await onSubmit({
      ...form,
      telegram: formatTelegramUsername(form.telegram),
    });
    setIsSubmitting(false);
  };

  return (
    <ScreenWrapper>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-black sm:text-[36px]">
          🎉 Ваше предложение готово
        </h2>

        <p className="mt-4 text-[17px] leading-relaxed text-neutral-500">
          Закрепите предложение за собой на 24 часа.
        </p>
        <p className="mt-2 text-[17px] leading-relaxed text-neutral-500">
          Введите номер телефона, чтобы увидеть сумму выкупа и сохранить
          предложение.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-[13px] font-medium text-neutral-500"
            >
              Телефон
            </label>
            <PhoneInput
              id="phone"
              name="phone"
              required
              value={form.phone}
              onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
              className="h-14 w-full rounded-3xl border border-neutral-200 bg-white px-5 text-[17px] text-black outline-none transition-colors placeholder:text-neutral-300 focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="telegram"
              className="mb-2 block text-[13px] font-medium text-neutral-500"
            >
              Telegram{" "}
              <span className="font-normal text-neutral-400">(необязательно)</span>
            </label>
            <TelegramInput
              id="telegram"
              name="telegram"
              value={form.telegram}
              onChange={(telegram) => setForm((prev) => ({ ...prev, telegram }))}
            />
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Сохраняем..." : "Показать стоимость"}
          </Button>

          <p className="text-center text-[13px] leading-relaxed text-neutral-400">
            Мы не передаём ваши данные третьим лицам.
          </p>
        </form>
      </motion.div>
    </ScreenWrapper>
  );
}
