import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator Online - Add or Remove GST",

  description:
    "Use ToolVoraa's free GST Calculator to add GST, remove GST, calculate GST amount and find GST-inclusive or GST-exclusive prices instantly.",

  keywords: [
    "GST Calculator",
    "GST Calculator India",
    "Online GST Calculator",
    "Add GST Calculator",
    "Remove GST Calculator",
    "GST Inclusive Calculator",
    "GST Exclusive Calculator",
    "5 percent GST Calculator",
    "12 percent GST Calculator",
    "18 percent GST Calculator",
    "28 percent GST Calculator",
    "ToolVoraa",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/gst-calculator",
  },

  openGraph: {
    type: "website",
    url: "https://www.toolvoraa.com/tools/gst-calculator",
    title: "GST Calculator Online - Add or Remove GST | ToolVoraa",
    description:
      "Calculate GST amount, GST-inclusive price and GST-exclusive price instantly with ToolVoraa's free GST Calculator.",
    siteName: "ToolVoraa",
  },

  twitter: {
    card: "summary",
    title: "GST Calculator Online | ToolVoraa",
    description:
      "Add or remove GST and calculate GST amount instantly with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function GstCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}