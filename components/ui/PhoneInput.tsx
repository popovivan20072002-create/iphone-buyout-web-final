"use client";

import { useCallback, useRef } from "react";
import {
  formatPhoneMask,
  getPhoneDigits,
  normalizePhoneDigits,
  truncatePhoneDigits,
} from "@/lib/phone";

interface PhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function PhoneInput({
  id,
  name,
  value,
  onChange,
  className,
  required,
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const applyValue = useCallback(
    (raw: string) => {
      const digits = truncatePhoneDigits(normalizePhoneDigits(raw));
      const formatted = formatPhoneMask(digits);
      onChange(formatted);

      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        const position = formatted.length;
        input.setSelectionRange(position, position);
      });
    },
    [onChange],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace" && event.key !== "Delete") return;

    const nationalDigits = getPhoneDigits(value).slice(1);
    if (nationalDigits.length === 0) {
      event.preventDefault();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    applyValue(event.clipboardData.getData("text"));
  };

  const handleFocus = () => {
    if (!value) {
      applyValue("+7");
    }
  };

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      required={required}
      placeholder="+7 (999) 000-00-00"
      value={value || "+7"}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      className={className}
    />
  );
}
