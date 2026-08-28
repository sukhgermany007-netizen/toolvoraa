import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Online - Separate PDF Pages",

  description:
    "Split PDF documents online with ToolVoraa. Separate selected pages or divide a PDF into smaller files and download the required documents easily.",

  keywords: [
    "Split PDF",
    "PDF Splitter",
    "Separate PDF Pages",
    "Divide PDF File",
    "Split PDF Online",
    "Extract PDF Pages",
    "Break PDF into Pages",
    "Free PDF Splitter",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-splitter",
  },

  openGraph: {
    title: "Split PDF Online | ToolVoraa",
    description:
      "Separate PDF pages or divide a document into smaller PDF files online.",
    url: "https://www.toolvoraa.com/tools/pdf-splitter",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Split PDF Online | ToolVoraa",
    description:
      "Separate and divide PDF documents into smaller files online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfSplitterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}