import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract PDF Pages Online - Save Selected PDF Pages",

  description:
    "Extract selected pages from a PDF online with ToolVoraa. Choose the pages you need and download them as a separate PDF document.",

  keywords: [
    "Extract PDF Pages",
    "PDF Page Extractor",
    "Extract Pages from PDF",
    "Save PDF Pages",
    "Separate PDF Pages",
    "Select PDF Pages",
    "Online PDF Extractor",
    "Free PDF Page Extractor",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/pdf-extract-pages",
  },

  openGraph: {
    title: "Extract PDF Pages Online | ToolVoraa",
    description:
      "Choose and extract selected pages from a PDF into a separate document.",
    url: "https://www.toolvoraa.com/tools/pdf-extract-pages",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Extract PDF Pages | ToolVoraa",
    description:
      "Extract and save selected pages from a PDF document online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfExtractPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}