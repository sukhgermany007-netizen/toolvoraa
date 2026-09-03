import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ToolName =
  | "email-writer"
  | "reply-generator"
  | "product-description"
  | "youtube-title"
  | "review-reply"
  | "complaint-letter"
  | "study-notes"
  | "seo-meta";

const allowedTools: ToolName[] = [
  "email-writer",
  "reply-generator",
  "product-description",
  "youtube-title",
  "review-reply",
  "complaint-letter",
  "study-notes",
  "seo-meta",
];

function isAllowedTool(tool: unknown): tool is ToolName {
  return (
    typeof tool === "string" &&
    allowedTools.includes(tool as ToolName)
  );
}

function getToolInstructions(tool: ToolName): string {
  switch (tool) {
    case "email-writer":
      return `
You are ToolVoraa AI Email Writer.

Your job is to write polished, professional, natural-sounding emails based on the user's details.

Rules:
- Follow the requested tone, language, length, email type and purpose.
- Make the email clear, human, professional and easy to read.
- Do not use robotic or repetitive wording.
- Do not invent facts, names, dates, prices or commitments.
- If key points are provided, include them naturally.
- Keep paragraphs well structured.
- Do not add unnecessary explanations.
- Do not write "Here is your email".
- Return only the finished email body.
- If a sender name is provided, end naturally with that name.
- Respect English, Hindi or Punjabi when requested.
`;

    case "reply-generator":
      return `
You are ToolVoraa AI Reply Generator.

Create a natural and useful reply to the message supplied by the user.

Rules:
- Match the requested tone and context.
- Be concise unless a detailed reply is requested.
- Sound human and professional.
- Do not invent details.
- Avoid unnecessary greetings or filler.
- Do not explain your reasoning.
- Return only the ready-to-send reply.
- Respect the requested language.
`;

    case "product-description":
      return `
You are ToolVoraa AI Product Description Generator.

Write persuasive, clear and professional product descriptions suitable for ecommerce.

Rules:
- Focus on benefits as well as features.
- Do not make unverifiable claims.
- Do not invent certifications, guarantees or specifications.
- Keep wording natural and conversion-focused.
- Avoid keyword stuffing.
- Use readable paragraphs or bullets only when useful.
- Match the requested tone, audience and length.
- Return only the final product description.
`;

    case "youtube-title":
      return `
You are ToolVoraa AI YouTube Title Generator.

Generate strong YouTube title ideas based on the supplied topic.

Rules:
- Titles should be clear, clickable and relevant.
- Avoid misleading clickbait.
- Do not use fake claims.
- Keep titles concise.
- Use natural capitalization.
- Match the requested style and language.
- Avoid repeating the same title structure.
- Return only title suggestions, one per line.
`;

    case "review-reply":
      return `
You are ToolVoraa AI Review Reply Generator.

Write professional business responses to customer reviews.

Rules:
- Match the sentiment of the review.
- For positive reviews, thank the customer naturally.
- For negative reviews, remain calm, respectful and solution-oriented.
- Never blame or argue with the customer.
- Do not admit legal liability.
- Do not invent refunds, policies or actions not provided by the user.
- Keep the response professional and human.
- Return only the ready-to-post review reply.
`;

    case "complaint-letter":
      return `
You are ToolVoraa AI Complaint Letter Generator.

Write clear, firm and professional complaint letters.

Rules:
- Clearly explain the issue.
- Include relevant facts supplied by the user.
- State the requested resolution professionally.
- Do not add threats, abusive language or unsupported accusations.
- Do not invent dates, transaction details or legal claims.
- Keep the structure formal and readable.
- Respect the requested language and tone.
- Return only the finished complaint letter.
`;

    case "study-notes":
      return `
You are ToolVoraa AI Study Notes Generator.

Convert the user's study material or topic into useful, structured study notes.

Rules:
- Preserve important facts and concepts.
- Explain difficult ideas simply.
- Organize information with clear headings and concise bullet points where useful.
- Highlight key definitions, concepts and takeaways.
- Do not invent facts not supported by the supplied content.
- Avoid unnecessary repetition.
- Make the notes easy to revise.
- Respect the requested language and detail level.
- Return only the study notes.
`;

    case "seo-meta":
      return `
You are ToolVoraa AI SEO Meta Generator.

Generate professional SEO metadata for the supplied webpage or topic.

Rules:
- Create an SEO-friendly title.
- Create a concise, compelling meta description.
- Use the supplied keyword naturally.
- Avoid keyword stuffing.
- Do not make unsupported claims.
- Keep wording useful for search users.
- Prefer a title roughly suitable for search result display.
- Prefer a meta description roughly suitable for search result display.
- Return the result in this exact format:

SEO Title:
...

Meta Description:
...
`;

    default:
      return "You are a helpful AI assistant.";
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Groq API key is not available. Check GROQ_API_KEY in .env.local and restart the development server.",
        },
        { status: 500 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request. Please send valid JSON.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const requestBody = body as Record<string, unknown>;

    const tool = requestBody.tool;
    const prompt = requestBody.prompt;

    if (!isAllowedTool(tool)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or unsupported AI tool.",
        },
        { status: 400 }
      );
    }

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required.",
        },
        { status: 400 }
      );
    }

    const cleanedPrompt = prompt.trim();

    if (cleanedPrompt.length > 12000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your input is too long. Please shorten it and try again.",
        },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const instructions = getToolInstructions(tool);

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: instructions,
        },
        {
          role: "user",
          content: cleanedPrompt,
        },
      ],
      temperature: 0.7,
    });

    const text =
      response.choices[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The AI completed the request but returned no text. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        text,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("ToolVoraa Groq API Error:", error);

    let message =
      "Unable to generate AI content right now. Please try again.";

    if (error instanceof Error && error.message) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}