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

    // 2. Read RAW body before JSON parsing
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

    // 5. Parse JSON after signature verification
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

    const eventType = String(
      payload?.type ??
        payload?.event_type ??
        payload?.event ??
        ""
    ).toUpperCase();

    const subscription =
      payload?.data?.subscription_details ??
      payload?.data?.subscription ??
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

    // Cashfree monthly next scheduled debit date
    const currentPeriodEnd =
      subscription?.next_schedule_date ??
      payload?.data?.next_schedule_date ??
      null;

    // Log only operational metadata. Do not write the full webhook payload,
    // customer details, mandate/authorization data, or payment identifiers.
    console.info("Cashfree subscription webhook", {
      eventType: eventType || "UNKNOWN",
      subscriptionId: subscriptionId || "MISSING",
      subscriptionStatus: subscriptionStatus || "UNKNOWN",
      hasToolVoraaUserId: Boolean(userId),
    });

    // 6. Must identify ToolVoraa user
    if (!userId) {
      console.info(
        "Cashfree webhook acknowledged without ToolVoraa user ID"
      );

      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    if (!subscriptionId) {
      console.info(
        "Cashfree webhook acknowledged without subscription ID"
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

    // 8. Save/update subscription record
    const { data: existingRows, error: lookupError } = await admin
      .from("subscriptions")
      .select("id")
      .eq("subscription_id", subscriptionId)
      .order("id", { ascending: false })
      .limit(1);

    if (lookupError) {
      console.error("Unable to look up subscription record", {
        subscriptionId,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Unable to read subscription record.",
        },
        { status: 500 }
      );
    }

    const existingId = existingRows?.[0]?.id ?? null;

    const subscriptionRecord = {
      user_id: userId,
      subscription_id: subscriptionId,
      status: subscriptionStatus,
      plan: "pro",
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    };

    if (existingId) {
      const { error: updateSubscriptionError } = await admin
        .from("subscriptions")
        .update(subscriptionRecord)
        .eq("id", existingId);

      if (updateSubscriptionError) {
        console.error("Unable to update subscription record", {
          subscriptionId,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unable to update subscription record.",
          },
          { status: 500 }
        );
      }
    } else {
      const { error: insertSubscriptionError } = await admin
        .from("subscriptions")
        .insert(subscriptionRecord);

      if (insertSubscriptionError) {
        console.error("Unable to insert subscription record", {
          subscriptionId,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unable to save subscription record.",
          },
          { status: 500 }
        );
      }
    }

    console.info("Subscription record saved", {
      subscriptionId,
      subscriptionStatus,
    });

    // 9. ACTIVE subscription → Pro
    if (subscriptionStatus === "ACTIVE") {
      const { error: profileError } = await admin
        .from("profiles")
        .update({
          plan: "pro",
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Failed to activate Pro", {
          userId,
          subscriptionId,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unable to activate Pro.",
          },
          { status: 500 }
        );
      }

      console.info("ToolVoraa plan updated to PRO", {
        userId,
        subscriptionId,
      });

      return NextResponse.json({
        success: true,
        plan: "pro",
        subscriptionId,
        subscriptionStatus,
      });
    }

    // 10. Terminal/inactive statuses
    const downgradeStatuses = new Set([
      "CANCELLED",
      "CUSTOMER_CANCELLED",
      "EXPIRED",
      "COMPLETED",
      "CARD_EXPIRED",
      "TERMINATED",
    ]);

    if (downgradeStatuses.has(subscriptionStatus)) {
      // Check whether this user still has ANOTHER active subscription
      const { data: activeSubscriptions, error: activeLookupError } =
        await admin
          .from("subscriptions")
          .select("id, subscription_id")
          .eq("user_id", userId)
          .eq("status", "ACTIVE")
          .neq("subscription_id", subscriptionId)
          .limit(1);

      if (activeLookupError) {
        console.error("Unable to check active subscriptions", {
          userId,
          subscriptionId,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unable to verify active subscriptions.",
          },
          { status: 500 }
        );
      }

      // Another active subscription exists → keep Pro
      if (activeSubscriptions && activeSubscriptions.length > 0) {
        console.info(
          "User still has another ACTIVE subscription; keeping PRO",
          { userId, subscriptionId }
        );

        return NextResponse.json({
          success: true,
          plan: "pro",
          subscriptionId,
          subscriptionStatus,
          anotherActiveSubscription: true,
        });
      }

      // No active subscriptions remain → Free
      const { error: profileError } = await admin
        .from("profiles")
        .update({
          plan: "free",
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Failed to downgrade user", {
          userId,
          subscriptionId,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unable to update subscription plan.",
          },
          { status: 500 }
        );
      }

      console.info("ToolVoraa plan updated to FREE", {
        userId,
        subscriptionId,
      });

      return NextResponse.json({
        success: true,
        plan: "free",
        subscriptionId,
        subscriptionStatus,
      });
    }

    // 11. Other statuses are stored but do not change the plan
    console.info("Cashfree webhook stored with no plan change", {
      eventType,
      subscriptionId,
      subscriptionStatus,
    });

    return NextResponse.json({
      success: true,
      ignored: true,
      subscriptionId,
      subscriptionStatus,
    });
  } catch (error) {
    console.error("Cashfree webhook error", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
