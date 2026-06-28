import { NextResponse } from "next/server";
import { sendLeadToAlbato } from "@/lib/send-lead-to-albato";
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

    const createdAt =
      typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString();

    console.info("[api/lead] Sending to Albato:", {
      leadType: body.leadType,
    });

    const result = await sendLeadToAlbato({
      contact: body.contact,
      valuation: body.valuation,
      price: body.price,
      leadType: body.leadType,
      createdAt,
    });

    console.info("[api/lead] Albato response:", result);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/lead] Unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
