import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. Require logged-in ToolVoraa user
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to upgrade.",
        },
        { status: 401 }
      );
    }

    // 2. Cashfree credentials
    const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Cashfree credentials are missing.",
        },
        { status: 500 }
      );
    }

    // 3. Create unique order bound to this logged-in user
    const uniqueId = Date.now().toString();

    const orderId = `toolvoraa_pro_${user.id.slice(0, 8)}_${Date.now()}`;

    const response = await fetch(
      "https://sandbox.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2025-01-01",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: 299,
          order_currency: "INR",

          customer_details: {
            customer_id: user.id,
            customer_email: user.email ?? undefined,
            customer_phone: "9999999999",
          },

          order_meta: {
            return_url:
              "http://localhost:3000/pricing?order_id={order_id}",
          },

          order_note: "ToolVoraa Pro Plan - Sandbox Test",

          order_tags: {
            user_id: user.id,
            plan: "pro",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree create order error:", data);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create Cashfree order.",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree order error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating payment order.",
      },
      { status: 500 }
    );
  }
}