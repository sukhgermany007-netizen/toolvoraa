import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Protect PDF Online - Encrypt PDF Files",

  description:
    "Protect PDF files with a password online using ToolVoraa. Encrypt your PDF document to help prevent unauthorized access and download the secured file.",

  keywords: [
    "Protect PDF",
    "Password Protect PDF",
    "Encrypt PDF Online",
    "Add Password to PDF",
    "Secure PDF File",
    "Lock PDF",
    "PDF Password Tool",
    "Online PDF Protection",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-protect",
  },

  openGraph: {
    title: "Password Protect PDF Online | ToolVoraa",
    description:
      "Encrypt and secure PDF documents with a password online.",
    url: "https://www.toolvoraa.com/tools/pdf-protect",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Password Protect PDF | ToolVoraa",
    description:
      "Add password protection to your PDF documents online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfProtectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}