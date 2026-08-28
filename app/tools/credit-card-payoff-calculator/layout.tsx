import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator - Calculate Repayment Time",

  description:
    "Use ToolVoraa's free Credit Card Payoff Calculator to estimate repayment time, total interest and the cost of paying off your credit card balance.",

  keywords: [
    "Credit Card Payoff Calculator",
    "Credit Card Repayment Calculator",
    "Credit Card Interest Calculator",
    "Credit Card Payment Calculator",
    "Debt Payoff Calculator",
    "Credit Card Balance Calculator",
    "Pay Off Credit Card",
    "Credit Card Debt Calculator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/credit-card-payoff-calculator",
  },

  openGraph: {
    title: "Credit Card Payoff Calculator | ToolVoraa",
    description:
      "Estimate how long it will take to repay your credit card balance and calculate total interest.",
    url: "https://www.toolvoraa.com/tools/credit-card-payoff-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Credit Card Payoff Calculator | ToolVoraa",
    description:
      "Calculate credit card repayment time and total interest for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CreditCardPayoffCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}