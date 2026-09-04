import { createClient } from "@/app/utils/supabase/server";

export type AIToolName =
  | "email-writer"
  | "reply-generator"
  | "product-description"
  | "youtube-title"
  | "review-reply"
  | "complaint-letter"
  | "study-notes"
  | "seo-meta"
  | "resume-analyzer"
  | "pdf-summarizer";

export type UserPlan = "free" | "pro";

type UsageStatus = {
  allowed: boolean;
  authenticated: boolean;
  plan: UserPlan;
  used: number;
  limit: number;
  remaining: number;
  reason?: "AUTH_REQUIRED" | "LIMIT_REACHED";
};

/*
  Free daily limits
*/
const FREE_DAILY_LIMITS: Record<AIToolName, number> = {
  "email-writer": 5,
  "reply-generator": 5,
  "product-description": 5,
  "youtube-title": 5,
  "review-reply": 5,
  "complaint-letter": 3,
  "study-notes": 3,
  "seo-meta": 5,
  "resume-analyzer": 2,
  "pdf-summarizer": 2,
};

/*
  Pro limits.
  फिलहाल Free limit का 10x रखा है.
  बाद में pricing/final plan के हिसाब से change कर सकते हैं.
*/
const PRO_DAILY_LIMITS: Record<AIToolName, number> = {
  "email-writer": 50,
  "reply-generator": 50,
  "product-description": 50,
  "youtube-title": 50,
  "review-reply": 50,
  "complaint-letter": 30,
  "study-notes": 30,
  "seo-meta": 50,
  "resume-analyzer": 20,
  "pdf-summarizer": 20,
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getLimit(toolName: AIToolName, plan: UserPlan) {
  return plan === "pro"
    ? PRO_DAILY_LIMITS[toolName]
    : FREE_DAILY_LIMITS[toolName];
}

/*
  Check whether the current user is allowed
  to use a particular AI tool.

  IMPORTANT:
  This function does NOT increase usage.
*/
export async function checkAIUsage(
  toolName: AIToolName,
): Promise<UsageStatus> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      allowed: false,
      authenticated: false,
      plan: "free",
      used: 0,
      limit: FREE_DAILY_LIMITS[toolName],
      remaining: 0,
      reason: "AUTH_REQUIRED",
    };
  }

  /*
    Read user's plan.
    If profile is missing for some reason,
    safely treat the user as Free.
  */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const plan: UserPlan =
    profile?.plan === "pro" ? "pro" : "free";

  const limit = getLimit(toolName, plan);
  const today = getTodayDate();

  const { data: usage } = await supabase
    .from("ai_usage")
    .select("request_count")
    .eq("user_id", user.id)
    .eq("tool_name", toolName)
    .eq("usage_date", today)
    .maybeSingle();

  const used =
    typeof usage?.request_count === "number"
      ? usage.request_count
      : 0;

  const remaining = Math.max(limit - used, 0);

  if (used >= limit) {
    return {
      allowed: false,
      authenticated: true,
      plan,
      used,
      limit,
      remaining: 0,
      reason: "LIMIT_REACHED",
    };
  }

  return {
    allowed: true,
    authenticated: true,
    plan,
    used,
    limit,
    remaining,
  };
}

/*
  Record one successful AI request.

  Call this ONLY after the AI generation
  has completed successfully.

  This prevents failed AI requests from
  consuming the user's daily allowance.
*/
export async function recordAIUsage(
  toolName: AIToolName,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      reason: "AUTH_REQUIRED" as const,
    };
  }

  const today = getTodayDate();

  const { data: existingUsage, error: readError } =
    await supabase
      .from("ai_usage")
      .select("id, request_count")
      .eq("user_id", user.id)
      .eq("tool_name", toolName)
      .eq("usage_date", today)
      .maybeSingle();

  if (readError) {
    console.error("AI usage read error:", readError);

    return {
      success: false,
      reason: "DATABASE_ERROR" as const,
    };
  }

  if (existingUsage) {
    const nextCount =
      (existingUsage.request_count ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("ai_usage")
      .update({
        request_count: nextCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingUsage.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(
        "AI usage update error:",
        updateError,
      );

      return {
        success: false,
        reason: "DATABASE_ERROR" as const,
      };
    }

    return {
      success: true,
      used: nextCount,
    };
  }

  const { error: insertError } = await supabase
    .from("ai_usage")
    .insert({
      user_id: user.id,
      tool_name: toolName,
      usage_date: today,
      request_count: 1,
    });

  if (insertError) {
    console.error(
      "AI usage insert error:",
      insertError,
    );

    return {
      success: false,
      reason: "DATABASE_ERROR" as const,
    };
  }

  return {
    success: true,
    used: 1,
  };
}

/*
  Utility function for UI/API responses.
*/
export async function getAIUsageInfo(
  toolName: AIToolName,
) {
  const status = await checkAIUsage(toolName);

  return {
    authenticated: status.authenticated,
    plan: status.plan,
    used: status.used,
    limit: status.limit,
    remaining: status.remaining,
    allowed: status.allowed,
  };
}