import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Text Converter Online - Extract Text from Images",

  description:
    "Extract text from JPG, PNG and other images online with ToolVoraa's free Image to Text Converter. Copy readable text from photos and scanned images easily.",

  keywords: [
    "Image to Text",
    "Image to Text Converter",
    "Extract Text from Image",
    "Photo to Text Converter",
    "JPG to Text",
    "PNG to Text",
    "OCR Online",
    "Online OCR Tool",
    "Free Image to Text Converter",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-to-text",
  },

  openGraph: {
    title: "Image to Text Converter Online | ToolVoraa",
    description:
      "Extract and copy readable text from photos and scanned images online.",
    url: "https://www.toolvoraa.com/tools/image-to-text",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image to Text Converter | ToolVoraa",
    description:
      "Extract text from images and scanned photos online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageToTextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}