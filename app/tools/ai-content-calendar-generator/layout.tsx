import type { Metadata } from "next";

// Preview deployment verification

export const metadata: Metadata = {
  title: "AI Content Calendar Generator (Pro) | ToolVoraa",
  description:
    "Generate a professional social media content calendar with AI. Plan posts by platform, content type, hook, CTA and posting schedule with ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-content-calendar-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AI Content Calendar Generator (Pro) | ToolVoraa",
    description:
      "Plan social media content across Instagram, Facebook, LinkedIn and YouTube with a structured AI-generated calendar.",
    url: "https://www.toolvoraa.com/tools/ai-content-calendar-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Content Calendar Generator (Pro) | ToolVoraa",
    description:
      "Create ready-to-use social content calendars with AI.",
  },
};

export default function ContentCalendarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
