import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Return Calculator - Calculate ROI Online",

  description:
    "Use ToolVoraa's free Investment Return Calculator to calculate investment profit, total return and ROI percentage from your initial and final investment values.",

  keywords: [
    "Investment Return Calculator",
    "ROI Calculator",
    "Return on Investment Calculator",
    "Investment Profit Calculator",
    "Investment Calculator Online",
    "Calculate Investment Return",
    "Investment Growth Calculator",
    "Free ROI Calculator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/investment-return-calculator",
  },

  openGraph: {
    title: "Investment Return Calculator | ToolVoraa",
    description:
      "Calculate investment profit, total return and ROI percentage online for free.",
    url: "https://www.toolvoraa.com/tools/investment-return-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Investment Return Calculator | ToolVoraa",
    description:
      "Calculate your investment profit and return on investment online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function InvestmentReturnCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}