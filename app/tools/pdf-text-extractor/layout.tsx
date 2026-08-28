import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Text from PDF Online - PDF Text Extractor",

  description:
    "Extract selectable text from PDF documents online with ToolVoraa. Copy and use the text contained in your PDF quickly and easily.",

  keywords: [
    "PDF Text Extractor",
    "Extract Text from PDF",
    "PDF to Text",
    "Copy Text from PDF",
    "Read PDF Text",
    "Convert PDF to Text",
    "Online PDF Text Extractor",
    "Free PDF to Text Tool",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/pdf-text-extractor",
  },

  openGraph: {
    title: "Extract Text from PDF Online | ToolVoraa",
    description:
      "Extract and copy selectable text from PDF documents online.",
    url: "https://www.toolvoraa.com/tools/pdf-text-extractor",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PDF Text Extractor | ToolVoraa",
    description:
      "Extract and copy text contained in PDF documents online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfTextExtractorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}