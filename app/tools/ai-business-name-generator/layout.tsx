import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business Name Generator - Free Company Name Ideas",

  description:
    "Generate creative and memorable business name ideas for free with ToolVoraa's AI Business Name Generator. Find names for your company, startup, shop or brand.",

  keywords: [
    "AI Business Name Generator",
    "Business Name Generator",
    "Company Name Generator",
    "Brand Name Generator",
    "Startup Name Generator",
    "Shop Name Generator",
    "Free Business Name Generator",
    "Business Name Ideas",
    "AI Name Generator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/ai-business-name-generator",
  },

  openGraph: {
    title: "AI Business Name Generator | ToolVoraa",
    description:
      "Generate creative business, company, startup and brand name ideas for free with ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/ai-business-name-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "AI Business Name Generator | ToolVoraa",
    description:
      "Generate creative and memorable business name ideas for free with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AiBusinessNameGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}