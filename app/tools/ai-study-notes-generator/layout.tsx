import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Study Notes Generator Online | Create Study Notes - ToolVoraa",

  description:
    "Generate clear and structured study notes with AI. Turn topics or text into key points, summaries and revision material for faster learning.",

  alternates: {
    canonical:
      "/tools/ai-study-notes-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "AI Study Notes Generator Online | ToolVoraa",
    description:
      "Create structured study notes, summaries and key revision points with AI.",
    url:
      "https://www.toolvoraa.com/tools/ai-study-notes-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "AI Study Notes Generator | ToolVoraa",
    description:
      "Turn topics and text into clear study notes and revision points with AI.",
  },
};

export default function AIStudyNotesGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}