import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const subscriptionId =
    formData.get("subscriptionId") ??
    formData.get("subscription_id");

  const url = new URL(
    "https://www.toolvoraa.com/pricing?subscription_return=1"
  );

  if (subscriptionId) {
    url.searchParams.set(
      "subscription_id",
      String(subscriptionId)
    );
  }

  return NextResponse.redirect(url, 303);
}