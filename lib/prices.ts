export type SimType = "physical" | "esim";

export type SimPrices = Partial<Record<SimType, number>>;

export type StoragePrices = Record<string, SimPrices>;

export const PRICES: Record<string, StoragePrices> = {
  "iPhone 17": {
    "256": { esim: 50000, physical: 52000 },
    "512": { esim: 53000, physical: 54000 },
  },

  "iPhone 17 Air": {
    "256": { esim: 52000 },
    "512": { esim: 55000 },
  },

  "iPhone 17 Pro": {
    "256": { esim: 70000, physical: 80000 },
    "512": { esim: 72000, physical: 82000 },
    "1TB": { esim: 75000, physical: 88000 },
  },

  "iPhone 17 Pro Max": {
    "256": { esim: 80000, physical: 85000 },
    "512": { esim: 85000, physical: 90000 },
    "1TB": { esim: 90000, physical: 95000 },
  },

  "iPhone 16": {
    "128": { esim: 42000, physical: 44000 },
    "256": { esim: 46000, physical: 48000 },
    "512": { esim: 50000, physical: 51000 },
  },

  "iPhone 16 Plus": {
    "128": { esim: 47000, physical: 48000 },
    "256": { esim: 49000, physical: 50000 },
    "512": { esim: 52000, physical: 53000 },
  },

  "iPhone 16 Pro": {
    "128": { esim: 49000, physical: 50000 },
    "256": { esim: 51000, physical: 52000 },
    "512": { esim: 53000, physical: 54000 },
    "1TB": { esim: 54500, physical: 55000 },
  },

  "iPhone 16 Pro Max": {
    "256": { esim: 54000, physical: 55000 },
    "512": { esim: 58000, physical: 60000 },
    "1TB": { esim: 59000, physical: 61000 },
  },

  "iPhone 15": {
    "128": { esim: 28000, physical: 29000 },
    "256": { esim: 29500, physical: 30000 },
    "512": { esim: 31000, physical: 31500 },
  },

  "iPhone 15 Plus": {
    "128": { esim: 29000, physical: 30000 },
    "256": { esim: 30500, physical: 31500 },
    "512": { esim: 32000, physical: 32500 },
  },

  "iPhone 15 Pro": {
    "128": { esim: 38000, physical: 40000 },
    "256": { esim: 41000, physical: 42000 },
    "512": { esim: 42000, physical: 43000 },
    "1TB": { esim: 43000, physical: 44000 },
  },

  "iPhone 15 Pro Max": {
    "256": { esim: 45000, physical: 46000 },
    "512": { esim: 46500, physical: 47500 },
    "1TB": { esim: 47500, physical: 48000 },
  },

  "iPhone 14": {
    "128": { esim: 21000, physical: 21500 },
    "256": { esim: 22000, physical: 22500 },
    "512": { esim: 23000, physical: 23500 },
  },

  "iPhone 14 Plus": {
    "128": { esim: 20000, physical: 21000 },
    "256": { esim: 23000, physical: 24000 },
    "512": { esim: 24500, physical: 25500 },
  },

  "iPhone 14 Pro": {
    "128": { esim: 28000, physical: 30000 },
    "256": { esim: 29000, physical: 31000 },
    "512": { esim: 30000, physical: 32000 },
    "1TB": { esim: 30000, physical: 32000 },
  },

  "iPhone 14 Pro Max": {
    "128": { esim: 29000, physical: 30000 },
    "256": { esim: 30000, physical: 33000 },
    "512": { esim: 33000, physical: 34000 },
    "1TB": { esim: 33000, physical: 34000 },
  },

  "iPhone 13 mini": {
    "128": { physical: 16000 },
    "256": { physical: 17000 },
    "512": { physical: 18000 },
  },

  "iPhone 13": {
    "128": { physical: 19000 },
    "256": { physical: 20000 },
    "512": { physical: 20500 },
  },

  "iPhone 13 Pro": {
    "128": { physical: 25000 },
    "256": { physical: 26000 },
    "512": { physical: 26500 },
    "1TB": { physical: 26500 },
  },

  "iPhone 13 Pro Max": {
    "128": { physical: 27000 },
    "256": { physical: 28000 },
    "512": { physical: 29000 },
    "1TB": { physical: 29000 },
  },

  "iPhone 12 mini": {
    "64": { physical: 7500 },
    "128": { physical: 8000 },
    "256": { physical: 9000 },
  },

  "iPhone 12": {
    "64": { physical: 7000 },
    "128": { physical: 8000 },
    "256": { physical: 8500 },
  },

  "iPhone 12 Pro": {
    "128": { physical: 15000 },
    "256": { physical: 16000 },
    "512": { physical: 16500 },
  },

  "iPhone 12 Pro Max": {
    "128": { physical: 18000 },
    "256": { physical: 18500 },
    "512": { physical: 19000 },
  },
};


