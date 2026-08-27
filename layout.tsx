import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ToolHub AI - Free Online Tools",
    template: "%s | ToolHub AI",
  },

  description:
    "ToolHub AI offers free online tools including calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",

  keywords: [
    "ToolHub AI",
    "free online tools",
    "online tools",
    "free calculators",
    "business tools",
    "PDF tools",
    "image tools",
    "AI tools",
    "SEO tools",
    "developer tools",
    "EMI calculator",
    "GST calculator",
    "invoice generator",
    "PDF converter",
    "image compressor",
  ],

  authors: [
    {
      name: "ToolHub AI",
    },
  ],

  creator: "ToolHub AI",
  publisher: "ToolHub AI",

  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    title: "ToolHub AI - Free Online Tools",
    description:
      "Free online calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",
    siteName: "ToolHub AI",
  },

  twitter: {
    card: "summary_large_image",
    title: "ToolHub AI - Free Online Tools",
    description:
      "Free online calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}