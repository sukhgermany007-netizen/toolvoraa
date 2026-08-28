import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Converter Online - Convert JPG, PNG and WebP",

  description:
    "Convert images online for free with ToolVoraa. Change JPG, JPEG, PNG and WebP images into your preferred format quickly and download the converted file.",

  keywords: [
    "Image Converter",
    "Image Converter Online",
    "Convert Image Format",
    "JPG to PNG Converter",
    "PNG to JPG Converter",
    "WebP to JPG Converter",
    "JPG to WebP Converter",
    "Free Image Converter",
    "Photo Converter",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-converter",
  },

  openGraph: {
    title: "Image Converter Online | ToolVoraa",
    description:
      "Convert JPG, JPEG, PNG and WebP images into different formats online for free.",
    url: "https://www.toolvoraa.com/tools/image-converter",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image Converter Online | ToolVoraa",
    description:
      "Convert images between JPG, PNG and WebP formats online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}