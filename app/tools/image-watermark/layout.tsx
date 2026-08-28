import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Watermark to Image Online - Free Watermark Tool",

  description:
    "Add a text watermark to images online for free with ToolVoraa. Customize the watermark and download your protected JPG, PNG or WebP image easily.",

  keywords: [
    "Image Watermark",
    "Add Watermark to Image",
    "Watermark Image Online",
    "Photo Watermark",
    "Text Watermark",
    "Watermark Maker",
    "Protect Images",
    "Free Watermark Tool",
    "Online Watermark Generator",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-watermark",
  },

  openGraph: {
    title: "Add Watermark to Image Online | ToolVoraa",
    description:
      "Add customized text watermarks to JPG, PNG and WebP images online for free.",
    url: "https://www.toolvoraa.com/tools/image-watermark",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image Watermark Tool | ToolVoraa",
    description:
      "Add text watermarks to your photos and images online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageWatermarkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}