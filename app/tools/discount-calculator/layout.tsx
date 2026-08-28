import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Calculator Online - Calculate Sale Price",

  description:
    "Use ToolVoraa's free Discount Calculator to calculate discount amount, final sale price and savings percentage quickly and accurately.",

  keywords: [
    "Discount Calculator",
    "Discount Calculator Online",
    "Sale Price Calculator",
    "Percentage Discount Calculator",
    "Price After Discount Calculator",
    "Discount Amount Calculator",
    "Calculate Discount",
    "Shopping Discount Calculator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/discount-calculator",
  },

  openGraph: {
    title: "Discount Calculator Online | ToolVoraa",
    description:
      "Calculate the discount amount, final sale price and total savings instantly for free.",
    url: "https://www.toolvoraa.com/tools/discount-calculator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Discount Calculator Online | ToolVoraa",
    description:
      "Calculate discounts, sale prices and savings instantly.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function DiscountCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}