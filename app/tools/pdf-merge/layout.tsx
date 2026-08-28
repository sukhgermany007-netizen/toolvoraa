import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Online - Combine Multiple PDF Files",

  description:
    "Merge multiple PDF files online with ToolVoraa. Arrange your documents in the required order and combine them into one downloadable PDF.",

  keywords: [
    "Merge PDF",
    "PDF Merger",
    "Combine PDF Files",
    "Merge PDF Online",
    "Join PDF Files",
    "Combine Multiple PDFs",
    "Online PDF Merger",
    "Free PDF Merger",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-merge",
  },

  openGraph: {
    title: "Merge PDF Online | ToolVoraa",
    description:
      "Arrange and combine multiple PDF documents into one downloadable file.",
    url: "https://www.toolvoraa.com/tools/pdf-merge",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Merge PDF Online | ToolVoraa",
    description:
      "Combine multiple PDF documents into one file online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfMergeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}