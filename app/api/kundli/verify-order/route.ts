import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_PRICE = 299;
const API_VERSION = "2025-01-01";

function config() {
  const clientId =
    process.env.CASHFREE_APP_ID ?? process.env.CASHFREE_CLIENT_ID;
  const clientSecret =
    process.env.CASHFREE_SECRET_KEY ?? process.env.CASHFREE_CLIENT_SECRET;
  const baseUrl =
    process.env.CASHFREE_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

  if (!clientId || !clientSecret) throw new Error("Cashfree credentials missing.");
  return { clientId, clientSecret, baseUrl };
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id")?.trim();

  if (!orderId || !orderId.startsWith("kundli_")) {
    return NextResponse.json(
      { success: false, paid: false, error: "Invalid Kundli order." },
      { status: 400 }
    );
  }

  try {
    const { clientId, clientSecret, baseUrl } = config();
    const response = await fetch(
      `${baseUrl}/orders/${encodeURIComponent(orderId)}`,
      {
        headers: {
          Accept: "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": API_VERSION,
        },
        cache: "no-store",
      }
    );

    const order = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, paid: false, error: "Unable to verify payment." },
        { status: response.status }
      );
    }

    const paid =
      order?.order_status === "PAID" &&
      Number(order?.order_amount) === PRODUCT_PRICE &&
      order?.order_currency === "INR" &&
      order?.order_tags?.product_id === "kundli_beginner_bundle";

    return NextResponse.json({
      success: true,
      paid,
      orderId,
      status: order?.order_status ?? "UNKNOWN",
      customerName: order?.customer_details?.customer_name ?? "",
      customerEmail: order?.customer_details?.customer_email ?? "",
    });
  } catch (error) {
    console.error("Kundli verify order error:", error);
    return NextResponse.json(
      { success: false, paid: false, error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
