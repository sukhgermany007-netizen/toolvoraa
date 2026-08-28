import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer Online - Resize Photos for Free",

  description:
    "Resize images online for free with ToolVoraa. Change image width and height, maintain aspect ratio and download resized JPG, PNG or WebP images.",

  keywords: [
    "Image Resizer",
    "Image Resizer Online",
    "Resize Image",
    "Resize Photo Online",
    "Photo Resizer",
    "Change Image Dimensions",
    "Resize JPG",
    "Resize PNG",
    "Free Image Resizer",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-resizer",
  },

  openGraph: {
    title: "Image Resizer Online | ToolVoraa",
    description:
      "Change image width and height and download resized photos online for free.",
    url: "https://www.toolvoraa.com/tools/image-resizer",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image Resizer Online | ToolVoraa",
    description:
      "Resize JPG, PNG and WebP images online quickly and for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageResizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}