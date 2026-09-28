import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Viral Hook Generator (Pro) | Instagram & Facebook - ToolVoraa",
  description:
    "Generate attention-grabbing hooks for Instagram Reels, Facebook videos and social posts with ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-viral-hook-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AI Viral Hook Generator (Pro) | ToolVoraa",
    description:
      "Create strong hooks for Reels, short videos, ads and social posts with AI.",
    url: "https://www.toolvoraa.com/tools/ai-viral-hook-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Viral Hook Generator (Pro) | ToolVoraa",
    description:
      "Generate scroll-stopping hooks for Instagram and Facebook content.",
  },
};

export default function ViralHookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
