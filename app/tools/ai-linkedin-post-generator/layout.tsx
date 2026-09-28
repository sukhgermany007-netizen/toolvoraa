import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI LinkedIn Post Generator (Pro) | ToolVoraa",
  description:
    "Generate professional LinkedIn posts with AI. Create polished thought-leadership, announcement, educational and promotional posts with ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-linkedin-post-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AI LinkedIn Post Generator (Pro) | ToolVoraa",
    description:
      "Create professional LinkedIn posts with hooks, structured copy, CTAs and hashtags using ToolVoraa Pro.",
    url: "https://www.toolvoraa.com/tools/ai-linkedin-post-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI LinkedIn Post Generator (Pro) | ToolVoraa",
    description:
      "Generate ready-to-post LinkedIn content with AI.",
  },
};

export default function LinkedInPostLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
