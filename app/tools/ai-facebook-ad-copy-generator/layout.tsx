import type { Metadata } from "next";

// Preview deployment verification

export const metadata: Metadata = {
  title: "AI Facebook Ad Copy Generator (Pro) | ToolVoraa",
  description:
    "Generate professional Facebook ad copy with AI. Create primary text, headlines, descriptions and calls to action for campaigns with ToolVoraa Pro.",
  alternates: {
    canonical: "/tools/ai-facebook-ad-copy-generator",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Facebook Ad Copy Generator (Pro) | ToolVoraa",
    description:
      "Create polished Facebook ad copy for products, services, offers and lead campaigns with ToolVoraa Pro.",
    url: "https://www.toolvoraa.com/tools/ai-facebook-ad-copy-generator",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Facebook Ad Copy Generator (Pro) | ToolVoraa",
    description:
      "Generate primary text, headlines, descriptions and CTAs for Facebook ads with AI.",
  },
};

export default function FacebookAdCopyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
