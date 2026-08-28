import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF OCR Online - Extract Text from Scanned PDF",

  description:
    "Extract readable text from scanned PDF documents online with ToolVoraa's PDF OCR tool. Convert image-based PDF pages into selectable and copyable text.",

  keywords: [
    "PDF OCR",
    "PDF OCR Online",
    "Extract Text from PDF",
    "Scanned PDF to Text",
    "OCR PDF Converter",
    "Convert PDF to Text",
    "PDF Text Recognition",
    "Online OCR Tool",
    "Free PDF OCR",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-ocr",
  },

  openGraph: {
    title: "PDF OCR Online | ToolVoraa",
    description:
      "Extract selectable and copyable text from scanned PDF documents online.",
    url: "https://www.toolvoraa.com/tools/pdf-ocr",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PDF OCR Online | ToolVoraa",
    description:
      "Extract readable text from scanned and image-based PDF documents.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfOcrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}