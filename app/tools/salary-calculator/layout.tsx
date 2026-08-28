import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculator Online - Calculate Monthly Salary",

  description:
    "Use ToolVoraa's free Salary Calculator to calculate gross salary, deductions and estimated take-home salary quickly and easily.",

  keywords: [
    "Salary Calculator",
    "Salary Calculator Online",
    "Monthly Salary Calculator",
    "Take Home Salary Calculator",
    "Net Salary Calculator",
    "Gross Salary Calculator",
    "Salary After Deductions",
    "In Hand Salary Calculator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/salary-calculator",
  },

  openGraph: {
    title: "Salary Calculator Online | ToolVoraa",
    description:
      "Calculate gross salary, deductions and estimated take-home salary online.",
    url: "https://www.toolvoraa.com/tools/salary-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Salary Calculator Online | ToolVoraa",
    description:
      "Calculate your estimated monthly and take-home salary online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SalaryCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}