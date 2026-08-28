import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop PDF Online - Trim PDF Page Margins",

  description:
    "Crop PDF pages online with ToolVoraa. Remove unwanted margins and trim selected areas from your PDF document quickly and easily.",

  keywords: [
    "PDF Cropper",
    "Crop PDF Online",
    "Trim PDF Pages",
    "Remove PDF Margins",
    "Crop PDF Document",
    "PDF Page Cropper",
    "Online PDF Crop Tool",
    "Free PDF Cropper",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-cropper",
  },

  openGraph: {
    title: "Crop PDF Online | ToolVoraa",
    description:
      "Remove unwanted margins and crop PDF pages online quickly and easily.",
    url: "https://www.toolvoraa.com/tools/pdf-cropper",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Crop PDF Online | ToolVoraa",
    description:
      "Trim margins and unwanted areas from PDF pages online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfCropperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}