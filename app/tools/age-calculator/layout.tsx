import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator Online - Calculate Your Exact Age",

  description:
    "Calculate your exact age from your date of birth with ToolVoraa's free Age Calculator. Find your age in years, months and days instantly.",

  keywords: [
    "Age Calculator",
    "Age Calculator Online",
    "Exact Age Calculator",
    "Date of Birth Calculator",
    "DOB Calculator",
    "Calculate My Age",
    "Age in Years Months and Days",
    "Free Age Calculator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/age-calculator",
  },

  openGraph: {
    title: "Age Calculator Online | ToolVoraa",
    description:
      "Calculate your exact age in years, months and days using ToolVoraa's free Age Calculator.",
    url: "https://www.toolvoraa.com/tools/age-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Age Calculator Online | ToolVoraa",
    description:
      "Calculate your exact age from your date of birth for free with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AgeCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}