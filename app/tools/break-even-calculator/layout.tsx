import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Break-Even Calculator Online - Calculate Break-Even Point",

  description:
    "Use ToolVoraa's free Break-Even Calculator to calculate break-even units, break-even revenue and contribution margin from your business costs.",

  keywords: [
    "Break-Even Calculator",
    "Break Even Point Calculator",
    "Break-Even Analysis",
    "Break-Even Units Calculator",
    "Break-Even Revenue Calculator",
    "Contribution Margin Calculator",
    "Business Break-Even Calculator",
    "Fixed Cost Calculator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/break-even-calculator",
  },

  openGraph: {
    title: "Break-Even Calculator Online | ToolVoraa",
    description:
      "Calculate your business break-even point, required sales and contribution margin for free.",
    url: "https://www.toolvoraa.com/tools/break-even-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Break-Even Calculator Online | ToolVoraa",
    description:
      "Calculate break-even units and revenue instantly with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function BreakEvenCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}