import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Cropper Online - Crop Photos for Free",

  description:
    "Crop images online for free with ToolVoraa. Select the required area, adjust your photo and download the cropped image quickly and easily.",

  keywords: [
    "Image Cropper",
    "Image Cropper Online",
    "Crop Image",
    "Crop Photo Online",
    "Photo Cropper",
    "Free Image Cropper",
    "Online Photo Editor",
    "Crop JPG",
    "Crop PNG",
  ],

  alternates: {
    canonical: "https://www.toolvoraa.com/tools/image-cropper",
  },

  openGraph: {
    title: "Image Cropper Online | ToolVoraa",
    description:
      "Crop photos and images to the required area online for free with ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/image-cropper",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Image Cropper Online | ToolVoraa",
    description:
      "Crop JPG and PNG images online quickly and for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ImageCropperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}