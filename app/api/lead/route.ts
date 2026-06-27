import { NextResponse } from "next/server";
import { buildBitrixLeadPayload, getBitrixWebhookUrl } from "@/lib/format-lead-message";
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

    const webhookUrl = getBitrixWebhookUrl();

    if (!webhookUrl) {
      console.error("[api/lead] BITRIX_WEBHOOK_URL missing");
      return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 500 });
    }

    const createdAt =
      typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString();

    const bitrixPayload = buildBitrixLeadPayload({
      contact: body.contact,
      valuation: body.valuation,
      price: body.price,
      leadType: body.leadType,
      createdAt,
    });

    console.info("[api/lead] Sending to Bitrix24:", {
      leadType: body.leadType,
      title: bitrixPayload.fields.TITLE,
    });

    const bitrixResponse = await fetch(`${webhookUrl}crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bitrixPayload),
    });

    const rawBitrixBody = await bitrixResponse.text();
    let bitrixBody: unknown;

    try {
      bitrixBody = JSON.parse(rawBitrixBody) as unknown;
    } catch {
      bitrixBody = { error: rawBitrixBody };
    }

    console.info("[api/lead] Bitrix24 response:", {
      status: bitrixResponse.status,
      ok: bitrixResponse.ok,
      body: bitrixBody,
    });

    if (!bitrixResponse.ok) {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 500 });
    }

    const result = bitrixBody as { result?: number; error?: string; error_description?: string };

    if (result.error || result.result === undefined) {
      console.error("[api/lead] Bitrix24 API error:", bitrixBody);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, leadId: result.result });
  } catch (error) {
    console.error("[api/lead] Unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
