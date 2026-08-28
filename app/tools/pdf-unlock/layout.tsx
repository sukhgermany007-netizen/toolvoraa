import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF Online - Remove PDF Password Protection",

  description:
    "Unlock password-protected PDF files online with ToolVoraa when you know the correct password. Remove supported restrictions and download the unlocked document.",

  keywords: [
    "Unlock PDF",
    "PDF Unlocker",
    "Remove PDF Password",
    "Unlock Password Protected PDF",
    "Remove PDF Protection",
    "Decrypt PDF Online",
    "Online PDF Unlock Tool",
    "PDF Password Remover",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/pdf-unlock",
  },

  openGraph: {
    title: "Unlock PDF Online | ToolVoraa",
    description:
      "Use the correct password to unlock a protected PDF document online.",
    url: "https://www.toolvoraa.com/tools/pdf-unlock",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Unlock PDF Online | ToolVoraa",
    description:
      "Unlock your password-protected PDF document online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfUnlockLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}