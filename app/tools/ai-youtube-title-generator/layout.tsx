import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI YouTube Title Generator Online | Video Title Ideas - ToolVoraa",

  description:
    "Generate engaging YouTube video titles with AI. Create catchy, relevant and click-worthy title ideas for videos, Shorts and content channels.",

  alternates: {
    canonical:
      "/tools/ai-youtube-title-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "AI YouTube Title Generator Online | ToolVoraa",
    description:
      "Generate catchy and engaging YouTube title ideas with AI for videos, Shorts and online content.",
    url:
      "https://www.toolvoraa.com/tools/ai-youtube-title-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "AI YouTube Title Generator | ToolVoraa",
    description:
      "Create engaging and click-worthy YouTube video title ideas with AI.",
  },
};

export default function AIYouTubeTitleGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}