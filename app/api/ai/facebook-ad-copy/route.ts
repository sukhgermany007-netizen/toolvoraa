import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export const runtime = "nodejs";

const TOOL_NAME = "facebook-ad-copy";
const DAILY_PRO_LIMIT = 50;

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & {
  toolVoraaFacebookAdRate?: Map<string, RateEntry>;
};
const rateStore =
  globalStore.toolVoraaFacebookAdRate ?? new Map<string, RateEntry>();

if (!globalStore.toolVoraaFacebookAdRate) {
  globalStore.toolVoraaFacebookAdRate = rateStore;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 10;
  const current = rateStore.get(ip);

  if (!current || now >= current.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateStore.set(ip, current);
  return { allowed: true, retryAfter: 0 };
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(getClientIp(request));

    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: "RATE_LIMITED",
          error: "Too many requests. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfter) },
        }
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

    const used =
      typeof usage?.request_count === "number" ? usage.request_count : 0;

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

    const product = clean(body.product, 1600);
    const offer = clean(body.offer, 500);
    const audience = clean(body.audience, 400);
    const benefits = clean(body.benefits, 900);
    const brandName = clean(body.brandName, 160);
    const website = clean(body.website, 500);
    const campaignGoal = clean(body.campaignGoal, 80) || "Conversions";
    const tone = clean(body.tone, 80) || "Professional";
    const language = clean(body.language, 40) || "English";
    const length = clean(body.length, 40) || "Standard";
    const variantsRaw =
      typeof body.variants === "number" ? body.variants : Number(body.variants);
    const variants = [3, 5].includes(variantsRaw) ? variantsRaw : 3;
    const includeEmoji = body.includeEmoji === true;
    const includeHashtags = body.includeHashtags === true;

    if (product.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid product, service or campaign description.",
        },
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
Create exactly ${variants} distinct Facebook ad copy variations.

Product / Service / Campaign:
${product}

Brand:
${brandName || "Not provided"}

Offer:
${offer || "No specific offer provided"}

Target audience:
${audience || "General relevant audience"}

Key benefits / selling points:
${benefits || "Use only benefits supported by the supplied information"}

Campaign goal:
${campaignGoal}

Tone:
${tone}

Language:
${language}

Copy length:
${length}

Website / landing page:
${website || "Not provided"}

Use emojis:
${includeEmoji ? "Yes, sparingly and naturally" : "No"}

Include hashtags:
${includeHashtags ? "Yes, 2-5 relevant hashtags per variation" : "No"}

For every variation return this exact structure:

VARIATION 1
Primary Text:
...

Headline:
...

Description:
...

CTA:
...

Requirements:
- Write persuasive but accurate Facebook ad copy.
- Keep each variation meaningfully different in angle and wording.
- Lead with a clear benefit, problem, offer or hook appropriate to the campaign.
- Do not invent prices, discounts, guarantees, statistics, testimonials, awards, certifications or scarcity.
- Do not make misleading, discriminatory, exploitative or unsupported personal-attribute claims.
- Do not imply you know sensitive traits about the viewer.
- If a website is supplied, include it only where natural and preserve it exactly.
- Use the requested language naturally.
- Keep headlines concise and suitable for an ad.
- CTA should be short, such as Learn More, Shop Now, Sign Up, Get Quote, Contact Us or a better fit for the stated goal.
- Return only the finished ad variations, ready to use.
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
            "You are ToolVoraa AI Facebook Ad Copy Generator. Write clear, accurate, conversion-focused ad copy while avoiding fabricated claims, discriminatory targeting language and deceptive urgency.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.72,
    });

    const text = ai.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "The AI returned no ad copy. Please try again.",
        },
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

      if (error) {
        console.error("Facebook ad copy usage update failed:", error);
      }
    } else {
      const { error } = await supabase.from("ai_usage").insert({
        user_id: user.id,
        tool_name: TOOL_NAME,
        usage_date: today,
        request_count: 1,
      });

      if (error) {
        console.error("Facebook ad copy usage insert failed:", error);
      }
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
    console.error("Facebook ad copy generator error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate ad copy right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
