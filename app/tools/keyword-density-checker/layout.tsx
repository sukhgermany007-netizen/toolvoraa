import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Density Checker Online - Analyze Content Keywords",

  description:
    "Check keyword frequency and density in your content with ToolVoraa's free Keyword Density Checker. Analyze repeated words and improve your SEO content.",

  keywords: [
    "Keyword Density Checker",
    "Keyword Density Tool",
    "Keyword Frequency Checker",
    "SEO Keyword Checker",
    "Content Keyword Analyzer",
    "Keyword Percentage Checker",
    "SEO Content Analyzer",
    "Free Keyword Density Checker",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/keyword-density-checker",
  },

  openGraph: {
    title: "Keyword Density Checker Online | ToolVoraa",
    description:
      "Analyze keyword frequency and density to improve your website and SEO content.",
    url: "https://www.toolvoraa.com/tools/keyword-density-checker",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Keyword Density Checker | ToolVoraa",
    description:
      "Check keyword density and repeated word frequency in your content.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function KeywordDensityCheckerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}