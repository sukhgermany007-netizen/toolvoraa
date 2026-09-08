import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string) {
  try {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Cashfree webhook headers
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    if (!signature || !timestamp) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Cashfree webhook signature headers.",
        },
        { status: 400 }
      );
    }

    // 2. IMPORTANT: read RAW body before JSON parsing
    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json(
        {
          success: false,
          error: "Webhook body is empty.",
        },
        { status: 400 }
      );
    }

    // 3. Cashfree secret
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY;

    if (!cashfreeSecret) {
      console.error("CASHFREE_SECRET_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    // 4. Verify Cashfree webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", cashfreeSecret)
      .update(timestamp + rawBody)
      .digest("base64");

    if (!safeEqual(expectedSignature, signature)) {
      console.error("Invalid Cashfree webhook signature.");

      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature.",
        },
        { status: 401 }
      );
    }

    // 5. Parse JSON only AFTER signature verification
    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload.",
        },
        { status: 400 }
      );
    }

    console.log(
      "=== CASHFREE SUBSCRIPTION WEBHOOK ===",
      JSON.stringify(payload, null, 2)
    );

    const eventType = String(
      payload?.type ??
        payload?.event_type ??
        payload?.event ??
        ""
    ).toUpperCase();

    // Cashfree subscription object may be nested under data.subscription
    // depending on webhook event/version.
    const subscription =
      payload?.data?.subscription ??
      payload?.data ??
      payload?.subscription ??
      {};

    const subscriptionId = String(
      subscription?.subscription_id ??
        payload?.data?.subscription_id ??
        ""
    );

    const subscriptionStatus = String(
      subscription?.subscription_status ??
        payload?.data?.subscription_status ??
        ""
    ).toUpperCase();

    const userId =
      subscription?.subscription_tags?.toolvoraa_user_id ??
      payload?.data?.subscription_tags?.toolvoraa_user_id ??
      null;

    console.log("Cashfree event type:", eventType);
    console.log("Subscription ID:", subscriptionId);
    console.log("Subscription status:", subscriptionStatus);
    console.log("ToolVoraa user ID:", userId);

    // 6. Ignore webhook events that do not identify our user
    if (!userId) {
      console.log(
        "Webhook acknowledged, but no ToolVoraa user ID was present."
      );

      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    // 7. Supabase Admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase server credentials are missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Supabase server configuration is missing.",
        },
        { status: 500 }
      );
    }

    const admin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 8. Subscription became ACTIVE → Pro
    if (subscriptionStatus === "ACTIVE") {
      const { error } = await admin
        .from("profiles")
        .update({
          plan: "pro",
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to activate Pro:", error);

        return NextResponse.json(
          {
            success: false,
            error: "Unable to activate Pro.",
          },
          { status: 500 }
        );
      }

      console.log("ToolVoraa plan updated to PRO:", userId);

      return NextResponse.json({
        success: true,
        plan: "pro",
        subscriptionId,
      });
    }

    // 9. Terminal/inactive subscription statuses → Free
    const downgradeStatuses = new Set([
      "CANCELLED",
      "CUSTOMER_CANCELLED",
      "EXPIRED",
      "COMPLETED",
      "CARD_EXPIRED",
      "TERMINATED",
    ]);

    if (downgradeStatuses.has(subscriptionStatus)) {
      const { error } = await admin
        .from("profiles")
        .update({
          plan: "free",
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to downgrade user:", error);

        return NextResponse.json(
          {
            success: false,
            error: "Unable to update subscription plan.",
          },
          { status: 500 }
        );
      }

      console.log("ToolVoraa plan updated to FREE:", userId);

      return NextResponse.json({
        success: true,
        plan: "free",
        subscriptionId,
      });
    }

    // 10. Other events/statuses are acknowledged but ignored
    console.log(
      "Webhook acknowledged with no plan change:",
      eventType,
      subscriptionStatus
    );

    return NextResponse.json({
      success: true,
      ignored: true,
      subscriptionId,
      subscriptionStatus,
    });
  } catch (error) {
    console.error("Cashfree webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}