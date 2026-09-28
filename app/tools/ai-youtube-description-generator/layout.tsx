import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI YouTube Description Generator (Pro) | ToolVoraa",
  description:
    "Create professional, SEO-friendly YouTube video descriptions with AI. Generate structured descriptions, keywords, calls to action and hashtags with ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-youtube-description-generator",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI YouTube Description Generator (Pro) | ToolVoraa",
    description:
      "Generate professional YouTube descriptions with AI for videos, Shorts, tutorials and business content.",
    url: "https://www.toolvoraa.com/tools/ai-youtube-description-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI YouTube Description Generator (Pro) | ToolVoraa",
    description:
      "Create structured, SEO-friendly YouTube descriptions with AI.",
  },
};

export default function YouTubeDescriptionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
