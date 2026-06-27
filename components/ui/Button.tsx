"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-black text-white hover:bg-neutral-800 active:scale-[0.98] disabled:bg-neutral-300 disabled:text-neutral-500",
  secondary:
    "bg-neutral-100 text-black hover:bg-neutral-200 active:scale-[0.98] disabled:bg-neutral-50 disabled:text-neutral-400",
  ghost:
    "bg-transparent text-neutral-500 hover:text-black active:scale-[0.98] disabled:text-neutral-300",
};

const sizes = {
  lg: "h-14 px-8 text-[17px] font-medium",
  md: "h-12 px-6 text-[15px] font-medium",
};

export function Button({
  children,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-3xl transition-all duration-200",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
