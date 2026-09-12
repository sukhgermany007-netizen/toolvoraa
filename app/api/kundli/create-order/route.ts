import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_PRICE = 299;
const PRODUCT_ID = "kundli_beginner_bundle";
const API_VERSION = "2025-01-01";

function cashfreeConfig() {
  const clientId =
    process.env.CASHFREE_APP_ID ?? process.env.CASHFREE_CLIENT_ID;
  const clientSecret =
    process.env.CASHFREE_SECRET_KEY ?? process.env.CASHFREE_CLIENT_SECRET;
  const isProduction = process.env.CASHFREE_ENV === "production";

  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials are missing.");
  }

  return {
    clientId,
    clientSecret,
    mode: isProduction ? "production" : "sandbox",
    baseUrl: isProduction
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg",
  } as const;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = cleanText(body?.name, 80);
    const email = cleanText(body?.email, 120).toLowerCase();
    const phoneDigits = cleanText(body?.phone, 20).replace(/\D/g, "");

    if (!name || !email || !phoneDigits) {
      return NextResponse.json(
        { success: false, error: "Name, email and phone are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid mobile number." },
        { status: 400 }
      );
    }

    const { clientId, clientSecret, mode, baseUrl } = cashfreeConfig();
    const orderId = `kundli_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const origin = new URL(request.url).origin;

    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": API_VERSION,
        "x-idempotency-key": randomUUID(),
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: PRODUCT_PRICE,
        order_currency: "INR",
        customer_details: {
          customer_id: `kundli_${randomUUID().slice(0, 16)}`,
          customer_name: name,
          customer_email: email,
          customer_phone: phoneDigits.slice(-10),
        },
        order_meta: {
          return_url: `${origin}/kundli-book/success?order_id={order_id}`,
        },
        order_note: "Kundli Padhna Sikhen - Beginner Bundle",
        order_tags: {
          product_id: PRODUCT_ID,
          delivery: "digital_download",
        },
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Kundli Cashfree create order error:", data);
      return NextResponse.json(
        { success: false, error: "Unable to create payment order." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      mode,
    });
  } catch (error) {
    console.error("Kundli create order error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while starting payment." },
      { status: 500 }
    );
  }
}
