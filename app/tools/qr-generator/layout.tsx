import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator Online - Create QR Codes",

  description:
    "Create QR codes online for free with ToolVoraa. Generate a downloadable QR code for text, website URLs and other information quickly and easily.",

  keywords: [
    "QR Code Generator",
    "Free QR Code Generator",
    "QR Code Generator Online",
    "Create QR Code",
    "URL QR Code Generator",
    "Text QR Code Generator",
    "Online QR Code Maker",
    "Download QR Code",
    "QR Generator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/qr-generator",
  },

  openGraph: {
    title: "Free QR Code Generator Online | ToolVoraa",
    description:
      "Generate and download QR codes for text and website links for free with ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/qr-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Free QR Code Generator Online | ToolVoraa",
    description:
      "Create and download free QR codes instantly with ToolVoraa.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function QrGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}