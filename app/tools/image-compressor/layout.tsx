import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor Online - Reduce Image File Size",

  description:
    "Compress images online for free with ToolVoraa. Reduce JPG, JPEG, PNG and WebP image file sizes while maintaining good visual quality.",

  keywords: [
    "Image Compressor",
    "Image Compressor Online",
    "Compress Image",
    "Reduce Image Size",
    "JPG Compressor",
    "PNG Compressor",
    "WebP Compressor",
    "Photo Size Reducer",
    "Free Image Compressor",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-compressor",
  },

  openGraph: {
    title: "Image Compressor Online | ToolVoraa",
    description:
      "Reduce JPG, PNG and WebP image file sizes online for free while maintaining good quality.",
    url: "https://www.toolvoraa.com/tools/image-compressor",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image Compressor Online | ToolVoraa",
    description:
      "Compress images and reduce their file size online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageCompressorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}