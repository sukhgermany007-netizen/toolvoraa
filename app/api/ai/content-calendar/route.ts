import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";

const TOOL_NAME = "content-calendar";
const DAILY_PRO_LIMIT = 30;

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & {
  toolVoraaContentCalendarRate?: Map<string, RateEntry>;
};
const rateStore =
  globalStore.toolVoraaContentCalendarRate ?? new Map<string, RateEntry>();

if (!globalStore.toolVoraaContentCalendarRate) {
  globalStore.toolVoraaContentCalendarRate = rateStore;
}

function getIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRate(ip: string) {
  const now = Date.now();
  const max = 8;
  const windowMs = 10 * 60 * 1000;
  const current = rateStore.get(ip);

  if (!current || now >= current.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= max) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateStore.set(ip, current);
  return { allowed: true, retryAfter: 0 };
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const rate = checkRate(getIp(request));
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, code: "AUTH_REQUIRED", error: "Please log in to use this Pro tool." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.plan !== "pro") {
      return NextResponse.json(
        { success: false, code: "PRO_REQUIRED", error: "This is a ToolVoraa Pro tool. Please upgrade to Pro to continue." },
        { status: 403 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("id, request_count")
      .eq("user_id", user.id)
      .eq("tool_name", TOOL_NAME)
      .eq("usage_date", today)
      .maybeSingle();

    const used = typeof usage?.request_count === "number" ? usage.request_count : 0;

    if (used >= DAILY_PRO_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          code: "DAILY_LIMIT_REACHED",
          error: "You have reached today's Pro limit for this tool.",
          dailyUsed: used,
          dailyLimit: DAILY_PRO_LIMIT,
          dailyRemaining: 0,
        },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    }

    const business = clean(body.business, 1600);
    const audience = clean(body.audience, 400);
    const pillars = clean(body.pillars, 1000);
    const campaign = clean(body.campaign, 700);
    const platforms = Array.isArray(body.platforms)
      ? body.platforms.filter((item): item is string => typeof item === "string").slice(0, 6)
      : [];
    const language = clean(body.language, 40) || "English";
    const duration = clean(body.duration, 30) || "14 Days";
    const frequency = clean(body.frequency, 40) || "5 posts per week";
    const includeVideoIdeas = body.includeVideoIdeas !== false;
    const includeCta = body.includeCta !== false;

    if (business.length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid business, brand or content niche." },
        { status: 400 }
      );
    }

    if (!platforms.length) {
      return NextResponse.json(
        { success: false, error: "Please select at least one platform." },
        { status: 400 }
      );
    }

    const allowedDurations = ["7 Days", "14 Days", "30 Days"];
    const safeDuration = allowedDurations.includes(duration) ? duration : "14 Days";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey?.trim()) {
      return NextResponse.json(
        { success: false, error: "AI service is temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const prompt = `
Create a practical social media content calendar.

Business / Brand / Niche:
${business}

Target audience:
${audience || "General relevant audience"}

Content pillars:
${pillars || "Derive sensible pillars only from the supplied business/niche"}

Current campaign / offer / priority:
${campaign || "No specific campaign provided"}

Platforms:
${platforms.join(", ")}

Calendar duration:
${safeDuration}

Posting frequency:
${frequency}

Language:
${language}

Include video/reel ideas:
${includeVideoIdeas ? "Yes" : "No"}

Include CTA suggestions:
${includeCta ? "Yes" : "No"}

Requirements:
- Build a balanced content calendar for the full requested duration.
- Do not invent factual claims, discounts, launches, events, testimonials or business achievements.
- Use a realistic mix of educational, engagement, trust-building, promotional and community content.
- Adapt ideas to each selected platform.
- Avoid repetitive topics.
- If a campaign is provided, weave it in naturally without making every post promotional.
- Keep ideas specific enough that a creator can use them immediately.
- Return a markdown table only.
- Use these exact columns:
Day | Platform | Content Type | Topic / Hook | CTA | Notes
- For Day, use Day 1, Day 2, etc. Do not invent actual calendar dates.
- Keep each table cell concise.
- Respect the requested language.
`;

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const ai = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are ToolVoraa AI Content Calendar Generator. Create useful, non-repetitive, practical social media calendars without fabricating business facts.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.72,
    });

    const text = ai.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "The AI returned no content calendar. Please try again." },
        { status: 500 }
      );
    }

    const nextCount = used + 1;

    if (usage?.id) {
      const { error } = await supabase
        .from("ai_usage")
        .update({
          request_count: nextCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", usage.id)
        .eq("user_id", user.id);

      if (error) console.error("Content calendar usage update failed:", error);
    } else {
      const { error } = await supabase.from("ai_usage").insert({
        user_id: user.id,
        tool_name: TOOL_NAME,
        usage_date: today,
        request_count: 1,
      });

      if (error) console.error("Content calendar usage insert failed:", error);
    }

    return NextResponse.json({
      success: true,
      text,
      plan: "pro",
      dailyUsed: nextCount,
      dailyLimit: DAILY_PRO_LIMIT,
      dailyRemaining: Math.max(DAILY_PRO_LIMIT - nextCount, 0),
    });
  } catch (error) {
    console.error("Content calendar generator error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to generate a content calendar right now. Please try again." },
      { status: 500 }
    );
  }
}
