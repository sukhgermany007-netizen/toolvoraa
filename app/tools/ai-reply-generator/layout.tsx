import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Reply Generator Online | Smart Reply Writer - ToolVoraa",

  description:
    "Generate professional AI replies for emails, messages and customer conversations. Create clear, polite and context-aware responses in seconds.",

  alternates: {
    canonical: "/tools/ai-reply-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Reply Generator Online | ToolVoraa",
    description:
      "Create professional and context-aware replies for emails, messages and customer conversations with AI.",
    url: "https://www.toolvoraa.com/tools/ai-reply-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "AI Reply Generator Online | ToolVoraa",
    description:
      "Generate smart and professional replies for emails and messages with AI.",
  },
};

export default function AIReplyGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}