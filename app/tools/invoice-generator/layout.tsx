import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Generator Online | GST Invoice Maker - ToolVoraa",

  description:
    "Create professional GST invoices online for free with ToolVoraa. Add GSTIN, HSN codes, CGST, SGST or IGST and download your invoice as PDF.",

  keywords: [
    "invoice generator",
    "free invoice generator",
    "GST invoice generator",
    "invoice maker",
    "online invoice generator",
    "GST invoice maker",
    "free invoice maker",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/invoice-generator",
  },

  openGraph: {
    title: "Free Invoice Generator Online | ToolVoraa",
    description:
      "Create professional GST invoices online for free and download them as PDF.",
    url: "https://www.toolvoraa.com/tools/invoice-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function InvoiceGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}