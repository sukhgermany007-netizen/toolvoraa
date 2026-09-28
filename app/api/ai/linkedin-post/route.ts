import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";

const TOOL_NAME = "linkedin-post";
const DAILY_PRO_LIMIT = 50;

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & {
  toolVoraaLinkedInPostRate?: Map<string, RateEntry>;
};
const rateStore =
  globalStore.toolVoraaLinkedInPostRate ?? new Map<string, RateEntry>();

if (!globalStore.toolVoraaLinkedInPostRate) {
  globalStore.toolVoraaLinkedInPostRate = rateStore;
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
      return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    }

    const topic = clean(body.topic, 1800);
    const audience = clean(body.audience, 350);
    const keyPoints = clean(body.keyPoints, 1200);
    const personalContext = clean(body.personalContext, 900);
    const cta = clean(body.cta, 300);
    const goal = clean(body.goal, 80) || "Thought Leadership";
    const tone = clean(body.tone, 80) || "Professional";
    const language = clean(body.language, 40) || "English";
    const length = clean(body.length, 40) || "Standard";
    const variantsRaw = typeof body.variants === "number" ? body.variants : Number(body.variants);
    const variants = [1, 3].includes(variantsRaw) ? variantsRaw : 1;
    const includeHashtags = body.includeHashtags !== false;
    const includeEmoji = body.includeEmoji === true;

    if (topic.length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid LinkedIn post topic." },
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
Create exactly ${variants} professional LinkedIn post ${variants === 1 ? "version" : "versions"}.

Topic:
${topic}

Post goal:
${goal}

Target audience:
${audience || "General professional audience"}

Key points to include:
${keyPoints || "Use only the information supplied in the topic"}

Personal context / experience:
${personalContext || "None provided"}

Tone:
${tone}

Language:
${language}

Length:
${length}

Call to action:
${cta || "Use a natural engagement CTA only if appropriate"}

Use emojis:
${includeEmoji ? "Yes, sparingly and professionally" : "No"}

Include hashtags:
${includeHashtags ? "Yes, add 3-6 relevant hashtags at the end" : "No"}

Requirements:
- Write a strong opening hook suitable for LinkedIn.
- Keep the writing natural, professional and easy to scan.
- Use short paragraphs and whitespace.
- Match the selected goal and tone.
- Avoid generic motivational filler.
- Do not invent achievements, numbers, clients, revenue, credentials, job titles, results or personal experiences.
- Do not fabricate quotes, research or statistics.
- If personal context is provided, use only those exact facts.
- Keep promotional wording credible and non-spammy.
- End naturally, with the requested CTA if supplied.
- Respect the requested language.
${variants > 1 ? "- Make each version meaningfully different in angle, hook and structure.\n- Label them VERSION 1, VERSION 2, VERSION 3." : "- Return only the finished post, ready to paste into LinkedIn."}
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
            "You are ToolVoraa AI LinkedIn Post Generator. Write polished, credible LinkedIn content without fabricating professional achievements, experience or statistics.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.72,
    });

    const text = ai.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "The AI returned no LinkedIn post. Please try again." },
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

      if (error) console.error("LinkedIn post usage update failed:", error);
    } else {
      const { error } = await supabase.from("ai_usage").insert({
        user_id: user.id,
        tool_name: TOOL_NAME,
        usage_date: today,
        request_count: 1,
      });

      if (error) console.error("LinkedIn post usage insert failed:", error);
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
    console.error("LinkedIn post generator error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to generate a LinkedIn post right now. Please try again." },
      { status: 500 }
    );
  }
}
