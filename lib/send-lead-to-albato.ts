import { formatLeadMessage, getAlbatoWebhookUrl } from "./format-lead-message";
import type { LeadFormData, LeadType, ValuationFormData } from "./types";

export interface SendLeadToAlbatoInput {
  contact: LeadFormData;
  valuation: ValuationFormData;
  price: number;
  leadType: LeadType;
  createdAt?: string;
  clientLabel?: string;
}

export interface SendLeadToAlbatoResult {
  ok: boolean;
  status?: number;
  body?: unknown;
}

export async function sendLeadToAlbato(
  input: SendLeadToAlbatoInput,
): Promise<SendLeadToAlbatoResult> {
  const albatoUrl = getAlbatoWebhookUrl();

  if (!albatoUrl) {
    console.error("[sendLeadToAlbato] Albato env var missing");
    return { ok: false };
  }

  const createdAt = input.createdAt ?? new Date().toISOString();
  const text = formatLeadMessage({
    contact: input.contact,
    valuation: input.valuation,
    price: input.price,
    leadType: input.leadType,
    createdAt,
    clientLabel: input.clientLabel,
  });

  const albatoResponse = await fetch(albatoUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const rawBody = await albatoResponse.text();
  let body: unknown;

  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    body = { raw: rawBody };
  }

  if (!albatoResponse.ok) {
    console.error("[sendLeadToAlbato] Delivery failed:", {
      status: albatoResponse.status,
      body,
    });
    return { ok: false, status: albatoResponse.status, body };
  }

  return { ok: true, status: albatoResponse.status, body };
}
