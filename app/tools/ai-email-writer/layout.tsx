import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Email Writer Online | Professional Email Generator - ToolVoraa",

  description:
    "Write professional emails online with AI. Generate business, formal, friendly and persuasive emails quickly with customizable tone and length.",

  alternates: {
    canonical: "/tools/ai-email-writer",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Email Writer Online | ToolVoraa",
    description:
      "Generate clear and professional emails with AI for business, work and everyday communication.",
    url: "https://www.toolvoraa.com/tools/ai-email-writer",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "AI Email Writer Online | ToolVoraa",
    description:
      "Create professional emails with AI using your preferred tone, purpose and length.",
  },
};

export default function AIEmailWriterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}