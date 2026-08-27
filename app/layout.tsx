import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.toolvoraa.com"),

  title: {
    default: "ToolVoraa - Free Online Tools",
    template: "%s | ToolVoraa",
  },

  description:
    "ToolVoraa offers free online calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",

  keywords: [
    "ToolVoraa",
    "free online tools",
    "online tools",
    "free calculators",
    "online calculators",
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
      name: "ToolVoraa",
      url: "https://www.toolvoraa.com",
    },
  ],

  creator: "ToolVoraa",
  publisher: "ToolVoraa",

  category: "Technology",

  alternates: {
    canonical: "https://www.toolvoraa.com",
  },

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
    locale: "en_US",
    url: "https://www.toolvoraa.com",
    siteName: "ToolVoraa",

    title: "ToolVoraa - Free Online Tools",

    description:
      "Free online calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",
  },

  twitter: {
    card: "summary_large_image",

    title: "ToolVoraa - Free Online Tools",

    description:
      "Free online calculators, business tools, PDF tools, image tools, AI tools, SEO tools and developer utilities.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B7B9Q7VFWB"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B7B9Q7VFWB');
          `}
        </Script>
      </body>
    </html>
  );
}