import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator Online - Calculate Loan EMI",

  description:
    "Free online EMI Calculator to calculate monthly loan EMI, total interest and total payment. Easy EMI calculator for home, car and personal loans.",

  keywords: [
    "EMI Calculator",
    "Loan EMI Calculator",
    "EMI Calculator Online",
    "Home Loan EMI Calculator",
    "Car Loan EMI Calculator",
    "Personal Loan EMI Calculator",
    "Loan Calculator India",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/emi-calculator",
  },

  openGraph: {
    title: "EMI Calculator Online | ToolVoraa",
    description:
      "Calculate monthly EMI, total interest and total loan payment instantly with ToolVoraa's free EMI Calculator.",
    url: "https://www.toolvoraa.com/tools/emi-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function EmiCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}