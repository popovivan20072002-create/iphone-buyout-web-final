import { NextResponse } from "next/server";
import { formatLeadMessage, getAlbatoWebhookUrl } from "@/lib/format-lead-message";
import type { SaveLeadInput } from "@/lib/save-lead";
import type { LeadType } from "@/lib/types";

function isLeadType(value: unknown): value is LeadType {
  return value === "unqualified" || value === "qualified";
}

function isValidLeadInput(
  body: unknown,
): body is SaveLeadInput & { createdAt?: string } {
  if (!body || typeof body !== "object") return false;

  const data = body as Record<string, unknown>;

  return (
    typeof data.price === "number" &&
    isLeadType(data.leadType) &&
    data.contact !== null &&
    typeof data.contact === "object" &&
    typeof (data.contact as Record<string, unknown>).phone === "string" &&
    data.valuation !== null &&
    typeof data.valuation === "object" &&
    typeof (data.valuation as Record<string, unknown>).model === "string"
  );
}

export async function POST(request: Request) {
  console.info("[api/lead] POST received");

  try {
    const body: unknown = await request.json();

    if (!isValidLeadInput(body)) {
      console.error("[api/lead] Invalid payload:", body);
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const albatoUrl = getAlbatoWebhookUrl();

    if (!albatoUrl) {
      console.error("[api/lead] Albato env var missing");
      return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 500 });
    }

    const createdAt =
      typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString();

    const text = formatLeadMessage({
      contact: body.contact,
      valuation: body.valuation,
      price: body.price,
      leadType: body.leadType,
      createdAt,
    });

    console.info("[api/lead] Sending to Albato:", {
      leadType: body.leadType,
      textLength: text.length,
    });

    const albatoResponse = await fetch(albatoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const rawAlbatoBody = await albatoResponse.text();
    let albatoBody: unknown;

    try {
      albatoBody = JSON.parse(rawAlbatoBody) as unknown;
    } catch {
      albatoBody = { raw: rawAlbatoBody };
    }

    console.info("[api/lead] Albato response:", {
      status: albatoResponse.status,
      ok: albatoResponse.ok,
      body: albatoBody,
    });

    if (!albatoResponse.ok) {
      console.error("[api/lead] Albato delivery failed:", albatoBody);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/lead] Unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
