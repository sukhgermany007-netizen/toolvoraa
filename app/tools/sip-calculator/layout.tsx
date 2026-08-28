import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator Online - Calculate Investment Returns",

  description:
    "Use ToolVoraa's free SIP Calculator to estimate mutual fund investment returns, total invested amount and expected maturity value from monthly SIP contributions.",

  keywords: [
    "SIP Calculator",
    "SIP Calculator Online",
    "Mutual Fund SIP Calculator",
    "SIP Return Calculator",
    "Monthly Investment Calculator",
    "Investment Maturity Calculator",
    "Systematic Investment Plan Calculator",
    "SIP Calculator India",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/sip-calculator",
  },

  openGraph: {
    title: "SIP Calculator Online | ToolVoraa",
    description:
      "Estimate total investment, expected returns and maturity value from monthly SIP contributions.",
    url: "https://www.toolvoraa.com/tools/sip-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "SIP Calculator Online | ToolVoraa",
    description:
      "Calculate expected mutual fund SIP investment returns online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SipCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}