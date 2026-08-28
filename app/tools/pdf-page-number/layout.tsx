import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online - Number PDF Pages",

  description:
    "Add page numbers to PDF documents online with ToolVoraa. Choose the number position and customize your PDF before downloading the numbered document.",

  keywords: [
    "Add Page Numbers to PDF",
    "PDF Page Number",
    "Number PDF Pages",
    "Insert Page Numbers in PDF",
    "PDF Page Numbering Tool",
    "Online PDF Page Numbers",
    "Add Numbers to PDF",
    "Free PDF Numbering Tool",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-page-number",
  },

  openGraph: {
    title: "Add Page Numbers to PDF Online | ToolVoraa",
    description:
      "Insert and position page numbers in your PDF document online.",
    url: "https://www.toolvoraa.com/tools/pdf-page-number",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Add Page Numbers to PDF | ToolVoraa",
    description:
      "Number the pages of your PDF document online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfPageNumberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}