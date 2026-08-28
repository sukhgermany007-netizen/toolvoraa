import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online - Reduce PDF File Size",

  description:
    "Compress PDF files online with ToolVoraa. Reduce PDF file size for easier uploading, sharing and storage while keeping your document usable.",

  keywords: [
    "PDF Compressor",
    "Compress PDF Online",
    "Reduce PDF Size",
    "PDF Size Reducer",
    "Compress PDF File",
    "Make PDF Smaller",
    "Online PDF Compressor",
    "Free PDF Compressor",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-compressor",
  },

  openGraph: {
    title: "Compress PDF Online | ToolVoraa",
    description:
      "Reduce PDF file size online for easier uploading, sharing and storage.",
    url: "https://www.toolvoraa.com/tools/pdf-compressor",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Compress PDF Online | ToolVoraa",
    description:
      "Reduce PDF document file size quickly and easily online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfCompressorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}