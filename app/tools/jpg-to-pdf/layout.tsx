import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to PDF Converter Online - Convert Images to PDF",

  description:
    "Convert JPG and JPEG images to PDF online for free with ToolVoraa. Combine multiple photos, arrange their order and download one PDF document.",

  keywords: [
    "JPG to PDF",
    "JPG to PDF Converter",
    "JPEG to PDF",
    "Convert JPG to PDF",
    "Images to PDF",
    "Photo to PDF Converter",
    "Multiple JPG to PDF",
    "Online JPG to PDF",
    "Free JPG to PDF Converter",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/jpg-to-pdf",
  },

  openGraph: {
    title: "JPG to PDF Converter Online | ToolVoraa",
    description:
      "Combine JPG and JPEG images and download them as one PDF document online for free.",
    url: "https://www.toolvoraa.com/tools/jpg-to-pdf",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "JPG to PDF Converter | ToolVoraa",
    description:
      "Convert one or multiple JPG images into a PDF document online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function JpgToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}