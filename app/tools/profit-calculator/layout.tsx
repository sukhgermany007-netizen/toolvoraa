import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profit Calculator Online - Calculate Profit and Margin",

  description:
    "Use ToolVoraa's free Profit Calculator to calculate profit, loss, profit percentage and margin from cost price and selling price instantly.",

  keywords: [
    "Profit Calculator",
    "Profit Calculator Online",
    "Profit Margin Calculator",
    "Profit Percentage Calculator",
    "Calculate Profit",
    "Cost Price and Selling Price Calculator",
    "Business Profit Calculator",
    "Free Profit Calculator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/profit-calculator",
  },

  openGraph: {
    title: "Profit Calculator Online | ToolVoraa",
    description:
      "Calculate profit, loss, profit percentage and margin instantly with ToolVoraa's free Profit Calculator.",
    url: "https://www.toolvoraa.com/tools/profit-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Profit Calculator Online | ToolVoraa",
    description:
      "Calculate profit, loss and profit margin instantly with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ProfitCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}