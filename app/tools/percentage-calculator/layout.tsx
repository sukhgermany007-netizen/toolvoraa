import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator Online - Calculate Percentages",

  description:
    "Use ToolVoraa's free online Percentage Calculator to quickly calculate the percentage of any number with accurate and instant results.",

  keywords: [
    "Percentage Calculator",
    "Percentage Calculator Online",
    "Calculate Percentage",
    "Percent Calculator",
    "Percentage of a Number",
    "Online Percentage Calculator",
    "Free Percentage Calculator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/percentage-calculator",
  },

  openGraph: {
    title: "Percentage Calculator Online | ToolVoraa",
    description:
      "Calculate the percentage of any number quickly and accurately with ToolVoraa's free Percentage Calculator.",
    url: "https://www.toolvoraa.com/tools/percentage-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Percentage Calculator Online | ToolVoraa",
    description:
      "Calculate percentages quickly with ToolVoraa's free online Percentage Calculator.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PercentageCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}