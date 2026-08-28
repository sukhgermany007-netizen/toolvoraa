import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online - Free PDF Watermark Tool",

  description:
    "Add a customized text watermark to PDF documents online with ToolVoraa. Protect and brand your PDF pages, then download the updated file.",

  keywords: [
    "PDF Watermark",
    "Add Watermark to PDF",
    "Watermark PDF Online",
    "Text Watermark PDF",
    "PDF Watermark Maker",
    "Protect PDF Document",
    "Brand PDF Pages",
    "Free PDF Watermark Tool",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-watermark",
  },

  openGraph: {
    title: "Add Watermark to PDF Online | ToolVoraa",
    description:
      "Add customized text watermarks to PDF pages online.",
    url: "https://www.toolvoraa.com/tools/pdf-watermark",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Add Watermark to PDF | ToolVoraa",
    description:
      "Protect and brand PDF pages with a customized text watermark.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfWatermarkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}