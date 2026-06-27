export const BODY_CONDITIONS = [
  { id: "excellent" as const, label: "Отличное", description: "Как новый, без следов" },
  { id: "good" as const, label: "Хорошее", description: "Незначительные следы" },
  { id: "used" as const, label: "Есть следы использования", description: "Видимые потёртости" },
];

export const SCREEN_CONDITIONS = [
  { id: "perfect" as const, label: "Идеальный", description: "Без дефектов" },
  { id: "scratches" as const, label: "Есть царапины", description: "Мелкие следы" },
  { id: "broken" as const, label: "Разбит", description: "Трещины или сколы" },
];

export const REPAIR_OPTIONS = [
  { id: "none" as const, label: "Не ремонтировался" },
  { id: "screen" as const, label: "Меняли экран" },
  { id: "battery" as const, label: "Меняли аккумулятор" },
  { id: "other" as const, label: "Другое" },
];

export const HERO_BENEFITS = [
  {
    icon: "💰",
    text: "Деньги на карту сразу после проверки устройства",
  },
  {
    icon: "📦",
    text: "Бесплатная доставка из любого города России",
  },
  {
    icon: "⚡",
    text: "Предложение на выкуп за 30 секунд",
  },
] as const;

export const ANALYSIS_MESSAGES = [
  { icon: "🔍", text: "Анализируем состояние устройства..." },
  { icon: "📈", text: "Сравниваем стоимость с текущим рынком..." },
  { icon: "🤝", text: "Подбираем лучшее предложение..." },
  { icon: "✅", text: "Предложение готово." },
] as const;

export const ANALYSIS_STEP_DURATION_MS = 1000;
