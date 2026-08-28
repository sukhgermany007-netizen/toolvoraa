import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG Converter Online - Convert PDF Pages to Images",

  description:
    "Convert PDF pages to JPG images online with ToolVoraa. Turn every PDF page into a downloadable high-quality image quickly and easily.",

  keywords: [
    "PDF to JPG",
    "PDF to JPG Converter",
    "Convert PDF to Image",
    "PDF to JPEG",
    "PDF Pages to Images",
    "Online PDF to JPG",
    "Extract Images from PDF",
    "Free PDF to JPG Converter",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-to-jpg",
  },

  openGraph: {
    title: "PDF to JPG Converter Online | ToolVoraa",
    description:
      "Convert PDF document pages into downloadable JPG images online.",
    url: "https://www.toolvoraa.com/tools/pdf-to-jpg",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PDF to JPG Converter | ToolVoraa",
    description:
      "Convert every PDF page into a downloadable JPG image.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfToJpgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}