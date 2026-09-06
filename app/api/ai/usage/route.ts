import { NextResponse } from "next/server";
import {
  getAIUsageInfo,
  type AIToolName,
} from "@/app/utils/ai-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TOOLS: AIToolName[] = [
  "email-writer",
  "reply-generator",
  "product-description",
  "youtube-title",
  "review-reply",
  "complaint-letter",
  "study-notes",
  "seo-meta",
  "resume-analyzer",
  "pdf-summarizer",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tool = searchParams.get("tool");

    if (
      !tool ||
      !VALID_TOOLS.includes(tool as AIToolName)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid AI tool.",
        },
        { status: 400 }
      );
    }

    const usage = await getAIUsageInfo(
      tool as AIToolName
    );

    if (!usage.authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Please log in to use this AI tool.",
          usage,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error("AI usage API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load AI usage information.",
      },
      { status: 500 }
    );
  }
}