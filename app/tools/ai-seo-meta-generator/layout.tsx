import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI SEO Meta Generator | Meta Titles & Descriptions - ToolVoraa",

  description:
    "Generate SEO-friendly meta titles and descriptions with AI for websites, blog posts, products and landing pages. Create optimized metadata quickly.",

  alternates: {
    canonical:
      "/tools/ai-seo-meta-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "AI SEO Meta Generator Online | ToolVoraa",
    description:
      "Generate SEO-friendly meta titles and descriptions with AI for websites, blogs, products and landing pages.",
    url:
      "https://www.toolvoraa.com/tools/ai-seo-meta-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "AI SEO Meta Generator | ToolVoraa",
    description:
      "Create optimized SEO meta titles and descriptions quickly with AI.",
  },
};

export default function AISEOMetaGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}