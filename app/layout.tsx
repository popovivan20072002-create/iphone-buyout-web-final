import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Выкуп iPhone — получите предложение за 30 секунд",
  description:
    "Узнайте, сколько мы готовы заплатить за ваш iPhone уже сегодня. Бесплатная доставка, деньги на карту после проверки.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-black">{children}</body>
    </html>
  );
}
