import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Remover Online - Remove Image Background",

  description:
    "Remove image backgrounds online for free with ToolVoraa. Create clean transparent-background images quickly and download the result easily.",

  keywords: [
    "Background Remover",
    "Remove Background Online",
    "Image Background Remover",
    "Free Background Remover",
    "Transparent Background Maker",
    "Remove Photo Background",
    "Online Background Remover",
    "Background Eraser",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/background-remover",
  },

  openGraph: {
    title: "Background Remover Online | ToolVoraa",
    description:
      "Remove photo backgrounds and create transparent images online for free with ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/background-remover",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Background Remover Online | ToolVoraa",
    description:
      "Remove image backgrounds online for free and download transparent images.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function BackgroundRemoverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}