import type { Metadata } from "next";
import AllToolsClient from "./AllToolsClient";

export const metadata: Metadata = {
  title: "All Free Online Tools | ToolVoraa",
  description:
    "Explore 49 free online calculators, business tools, PDF tools, image tools, business name tools, SEO tools and developer utilities.",
  alternates: {
    canonical: "https://www.toolvoraa.com/tools/all",
  },
  openGraph: {
    title: "All Free Online Tools | ToolVoraa",
    description:
      "Explore 49 free online calculators, business tools, PDF tools, image tools, business name tools, SEO tools and developer utilities.",
    url: "https://www.toolvoraa.com/tools/all",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "All Free Online Tools | ToolVoraa",
    description:
      "Explore 49 free online calculators, business tools, PDF tools, image tools, business name tools, SEO tools and developer utilities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllToolsPage() {
  return <AllToolsClient />;
}
