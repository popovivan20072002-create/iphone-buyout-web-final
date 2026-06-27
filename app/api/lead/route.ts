import { NextResponse } from "next/server";
import { formatLeadMessage } from "@/lib/format-lead-message";
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

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!token || !chatId) {
      console.error(
        "[api/lead] TELEGRAM env vars missing:",
        !token ? "TELEGRAM_BOT_TOKEN empty" : "TELEGRAM_BOT_TOKEN set",
        !chatId ? "TELEGRAM_CHAT_ID empty" : "TELEGRAM_CHAT_ID set",
      );
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

    console.info("[api/lead] Sending to Telegram:", {
      leadType: body.leadType,
      chatId,
      textLength: text.length,
    });

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      },
    );

    const rawTelegramBody = await telegramResponse.text();
    let telegramBody: unknown;

    try {
      telegramBody = JSON.parse(rawTelegramBody) as unknown;
    } catch {
      telegramBody = { ok: false, description: rawTelegramBody };
    }

    console.info("[api/lead] Telegram response:", {
      status: telegramResponse.status,
      ok: telegramResponse.ok,
      body: telegramBody,
    });

    if (!telegramResponse.ok) {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/lead] Unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
