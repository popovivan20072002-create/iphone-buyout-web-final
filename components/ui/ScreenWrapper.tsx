"use client";

import type { ReactNode } from "react";

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ScreenWrapper({ children, className = "" }: ScreenWrapperProps) {
  return (
    <div
      className={[
        "flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto w-full max-w-lg">{children}</div>
    </div>
  );
}
