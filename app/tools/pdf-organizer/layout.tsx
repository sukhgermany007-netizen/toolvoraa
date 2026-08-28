import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize PDF Pages Online - Reorder and Delete Pages",

  description:
    "Organize PDF pages online with ToolVoraa. Reorder, rearrange and remove unwanted pages, then download your updated PDF document.",

  keywords: [
    "PDF Organizer",
    "Organize PDF Pages",
    "Reorder PDF Pages",
    "Rearrange PDF Pages",
    "Delete PDF Pages",
    "PDF Page Organizer",
    "Sort PDF Pages",
    "Online PDF Organizer",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-organizer",
  },

  openGraph: {
    title: "Organize PDF Pages Online | ToolVoraa",
    description:
      "Reorder, rearrange and remove pages from PDF documents online.",
    url: "https://www.toolvoraa.com/tools/pdf-organizer",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PDF Organizer Online | ToolVoraa",
    description:
      "Reorder and remove PDF pages directly in your browser.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfOrganizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}