import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Meta Tag Generator - Create Website Meta Tags",

  description:
    "Generate SEO meta tags for your website with ToolVoraa. Create title, description, keywords, robots and social sharing metadata quickly and easily.",

  keywords: [
    "SEO Meta Tag Generator",
    "Meta Tag Generator",
    "Website Meta Tags",
    "SEO Title Generator",
    "Meta Description Generator",
    "Open Graph Tag Generator",
    "HTML Meta Tags",
    "Free SEO Meta Tag Tool",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/seo-meta-tag-generator",
  },

  openGraph: {
    title: "SEO Meta Tag Generator | ToolVoraa",
    description:
      "Create SEO and social sharing meta tags for your website online.",
    url: "https://www.toolvoraa.com/tools/seo-meta-tag-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "SEO Meta Tag Generator | ToolVoraa",
    description:
      "Generate optimized title, description and social metadata for your website.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SeoMetaTagGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}