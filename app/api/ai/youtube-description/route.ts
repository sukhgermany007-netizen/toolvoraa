import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";

const DAILY_PRO_LIMIT = 50;
const TOOL_NAME = "youtube-description";

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & {
  toolVoraaYouTubeDescriptionRate?: Map<string, RateEntry>;
};
const rateStore =
  globalStore.toolVoraaYouTubeDescriptionRate ?? new Map<string, RateEntry>();
if (!globalStore.toolVoraaYouTubeDescriptionRate) {
  globalStore.toolVoraaYouTubeDescriptionRate = rateStore;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 10;
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
    const limiter = rateLimit(clientIp(request));
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: "RATE_LIMITED",
          error: "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429, headers: { "Retry-After": String(limiter.retryAfter) } }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          code: "AUTH_REQUIRED",
          error: "Please log in to use this Pro tool.",
        },
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
        {
          success: false,
          code: "PRO_REQUIRED",
          error: "This is a ToolVoraa Pro tool. Please upgrade to Pro to continue.",
        },
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
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    const topic = clean(body.topic, 1600);
    const keywords = clean(body.keywords, 400);
    const audience = clean(body.audience, 250);
    const channelName = clean(body.channelName, 120);
    const callToAction = clean(body.callToAction, 300);
    const links = clean(body.links, 800);
    const videoType = clean(body.videoType, 60) || "General Video";
    const tone = clean(body.tone, 60) || "Professional";
    const language = clean(body.language, 40) || "English";
    const length = clean(body.length, 40) || "Standard";
    const includeHashtags = body.includeHashtags !== false;
    const includeChapters = body.includeChapters === true;

    if (topic.length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid video topic." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service is temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    const prompt = `
Create a complete YouTube description using the details below.

Video topic:
${topic}

Keywords:
${keywords || "No specific keywords provided"}

Target audience:
${audience || "General YouTube audience"}

Channel name:
${channelName || "Not provided"}

Video type:
${videoType}

Tone:
${tone}

Language:
${language}

Description length:
${length}

Call to action:
${callToAction || "Use a natural, non-pushy call to action if appropriate"}

Links to include:
${links || "None provided"}

Include hashtags:
${includeHashtags ? "Yes" : "No"}

Include chapter placeholders:
${includeChapters ? "Yes" : "No"}

Requirements:
- Write a natural, professional YouTube description that accurately represents the video.
- Put the strongest summary in the first 2-3 lines.
- Use supplied keywords naturally; never keyword-stuff.
- Use readable paragraphs and spacing.
- Add a concise CTA only when appropriate.
- Never invent links, sponsors, claims, statistics, timestamps or contact details.
- If links are supplied, include them exactly as provided.
- If chapter placeholders are requested, add a clearly labeled template with placeholder timestamps only.
- If hashtags are requested, add 3-8 relevant hashtags at the end.
- Respect the requested language.
- Return only the finished description, ready to paste into YouTube.
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
            "You are ToolVoraa AI YouTube Description Generator. Produce accurate, useful, natural-sounding YouTube descriptions. Never fabricate facts or links.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
    });

    const text = ai.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { success: false, error: "The AI returned no description. Please try again." },
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
      if (error) console.error("YouTube description usage update failed:", error);
    } else {
      const { error } = await supabase.from("ai_usage").insert({
        user_id: user.id,
        tool_name: TOOL_NAME,
        usage_date: today,
        request_count: 1,
      });
      if (error) console.error("YouTube description usage insert failed:", error);
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
    console.error("YouTube description generator error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate a description right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
