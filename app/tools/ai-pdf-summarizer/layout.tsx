import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI PDF Summarizer Online | Summarize PDF Free - ToolVoraa",

  description:
    "Summarize PDF documents online with AI. Upload a PDF to generate clear summaries, key points, important details and action items quickly.",

  alternates: {
    canonical: "/tools/ai-pdf-summarizer",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI PDF Summarizer Online | ToolVoraa",
    description:
      "Upload a PDF and generate an AI-powered summary with key points, important details and action items.",
    url: "https://www.toolvoraa.com/tools/ai-pdf-summarizer",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "AI PDF Summarizer Online | ToolVoraa",
    description:
      "Summarize PDF documents with AI and extract key points, important details and action items.",
  },
};

export default function AIPdfSummarizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}