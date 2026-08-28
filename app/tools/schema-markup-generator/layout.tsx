import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema Markup Generator - Create JSON-LD Structured Data",

  description:
    "Generate JSON-LD schema markup for your website with ToolVoraa. Create structured data code to help search engines understand your webpage content.",

  keywords: [
    "Schema Markup Generator",
    "JSON-LD Generator",
    "Structured Data Generator",
    "SEO Schema Generator",
    "Google Schema Markup",
    "Website Schema Generator",
    "Rich Results Schema",
    "Free Schema Markup Tool",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/schema-markup-generator",
  },

  openGraph: {
    title: "Schema Markup Generator | ToolVoraa",
    description:
      "Create JSON-LD structured data code for your website online.",
    url: "https://www.toolvoraa.com/tools/schema-markup-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Schema Markup Generator | ToolVoraa",
    description:
      "Generate JSON-LD structured data markup for your website.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SchemaMarkupGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}