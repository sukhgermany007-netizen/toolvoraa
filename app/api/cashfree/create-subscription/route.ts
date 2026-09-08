import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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
          error: "Please login before starting ToolVoraa Pro subscription.",
        },
        { status: 401 }
      );
    }

    // 2. Read customer phone from frontend
    const body = await request.json().catch(() => ({}));
    const rawPhone = String(body?.phone || "").trim();

    // Keep digits only
    const phone = rawPhone.replace(/\D/g, "").slice(-10);

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    // 3. Cashfree Sandbox credentials
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Cashfree subscription credentials are missing.",
        },
        { status: 500 }
      );
    }

    // 4. Customer identity
    const email = user.email || "";

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0] ||
      "ToolVoraa User";

    // 5. Unique subscription ID
    const subscriptionId = `toolvoraa_pro_${user.id.slice(
      0,
      8
    )}_${Date.now()}`;

    // 6. ToolVoraa ₹299/month Periodic subscription
    const subscriptionPayload = {
      subscription_id: subscriptionId,

      customer_details: {
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
      },

      plan_details: {
        plan_name: "ToolVoraa Pro Monthly",
        plan_type: "PERIODIC",
        plan_currency: "INR",
        plan_amount: 299,
        plan_max_amount: 299,
        plan_max_cycles: 120,
        plan_intervals: 1,
        plan_interval_type: "MONTH",
        plan_note: "ToolVoraa Pro monthly subscription",
      },

      authorization_details: {
        authorization_amount: 1,
        authorization_amount_refund: true,
      },

      subscription_meta: {
        return_url:
          "http://localhost:3000/pricing?subscription_return=1",
        notification_channel: ["EMAIL", "SMS"],
      },

      subscription_note: "ToolVoraa Pro Monthly Subscription",

      subscription_tags: {
        toolvoraa_user_id: user.id,
        plan: "pro",
        billing: "monthly",
      },
    };

    // 7. Create Cashfree Sandbox subscription
    const response = await fetch(
      "https://sandbox.cashfree.com/pg/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-version": "2025-01-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
        },
        body: JSON.stringify(subscriptionPayload),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Cashfree subscription creation failed:", data);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create Cashfree subscription.",
          details: data,
        },
        { status: response.status }
      );
    }

    if (!data?.subscription_session_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Cashfree did not return a subscription session ID.",
          details: data,
        },
        { status: 500 }
      );
    }

    // 8. Return only safe data to browser
    return NextResponse.json({
      success: true,
      subscriptionId: data.subscription_id || subscriptionId,
      subscriptionSessionId: data.subscription_session_id,
      subscriptionStatus: data.subscription_status || "INITIALIZED",
    });
  } catch (error) {
    console.error("Cashfree subscription error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating the subscription.",
      },
      { status: 500 }
    );
  }
}