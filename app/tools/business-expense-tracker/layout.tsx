import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Expense Tracker Online - Track Expenses",

  description:
    "Track and manage business expenses online for free with ToolVoraa. Record expense details, organize spending and calculate total business expenses easily.",

  keywords: [
    "Business Expense Tracker",
    "Expense Tracker Online",
    "Business Expense Manager",
    "Small Business Expense Tracker",
    "Daily Expense Tracker",
    "Business Spending Tracker",
    "Free Expense Tracker",
    "Track Business Expenses",
  ],

  alternates: {
    canonical:
      "https://www.toolvoraa.com/tools/business-expense-tracker",
  },

  openGraph: {
    title: "Business Expense Tracker Online | ToolVoraa",
    description:
      "Record, organize and calculate your business expenses online for free with ToolVoraa.",
    url: "https://www.toolvoraa.com/tools/business-expense-tracker",
    siteName: "ToolVoraa",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Business Expense Tracker | ToolVoraa",
    description:
      "Track and calculate your business expenses online for free.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function BusinessExpenseTrackerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}