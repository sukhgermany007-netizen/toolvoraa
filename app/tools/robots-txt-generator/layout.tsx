import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robots.txt Generator Online - Create Robots.txt File",

  description:
    "Create a robots.txt file for your website with ToolVoraa's free Robots.txt Generator. Control crawler access and add your sitemap URL easily.",

  keywords: [
    "Robots.txt Generator",
    "Robots TXT Generator",
    "Create Robots.txt",
    "Robots.txt File Generator",
    "SEO Robots.txt Tool",
    "Website Crawler Rules",
    "Sitemap Robots.txt",
    "Free Robots.txt Generator",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/robots-txt-generator",
  },

  openGraph: {
    title: "Robots.txt Generator Online | ToolVoraa",
    description:
      "Generate crawler rules and a robots.txt file for your website.",
    url: "https://www.toolvoraa.com/tools/robots-txt-generator",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Robots.txt Generator | ToolVoraa",
    description:
      "Create a robots.txt file and crawler rules for your website.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RobotsTxtGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}