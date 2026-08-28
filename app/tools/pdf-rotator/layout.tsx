import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online - Free PDF Rotator",

  description:
    "Rotate PDF pages online with ToolVoraa. Turn pages clockwise or counterclockwise, correct their orientation and download the updated PDF document.",

  keywords: [
    "Rotate PDF",
    "PDF Rotator",
    "Rotate PDF Pages",
    "Rotate PDF Online",
    "Turn PDF Pages",
    "Fix PDF Orientation",
    "Rotate PDF Clockwise",
    "Free PDF Rotator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-rotator",
  },

  openGraph: {
    title: "Rotate PDF Pages Online | ToolVoraa",
    description:
      "Rotate PDF pages and correct their orientation online.",
    url: "https://www.toolvoraa.com/tools/pdf-rotator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Rotate PDF Pages | ToolVoraa",
    description:
      "Turn PDF pages clockwise or counterclockwise online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfRotatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}