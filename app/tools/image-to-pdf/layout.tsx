import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Converter - Convert Photos to PDF",

  description:
    "Convert JPG, JPEG and PNG images to PDF online for free with ToolVoraa. Arrange your images and download them together as a PDF document.",

  keywords: [
    "Image to PDF",
    "Image to PDF Converter",
    "JPG to PDF",
    "PNG to PDF",
    "Photo to PDF",
    "Convert Image to PDF",
    "Online Image to PDF",
    "Free Image to PDF Converter",
    "Multiple Images to PDF",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-to-pdf",
  },

  openGraph: {
    title: "Image to PDF Converter | ToolVoraa",
    description:
      "Convert JPG, JPEG and PNG images into a downloadable PDF document online for free.",
    url: "https://www.toolvoraa.com/tools/image-to-pdf",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image to PDF Converter | ToolVoraa",
    description:
      "Convert one or multiple images into a PDF document online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}