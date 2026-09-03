import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Complaint Letter Generator Online | Complaint Writer - ToolVoraa",

  description:
    "Generate clear and professional complaint letters with AI. Create formal complaints for products, services, businesses and customer support issues quickly.",

  alternates: {
    canonical:
      "/tools/ai-complaint-letter-generator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "AI Complaint Letter Generator Online | ToolVoraa",
    description:
      "Create clear, professional and well-structured complaint letters with AI.",
    url:
      "https://www.toolvoraa.com/tools/ai-complaint-letter-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "AI Complaint Letter Generator | ToolVoraa",
    description:
      "Generate professional complaint letters for products, services and customer issues with AI.",
  },
};

export default function AIComplaintLetterGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}