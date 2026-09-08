import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Check logged-in ToolVoraa user
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // 2. Read Cashfree order ID
    const body = await request.json();
    const orderId = body?.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    // 3. Cashfree server credentials
    const cashfreeClientId =
      process.env.CASHFREE_APP_ID ??
      process.env.CASHFREE_CLIENT_ID;

    const cashfreeClientSecret =
      process.env.CASHFREE_SECRET_KEY ??
      process.env.CASHFREE_CLIENT_SECRET;

    if (!cashfreeClientId || !cashfreeClientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Cashfree credentials are missing.",
        },
        { status: 500 }
      );
    }

    const cashfreeHeaders = {
      "x-client-id": cashfreeClientId,
      "x-client-secret": cashfreeClientSecret,
      "x-api-version": "2025-01-01",
      "Content-Type": "application/json",
    };

    // 4. Verify order directly with Cashfree
    const orderResponse = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: cashfreeHeaders,
        cache: "no-store",
      }
    );

    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("Cashfree order verification error:", order);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify this Cashfree order.",
        },
        { status: 400 }
      );
    }

    // 5. Verify that this order belongs to current user
    const cashfreeCustomerId =
      order?.customer_details?.customer_id;

    if (
      !cashfreeCustomerId ||
      cashfreeCustomerId !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "This payment does not belong to your account.",
        },
        { status: 403 }
      );
    }

    // 6. Verify amount, currency and order status
    const orderAmount = Number(order?.order_amount);
    const orderCurrency = order?.order_currency;
    const orderStatus = order?.order_status;

    if (
      orderAmount !== 299 ||
      orderCurrency !== "INR" ||
      orderStatus !== "PAID"
    ) {
      return NextResponse.json(
        {
          success: false,
          paid: false,
          status: orderStatus ?? "UNKNOWN",
          error: "Payment is not verified as paid.",
        },
        { status: 400 }
      );
    }

    // 7. Fetch Cashfree payment attempts
    const paymentsResponse = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(
        orderId
      )}/payments`,
      {
        method: "GET",
        headers: cashfreeHeaders,
        cache: "no-store",
      }
    );

    const payments = await paymentsResponse.json();

    if (!paymentsResponse.ok) {
      console.error(
        "Cashfree payment verification error:",
        payments
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify payment transaction.",
        },
        { status: 400 }
      );
    }

    // 8. Find successful ₹299 payment
    const successfulPayment = Array.isArray(payments)
      ? payments.find(
          (payment) =>
            payment?.payment_status === "SUCCESS" &&
            Number(payment?.payment_amount) === 299
        )
      : null;

    if (!successfulPayment) {
      return NextResponse.json(
        {
          success: false,
          paid: false,
          error: "No successful ₹299 payment was found.",
        },
        { status: 400 }
      );
    }

    // 9. Supabase Admin credentials
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecretKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase server credentials are missing.",
        },
        { status: 500 }
      );
    }

    // IMPORTANT:
    // Service-role key stays server-side only.
    const admin = createAdminClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 10. Save verified payment in payments table
    //
    // cashfree_order_id has a UNIQUE index, so retrying verification
    // will update the same payment instead of creating duplicates.
    const cfPaymentId =
      successfulPayment?.cf_payment_id != null
        ? String(successfulPayment.cf_payment_id)
        : null;

    const paymentMethod =
      successfulPayment?.payment_group ??
      successfulPayment?.payment_method ??
      null;

    const paidAt =
      successfulPayment?.payment_time ??
      new Date().toISOString();

    const { error: paymentRecordError } = await admin
      .from("payments")
      .upsert(
        {
          user_id: user.id,
          cashfree_order_id: orderId,
          cashfree_payment_id: cfPaymentId,
          subscription_id: null,
          amount: orderAmount,
          status: "paid",
          currency: orderCurrency,
          payment_method:
            typeof paymentMethod === "string"
              ? paymentMethod
              : paymentMethod
              ? JSON.stringify(paymentMethod)
              : null,
          paid_at: paidAt,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "cashfree_order_id",
        }
      );

    if (paymentRecordError) {
      console.error(
        "Payment record save error:",
        paymentRecordError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verified, but payment record could not be saved.",
        },
        { status: 500 }
      );
    }

    // 11. Activate Pro only for verified paying user
    const { data: updatedProfile, error: updateError } =
      await admin
        .from("profiles")
        .update({
          plan: "pro",
        })
        .eq("id", user.id)
        .select("id, plan")
        .single();

    if (updateError) {
      console.error(
        "Supabase Pro activation error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verified and recorded, but Pro activation failed.",
        },
        { status: 500 }
      );
    }

    // 12. Success
    return NextResponse.json({
      success: true,
      paid: true,
      plan: updatedProfile.plan,
      orderId,
      cfPaymentId,
      message: "ToolVoraa Pro activated successfully.",
    });
  } catch (error) {
    console.error(
      "Verify Cashfree payment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying payment.",
      },
      { status: 500 }
    );
  }
}