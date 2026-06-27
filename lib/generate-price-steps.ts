export function generatePriceSteps(finalPrice: number): number[] {
  if (finalPrice <= 0) return [0];

  const min = Math.max(5000, Math.floor((finalPrice * 0.42) / 5000) * 5000);
  const stepCount = 5;
  const steps: number[] = [];

  for (let i = 1; i <= stepCount; i++) {
    const progress = i / stepCount;
    const raw = min + (finalPrice - min) * progress;
    const rounded = Math.round(raw / 500) * 500;
    steps.push(i === stepCount ? finalPrice : rounded);
  }

  return [...new Set(steps)];
}
