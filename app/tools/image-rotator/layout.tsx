import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate Image Online - Free Image Rotator",

  description:
    "Rotate images online for free with ToolVoraa. Turn JPG, PNG and WebP photos left or right and download the correctly oriented image instantly.",

  keywords: [
    "Image Rotator",
    "Rotate Image Online",
    "Rotate Photo",
    "Rotate JPG",
    "Rotate PNG",
    "Turn Image Left",
    "Turn Image Right",
    "Free Image Rotator",
    "Fix Image Orientation",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-rotator",
  },

  openGraph: {
    title: "Rotate Image Online | ToolVoraa",
    description:
      "Rotate JPG, PNG and WebP images left or right online for free.",
    url: "https://www.toolvoraa.com/tools/image-rotator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Rotate Image Online | ToolVoraa",
    description:
      "Rotate photos and correct image orientation online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageRotatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}