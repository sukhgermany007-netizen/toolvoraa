import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hindi & Punjabi Caption Generator (Pro) | ToolVoraa",
  description:
    "Generate natural Hindi, Punjabi, Hinglish and Punjabi-English social media captions with AI using ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-hindi-punjabi-caption-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Hindi & Punjabi Caption Generator (Pro) | ToolVoraa",
    description:
      "Create natural regional-language captions for Instagram, Facebook and short-form social content.",
    url: "https://www.toolvoraa.com/tools/ai-hindi-punjabi-caption-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hindi & Punjabi Caption Generator (Pro) | ToolVoraa",
    description:
      "Generate natural Hindi, Punjabi and mixed-language social captions with AI.",
  },
};

export default function HindiPunjabiCaptionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
