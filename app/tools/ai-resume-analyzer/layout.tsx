import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Analyzer Online | ATS Resume Checker - ToolVoraa",

  description:
    "Analyze your resume with AI for ATS compatibility, keyword relevance, readability, strengths, weaknesses and target job role alignment.",

  alternates: {
    canonical: "/tools/ai-resume-analyzer",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Resume Analyzer Online | ToolVoraa",
    description:
      "Upload your PDF or DOCX resume and get AI-powered ATS, keyword, readability and job-role feedback.",
    url: "https://www.toolvoraa.com/tools/ai-resume-analyzer",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "AI Resume Analyzer Online | ToolVoraa",
    description:
      "Analyze your resume with AI for ATS, keywords, readability and job-role alignment.",
  },
};

export default function AIResumeAnalyzerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}