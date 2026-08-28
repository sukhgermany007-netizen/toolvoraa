import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markup Calculator Online - Calculate Price and Markup",

  description:
    "Use ToolVoraa's free Markup Calculator to calculate markup amount, markup percentage, profit and selling price from your product cost.",

  keywords: [
    "Markup Calculator",
    "Markup Percentage Calculator",
    "Selling Price Calculator",
    "Cost and Markup Calculator",
    "Profit Markup Calculator",
    "Retail Markup Calculator",
    "Calculate Markup",
    "Business Pricing Calculator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/markup-calculator",
  },

  openGraph: {
    title: "Markup Calculator Online | ToolVoraa",
    description:
      "Calculate markup percentage, profit and selling price from your product cost.",
    url: "https://www.toolvoraa.com/tools/markup-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Markup Calculator Online | ToolVoraa",
    description:
      "Calculate product markup, profit and selling price online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function MarkupCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}