export const MODEL_IDS: Record<string, string> = {
  "iphone-17": "iPhone 17",
  "iphone-17-air": "iPhone 17 Air",
  "iphone-17-pro": "iPhone 17 Pro",
  "iphone-17-pro-max": "iPhone 17 Pro Max",
  "iphone-16": "iPhone 16",
  "iphone-16-plus": "iPhone 16 Plus",
  "iphone-16-pro": "iPhone 16 Pro",
  "iphone-16-pro-max": "iPhone 16 Pro Max",
  "iphone-15": "iPhone 15",
  "iphone-15-plus": "iPhone 15 Plus",
  "iphone-15-pro": "iPhone 15 Pro",
  "iphone-15-pro-max": "iPhone 15 Pro Max",
  "iphone-14": "iPhone 14",
  "iphone-14-plus": "iPhone 14 Plus",
  "iphone-14-pro": "iPhone 14 Pro",
  "iphone-14-pro-max": "iPhone 14 Pro Max",
  "iphone-13-mini": "iPhone 13 mini",
  "iphone-13": "iPhone 13",
  "iphone-13-pro": "iPhone 13 Pro",
  "iphone-13-pro-max": "iPhone 13 Pro Max",
  "iphone-12-mini": "iPhone 12 mini",
  "iphone-12": "iPhone 12",
  "iphone-12-pro": "iPhone 12 Pro",
  "iphone-12-pro-max": "iPhone 12 Pro Max",
};

const STORAGE_ID_TO_KEY: Record<string, string> = {
  "64gb": "64",
  "128gb": "128",
  "256gb": "256",
  "512gb": "512",
  "1tb": "1TB",
};

const STORAGE_LABELS: Record<string, string> = {
  "64": "64 ГБ",
  "128": "128 ГБ",
  "256": "256 ГБ",
  "512": "512 ГБ",
  "1TB": "1 ТБ",
};

export const DEFAULT_SIM: SimType = "physical";

export const SIM_OPTIONS = [
  { id: "physical" as const, label: "Physical SIM" },
  { id: "esim" as const, label: "eSIM" },
] as const;

function getModelLabel(modelId: string): string | null {
  return MODEL_IDS[modelId] ?? null;
}

function getStorageKey(storageId: string): string | null {
  return STORAGE_ID_TO_KEY[storageId] ?? null;
}

export function getBasePrice(
  modelId: string,
  storageId: string,
  sim: SimType,
): number {
  const modelLabel = getModelLabel(modelId);
  const storageKey = getStorageKey(storageId);
  if (!modelLabel || !storageKey) return 0;

  return PRICES[modelLabel]?.[storageKey]?.[sim] ?? 0;
}

export function getAvailableSimTypes(modelId: string, storageId: string): SimType[] {
  const modelLabel = getModelLabel(modelId);
  const storageKey = getStorageKey(storageId);
  if (!modelLabel || !storageKey) return [];

  const simPrices = PRICES[modelLabel]?.[storageKey];
  if (!simPrices) return [];

  return (Object.keys(simPrices) as SimType[]).filter(
    (sim) => simPrices[sim] !== undefined,
  );
}

export function requiresSimSelection(modelId: string, storageId: string): boolean {
  const sims = getAvailableSimTypes(modelId, storageId);
  return sims.includes("physical") && sims.includes("esim");
}

export function resolveSimChoice(modelId: string, storageId: string): SimType {
  const sims = getAvailableSimTypes(modelId, storageId);
  if (sims.length === 1) return sims[0];
  if (sims.includes(DEFAULT_SIM)) return DEFAULT_SIM;
  return sims[0] ?? DEFAULT_SIM;
}

export function getEffectiveSim(
  modelId: string,
  storageId: string,
  sim: SimType,
): SimType {
  const available = getAvailableSimTypes(modelId, storageId);
  if (available.includes(sim)) return sim;
  return resolveSimChoice(modelId, storageId);
}

export function getSimOptionsForSelection(modelId: string, storageId: string) {
  return getAvailableSimTypes(modelId, storageId).map((id) => {
    const option = SIM_OPTIONS.find((item) => item.id === id);
    return { id, label: option?.label ?? id };
  });
}

export function getStorageLabel(storageKey: string): string {
  return STORAGE_LABELS[storageKey] ?? storageKey;
}

export function getStorageIdFromKey(storageKey: string): string {
  const entry = Object.entries(STORAGE_ID_TO_KEY).find(([, key]) => key === storageKey);
  return entry?.[0] ?? storageKey;
}
