import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Eligibility Calculator - Check Eligible Loan Amount",

  description:
    "Use ToolVoraa's free Loan Eligibility Calculator to estimate your eligible loan amount based on income, expenses, interest rate and loan tenure.",

  keywords: [
    "Loan Eligibility Calculator",
    "Loan Amount Eligibility Calculator",
    "Home Loan Eligibility Calculator",
    "Personal Loan Eligibility Calculator",
    "Loan Eligibility Check",
    "Eligible Loan Amount",
    "Loan Calculator India",
    "Income Based Loan Calculator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/loan-eligibility-calculator",
  },

  openGraph: {
    title: "Loan Eligibility Calculator | ToolVoraa",
    description:
      "Estimate your eligible loan amount using your income, expenses, interest rate and tenure.",
    url: "https://www.toolvoraa.com/tools/loan-eligibility-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Loan Eligibility Calculator | ToolVoraa",
    description:
      "Check your estimated eligible loan amount online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function LoanEligibilityCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}