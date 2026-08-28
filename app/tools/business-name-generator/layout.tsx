import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Business Name Generator - Company Name Ideas",

  description:
    "Generate creative business, company, shop and brand name ideas for free with ToolVoraa's Business Name Generator. Find a memorable name for your new business.",

  keywords: [
    "Business Name Generator",
    "Free Business Name Generator",
    "Company Name Generator",
    "Brand Name Generator",
    "Shop Name Generator",
    "Startup Name Generator",
    "Business Name Ideas",
    "Company Name Ideas",
    "Online Name Generator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/business-name-generator",
  },

  openGraph: {
    title: "Free Business Name Generator | ToolVoraa",
    description:
      "Generate creative and memorable names for your business, company, shop or brand.",
    url: "https://www.toolvoraa.com/tools/business-name-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Free Business Name Generator | ToolVoraa",
    description:
      "Find creative business and company name ideas online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function BusinessNameGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}