import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Quotation Generator Online - Create Quotes",

  description:
    "Create professional business quotations online for free with ToolVoraa. Add customer details, products, GST and pricing, then print or download your quotation.",

  keywords: [
    "Quotation Generator",
    "Free Quotation Generator",
    "Quotation Generator Online",
    "Online Quotation Maker",
    "Business Quotation Generator",
    "GST Quotation Generator",
    "Price Quotation Maker",
    "Create Quotation Online",
    "Quotation Format India",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/quotation-generator",
  },

  openGraph: {
    title: "Free Quotation Generator Online | ToolVoraa",
    description:
      "Create professional business quotations with customer details, products, pricing and GST using ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/quotation-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Free Quotation Generator Online | ToolVoraa",
    description:
      "Create and download professional business quotations for free with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function QuotationGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}