import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google SERP Preview Tool - Preview Search Results",

  description:
    "Preview how your webpage may appear in Google search results with ToolVoraa's free SERP Preview Tool. Test your SEO title, URL and meta description.",

  keywords: [
    "SERP Preview",
    "Google SERP Preview",
    "Search Result Preview",
    "SEO Preview Tool",
    "Meta Title Preview",
    "Meta Description Preview",
    "Google Snippet Preview",
    "Free SERP Simulator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/serp-preview",
  },

  openGraph: {
    title: "Google SERP Preview Tool | ToolVoraa",
    description:
      "Preview your SEO title, URL and meta description as a Google search result.",
    url: "https://www.toolvoraa.com/tools/serp-preview",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Google SERP Preview Tool | ToolVoraa",
    description:
      "Preview how your webpage may appear in Google search results.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SerpPreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}