"use client";

import { stripTelegramPrefix } from "@/lib/telegram";

interface TelegramInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TelegramInput({
  id,
  name,
  value,
  onChange,
  className,
}: TelegramInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(stripTelegramPrefix(event.target.value));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    onChange(stripTelegramPrefix(event.clipboardData.getData("text")));
  };

  return (
    <div
      className={`flex h-14 items-center rounded-3xl border border-neutral-200 bg-white transition-colors focus-within:border-black ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="pointer-events-none select-none pl-5 text-[17px] text-neutral-400"
      >
        @
      </span>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="text"
        autoComplete="username"
        placeholder="username"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        className="h-full min-w-0 flex-1 bg-transparent pl-1 pr-5 text-[17px] text-black outline-none placeholder:text-neutral-300"
      />
    </div>
  );
}
