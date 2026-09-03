import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Review Reply Generator Online | Review Response Writer - ToolVoraa",

  description:
    "Generate professional AI replies to customer reviews. Create polite and personalized responses for positive, neutral and negative reviews quickly.",

  alternates: {
    canonical:
      "/tools/ai-review-reply-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "AI Review Reply Generator Online | ToolVoraa",
    description:
      "Create professional and personalized responses to customer reviews using AI.",
    url:
      "https://www.toolvoraa.com/tools/ai-review-reply-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "AI Review Reply Generator | ToolVoraa",
    description:
      "Generate professional responses to positive, neutral and negative customer reviews with AI.",
  },
};

export default function AIReviewReplyGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}