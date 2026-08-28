import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Metadata Editor Online - Edit PDF Information",

  description:
    "View and edit PDF metadata online with ToolVoraa. Update document title, author, subject and keywords, then download the updated PDF file.",

  keywords: [
    "PDF Metadata Editor",
    "Edit PDF Metadata",
    "View PDF Metadata",
    "Change PDF Author",
    "Change PDF Title",
    "PDF Properties Editor",
    "PDF Information Editor",
    "Online PDF Metadata Tool",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-metadata",
  },

  openGraph: {
    title: "PDF Metadata Editor Online | ToolVoraa",
    description:
      "View and update PDF title, author, subject and keyword information online.",
    url: "https://www.toolvoraa.com/tools/pdf-metadata",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PDF Metadata Editor | ToolVoraa",
    description:
      "View and edit PDF document information online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfMetadataLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}