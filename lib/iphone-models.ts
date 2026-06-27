import { getStorageIdFromKey, getStorageLabel, MODEL_IDS, PRICES } from "./prices";

export type IphoneModel = {
  id: string;
  label: string;
};

export type StorageOption = {
  id: string;
  label: string;
};

const STORAGE_ORDER = ["64gb", "128gb", "256gb", "512gb", "1tb"];

function getGenerationFromId(id: string): string | null {
  const match = id.match(/^iphone-(\d+)/);
  return match?.[1] ?? null;
}

function getModelSortOrder(id: string): number {
  if (id.endsWith("-pro-max")) return 4;
  if (id.endsWith("-pro")) return 3;
  if (id.includes("-air")) return 2;
  if (id.endsWith("-plus")) return 1;
  if (id.includes("-mini")) return 0;
  return 0;
}

export function getCatalogModels(): IphoneModel[] {
  return Object.entries(MODEL_IDS).map(([id, label]) => ({ id, label }));
}

export function getIphoneGenerations(): string[] {
  const generations = new Set<string>();

  for (const model of getCatalogModels()) {
    const generation = getGenerationFromId(model.id);
    if (generation) generations.add(generation);
  }

  return [...generations].sort((a, b) => Number(b) - Number(a));
}

export function getIphoneModelsByGeneration(generation: string): IphoneModel[] {
  return getCatalogModels()
    .filter((model) => getGenerationFromId(model.id) === generation)
    .sort((a, b) => getModelSortOrder(a.id) - getModelSortOrder(b.id));
}

export function getGenerationFromModelId(modelId: string): string | null {
  return getGenerationFromId(modelId);
}

export function getStorageOptionsForModel(modelId: string): StorageOption[] {
  const modelLabel = MODEL_IDS[modelId];
  if (!modelLabel) return [];

  const storageKeys = Object.keys(PRICES[modelLabel] ?? {});

  return storageKeys
    .map((key) => ({
      id: getStorageIdFromKey(key),
      label: getStorageLabel(key),
    }))
    .sort((a, b) => STORAGE_ORDER.indexOf(a.id) - STORAGE_ORDER.indexOf(b.id));
}
