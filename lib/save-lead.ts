import type { Lead, LeadFormData, LeadType, ValuationFormData } from "./types";

const STORAGE_KEY = "iphone-buyout-leads";

export interface SaveLeadInput {
  contact: LeadFormData;
  valuation: ValuationFormData;
  price: number;
  leadType: LeadType;
}

async function sendLeadToRelay(payload: {
  contact: LeadFormData;
  valuation: ValuationFormData;
  price: number;
  leadType: LeadType;
  createdAt: string;
}): Promise<void> {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("[saveLead] /api/lead failed:", response.status, body);
    return;
  }

  console.info("[saveLead] Relay dispatch ok:", payload.leadType, body);
}

export async function saveLead(input: SaveLeadInput): Promise<Lead> {
  const lead: Lead = {
    ...input.contact,
    valuation: input.valuation,
    price: input.price,
    leadType: input.leadType,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Lead[];
    existing.push(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  try {
    await sendLeadToRelay({
      contact: input.contact,
      valuation: input.valuation,
      price: input.price,
      leadType: input.leadType,
      createdAt: lead.createdAt,
    });
  } catch (error) {
    console.error("[saveLead] Failed to send lead via relay:", error);
  }

  return lead;
}
