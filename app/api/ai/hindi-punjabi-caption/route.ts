import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";

const TOOL_NAME = "hindi-punjabi-caption";
const DAILY_PRO_LIMIT = 50;

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & {
  toolVoraaRegionalCaptionRate?: Map<string, RateEntry>;
};
const rateStore =
  globalStore.toolVoraaRegionalCaptionRate ?? new Map<string, RateEntry>();

if (!globalStore.toolVoraaRegionalCaptionRate) {
  globalStore.toolVoraaRegionalCaptionRate = rateStore;
}

function getIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRate(ip: string) {
  const now = Date.now();
  const max = 10;
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
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    const topic = clean(body.topic, 1600);
    const audience = clean(body.audience, 350);
    const keywords = clean(body.keywords, 400);
    const cta = clean(body.cta, 300);
    const platform = clean(body.platform, 60) || "Instagram";
    const languageStyle = clean(body.languageStyle, 80) || "Hindi";
    const tone = clean(body.tone, 60) || "Natural";
    const length = clean(body.length, 40) || "Standard";
    const countRaw = typeof body.count === "number" ? body.count : Number(body.count);
    const count = [3, 5, 10].includes(countRaw) ? countRaw : 5;
    const includeEmoji = body.includeEmoji !== false;
    const includeHashtags = body.includeHashtags === true;

    if (topic.length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid caption topic." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey?.trim()) {
      return NextResponse.json(
        { success: false, error: "AI service is temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const prompt = `
Generate exactly ${count} social media caption options.

Topic / Post Details:
${topic}

Platform:
${platform}

Target Audience:
${audience || "General relevant audience"}

Keywords:
${keywords || "No specific keywords"}

Language Style:
${languageStyle}

Tone:
${tone}

Length:
${length}

Call to Action:
${cta || "Use a natural CTA only when appropriate"}

Use Emojis:
${includeEmoji ? "Yes, naturally and sparingly" : "No"}

Include Hashtags:
${includeHashtags ? "Yes, add 3-8 relevant hashtags" : "No"}

Language Rules:
- If Hindi is selected, write natural Devanagari Hindi.
- If Punjabi is selected, write natural Punjabi in Gurmukhi script.
- If Hinglish is selected, use natural Hindi-English mix in Roman script.
- If Punjabi-English Mix is selected, use natural Punjabi-English mix; keep Punjabi words understandable and conversational.
- Avoid awkward literal translation and robotic phrasing.

General Requirements:
- Make every caption meaningfully different.
- Keep captions natural, social and ready to post.
- Do not invent facts, prices, offers, results, testimonials or claims.
- Avoid misleading engagement bait.
- Use keywords naturally when useful.
- Match the selected platform, tone and length.
- Return captions separated clearly as CAPTION 1, CAPTION 2, etc.
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
            "You are ToolVoraa AI Hindi & Punjabi Caption Generator. Write natural regional-language social captions, especially fluent Hindi, Punjabi in Gurmukhi, Hinglish and Punjabi-English mixed content. Avoid robotic translation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.78,
    });

    const text = ai.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "The AI returned no captions. Please try again." },
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

      if (error) console.error("Regional caption usage update failed:", error);
    } else {
      const { error } = await supabase.from("ai_usage").insert({
        user_id: user.id,
        tool_name: TOOL_NAME,
        usage_date: today,
        request_count: 1,
      });

      if (error) console.error("Regional caption usage insert failed:", error);
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
    console.error("Hindi/Punjabi caption generator error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to generate captions right now. Please try again." },
      { status: 500 }
    );
  }
}
