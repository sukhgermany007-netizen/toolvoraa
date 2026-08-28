import type { Metadata } from "next";
import AllToolsClient from "./AllToolsClient";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description:
    "Explore 49 free online calculators, PDF tools, image tools, business utilities and SEO tools available on ToolVoraa.",
  alternates: {
    canonical: "https://www.toolvoraa.com/tools/all",
  },
  openGraph: {
    title: "All Free Online Tools | ToolVoraa",
    description:
      "Explore free calculators, PDF tools, image utilities, business tools and SEO tools.",
    url: "https://www.toolvoraa.com/tools/all",
    siteName: "ToolVoraa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "All Free Online Tools | ToolVoraa",
    description:
      "Explore 49 free calculators, PDF tools, image utilities, business tools and SEO tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllToolsPage() {
  return <AllToolsClient />;
}
