import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
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
          error: "Please login before verifying the subscription.",
        },
        { status: 401 }
      );
    }

    // 2. Read subscription ID from frontend
    const body = await request.json().catch(() => ({}));
    const subscriptionId = String(body?.subscriptionId || "").trim();

    if (!subscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription ID is required.",
        },
        { status: 400 }
      );
    }

    // 3. Basic protection: only accept ToolVoraa subscription IDs
    if (!subscriptionId.startsWith("toolvoraa_pro_")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ToolVoraa subscription ID.",
        },
        { status: 400 }
      );
    }

    // 4. Cashfree Sandbox credentials
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

    // 5. Fetch subscription DIRECTLY from Cashfree
    const cashfreeResponse = await fetch(
      `https://sandbox.cashfree.com/pg/subscriptions/${encodeURIComponent(
        subscriptionId
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-version": "2025-01-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
        },
        cache: "no-store",
      }
    );

    const subscription = await cashfreeResponse
      .json()
      .catch(() => null);

    if (!cashfreeResponse.ok || !subscription) {
      console.error(
        "Cashfree subscription verification failed:",
        subscription
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify Cashfree subscription.",
          details: subscription,
        },
        { status: 400 }
      );
    }

    // 6. Verify returned subscription ID
    const returnedSubscriptionId = String(
      subscription?.subscription_id || ""
    );

    if (returnedSubscriptionId !== subscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Cashfree subscription ID mismatch.",
        },
        { status: 403 }
      );
    }

    // 7. Verify this subscription belongs to current ToolVoraa user
    //
    // We stored toolvoraa_user_id in subscription_tags
    // while creating the subscription.
    const taggedUserId =
      subscription?.subscription_tags?.toolvoraa_user_id;

    if (!taggedUserId || taggedUserId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "This subscription does not belong to your account.",
        },
        { status: 403 }
      );
    }

    // 8. Extra customer-email ownership check
    const cashfreeEmail =
      subscription?.customer_details?.customer_email;

    if (
      user.email &&
      cashfreeEmail &&
      cashfreeEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription customer does not match logged-in user.",
        },
        { status: 403 }
      );
    }

    // 9. Read subscription + authorization status
    const subscriptionStatus = String(
      subscription?.subscription_status || ""
    ).toUpperCase();
    console.log("=== CASHFREE SUBSCRIPTION DEBUG ===");
console.log("subscription_id:", subscription?.subscription_id);
console.log("subscription_status:", subscription?.subscription_status);
console.log("authorization_details:", subscription?.authorization_details);
console.log("authorisation_details:", subscription?.authorisation_details);
console.log("subscription_tags:", subscription?.subscription_tags);
console.log("customer_details:", subscription?.customer_details);
console.log("FULL SUBSCRIPTION:", JSON.stringify(subscription, null, 2));

    // Cashfree documentation/current responses use
    // authorization_details.
    // Fallback supports older spelling as well.
    const authorizationDetails =
      subscription?.authorization_details ??
      subscription?.authorisation_details ??
      {};

    const authorizationStatus = String(
      authorizationDetails?.authorization_status || ""
    ).toUpperCase();

    // 10. Authorization MUST be successful.
    //
    // Do not activate Pro merely because checkout modal closed.
    if (
  authorizationStatus !== "SUCCESS" &&
  subscriptionStatus !== "ACTIVE"
) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          subscriptionId,
          subscriptionStatus:
            subscriptionStatus || "UNKNOWN",
          authorizationStatus:
            authorizationStatus || "UNKNOWN",
          error:
            authorizationStatus === "PENDING" ||
            authorizationStatus === "INITIALIZED"
              ? "Subscription authorization is still pending."
              : "Subscription authorization was not successful.",
        },
        { status: 400 }
      );
    }

    // 11. Supabase Admin credentials
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase server credentials are missing.",
        },
        { status: 500 }
      );
    }

    // Service-role key remains server-side only
    const admin = createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 12. Activate Pro for verified subscription owner
    const {
      data: updatedProfile,
      error: profileError,
    } = await admin
      .from("profiles")
      .update({
        plan: "pro",
      })
      .eq("id", user.id)
      .select("id, plan")
      .single();

    if (profileError) {
      console.error(
        "ToolVoraa Pro profile update failed:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Subscription verified, but Pro activation failed.",
        },
        { status: 500 }
      );
    }

    // 13. Success
    return NextResponse.json({
      success: true,
      verified: true,
      plan: updatedProfile.plan,
      subscriptionId,
      subscriptionStatus,
      authorizationStatus,
      cfSubscriptionId:
        subscription?.cf_subscription_id ?? null,
      message: "ToolVoraa Pro activated successfully.",
    });
  } catch (error) {
    console.error(
      "Cashfree verify-subscription error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying the subscription.",
      },
      { status: 500 }
    );
  }
}