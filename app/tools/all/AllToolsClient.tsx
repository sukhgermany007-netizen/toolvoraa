"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

type Category =
  | "Calculators"
  | "Business Tools"
  | "Business Name Tools"
  | "AI Tools"
  | "Image Tools"
  | "PDF Tools"
  | "SEO & Developer Tools";

type Tool = {
  name: string;
  href: string;
  icon: string;
  category: Category;
  description: string;
};

const tools: Tool[] = [
  // Calculators
  {
    name: "Age Calculator",
    href: "/tools/age-calculator",
    icon: "🎂",
    category: "Calculators",
    description: "Calculate your exact age in years, months and days.",
  },
  {
    name: "Break-Even Calculator",
    href: "/tools/break-even-calculator",
    icon: "📊",
    category: "Calculators",
    description: "Find the sales level needed to cover your business costs.",
  },
  {
    name: "Credit Card Payoff Calculator",
    href: "/tools/credit-card-payoff-calculator",
    icon: "💳",
    category: "Calculators",
    description: "Estimate how long it will take to pay off credit card debt.",
  },
  {
    name: "Discount Calculator",
    href: "/tools/discount-calculator",
    icon: "🏷️",
    category: "Calculators",
    description: "Quickly calculate discounts, savings and final prices.",
  },
  {
    name: "EMI Calculator",
    href: "/tools/emi-calculator",
    icon: "🧮",
    category: "Calculators",
    description: "Calculate monthly EMI, total interest and loan repayment.",
  },
  {
    name: "GST Calculator",
    href: "/tools/gst-calculator",
    icon: "🧾",
    category: "Calculators",
    description: "Calculate GST inclusive and exclusive amounts instantly.",
  },
  {
    name: "Investment Return Calculator",
    href: "/tools/investment-return-calculator",
    icon: "📈",
    category: "Calculators",
    description: "Estimate returns and growth on your investments.",
  },
  {
    name: "Loan Eligibility Calculator",
    href: "/tools/loan-eligibility-calculator",
    icon: "🏦",
    category: "Calculators",
    description: "Estimate your eligible loan amount based on income.",
  },
  {
    name: "Markup Calculator",
    href: "/tools/markup-calculator",
    icon: "📈",
    category: "Calculators",
    description: "Calculate markup percentage, selling price and profit.",
  },
  {
    name: "Percentage Calculator",
    href: "/tools/percentage-calculator",
    icon: "📊",
    category: "Calculators",
    description: "Calculate percentages, increases, decreases and differences.",
  },
  {
    name: "Profit Calculator",
    href: "/tools/profit-calculator",
    icon: "📈",
    category: "Calculators",
    description: "Calculate profit, margin and business earnings quickly.",
  },
  {
    name: "Salary Calculator",
    href: "/tools/salary-calculator",
    icon: "💰",
    category: "Calculators",
    description: "Estimate salary, deductions and take-home income.",
  },
  {
    name: "SIP Calculator",
    href: "/tools/sip-calculator",
    icon: "💰",
    category: "Calculators",
    description: "Estimate SIP investment growth and future value.",
  },

  // Business Tools
  {
    name: "Business Expense Tracker",
    href: "/tools/business-expense-tracker",
    icon: "💼",
    category: "Business Tools",
    description: "Track and organize your day-to-day business expenses.",
  },
  {
    name: "Invoice Generator",
    href: "/tools/invoice-generator",
    icon: "🧾",
    category: "Business Tools",
    description: "Create professional invoices quickly and download or print.",
  },
  {
    name: "Quotation Generator",
    href: "/tools/quotation-generator",
    icon: "📄",
    category: "Business Tools",
    description: "Create professional quotations for customers and clients.",
  },

  // Business Name Tools
  {
    name: "AI Business Name Generator",
    href: "/tools/ai-business-name-generator",
    icon: "🤖",
    category: "Business Name Tools",
    description: "Generate creative AI-powered business name ideas instantly.",
  },
  {
    name: "Business Name Generator",
    href: "/tools/business-name-generator",
    icon: "🤖",
    category: "Business Name Tools",
    description: "Discover unique and memorable names for your business.",
  },

  // AI Tools
  {
    name: "AI Resume Analyzer",
    href: "/tools/ai-resume-analyzer",
    icon: "📋",
    category: "AI Tools",
    description: "Analyze resumes with AI for ATS readiness, keywords and role alignment.",
  },
  {
    name: "AI PDF Summarizer",
    href: "/tools/ai-pdf-summarizer",
    icon: "📚",
    category: "AI Tools",
    description: "Summarize PDF documents with AI into key points and important details.",
  },
  {
    name: "AI Email Writer",
    href: "/tools/ai-email-writer",
    icon: "✉️",
    category: "AI Tools",
    description: "Write clear professional emails with AI for work and everyday communication.",
  },
  {
    name: "AI Reply Generator",
    href: "/tools/ai-reply-generator",
    icon: "💬",
    category: "AI Tools",
    description: "Generate polished replies for emails, messages and customer conversations.",
  },
  {
    name: "AI Product Description Generator",
    href: "/tools/ai-product-description-generator",
    icon: "🛍️",
    category: "AI Tools",
    description: "Create persuasive product descriptions for ecommerce and online stores.",
  },
  {
    name: "AI YouTube Title Generator",
    href: "/tools/ai-youtube-title-generator",
    icon: "▶️",
    category: "AI Tools",
    description: "Generate engaging YouTube titles designed to attract more clicks.",
  },
  {
    name: "AI Review Reply Generator",
    href: "/tools/ai-review-reply-generator",
    icon: "⭐",
    category: "AI Tools",
    description: "Create professional responses to positive, neutral and negative reviews.",
  },
  {
    name: "AI Complaint Letter Generator",
    href: "/tools/ai-complaint-letter-generator",
    icon: "📝",
    category: "AI Tools",
    description: "Draft clear and professional complaint letters with AI assistance.",
  },
  {
    name: "AI Study Notes Generator",
    href: "/tools/ai-study-notes-generator",
    icon: "🧠",
    category: "AI Tools",
    description: "Turn study topics and content into structured notes and revision points.",
  },
  {
    name: "AI SEO Meta Generator",
    href: "/tools/ai-seo-meta-generator",
    icon: "🔎",
    category: "AI Tools",
    description: "Generate SEO-friendly titles and meta descriptions for web pages.",
  },

  // Image Tools
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    icon: "✂️",
    category: "Image Tools",
    description: "Remove image backgrounds quickly for clean transparent results.",
  },
  {
    name: "Image Compressor",
    href: "/tools/image-compressor",
    icon: "🖼️",
    category: "Image Tools",
    description: "Reduce image file size while preserving visual quality.",
  },
  {
    name: "Image Converter",
    href: "/tools/image-converter",
    icon: "🔄",
    category: "Image Tools",
    description: "Convert images between popular file formats online.",
  },
  {
    name: "Image Cropper",
    href: "/tools/image-cropper",
    icon: "✂️",
    category: "Image Tools",
    description: "Crop images easily to your preferred size and area.",
  },
  {
    name: "Image Resizer",
    href: "/tools/image-resizer",
    icon: "🖼️",
    category: "Image Tools",
    description: "Resize image dimensions quickly for web and social media.",
  },
  {
    name: "Image Rotator",
    href: "/tools/image-rotator",
    icon: "🔄",
    category: "Image Tools",
    description: "Rotate images left, right or to a custom angle.",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    icon: "📄",
    category: "Image Tools",
    description: "Convert your images into a clean PDF document.",
  },
  {
    name: "Image to Text",
    href: "/tools/image-to-text",
    icon: "🖼️",
    category: "Image Tools",
    description: "Extract readable text from images using OCR technology.",
  },
  {
    name: "Image Watermark",
    href: "/tools/image-watermark",
    icon: "💧",
    category: "Image Tools",
    description: "Add custom text watermarks to your images easily.",
  },

  // PDF Tools
  {
    name: "JPG to PDF",
    href: "/tools/jpg-to-pdf",
    icon: "🖼️",
    category: "PDF Tools",
    description: "Convert JPG images into a downloadable PDF file.",
  },
  {
    name: "PDF Compressor",
    href: "/tools/pdf-compressor",
    icon: "📄",
    category: "PDF Tools",
    description: "Reduce PDF file size for easier sharing and storage.",
  },
  {
    name: "PDF Cropper",
    href: "/tools/pdf-cropper",
    icon: "📄",
    category: "PDF Tools",
    description: "Crop unwanted areas from your PDF pages.",
  },
  {
    name: "PDF Extract Pages",
    href: "/tools/pdf-extract-pages",
    icon: "📄",
    category: "PDF Tools",
    description: "Extract selected pages from a PDF into a new file.",
  },
  {
    name: "PDF Merge",
    href: "/tools/pdf-merge",
    icon: "📄",
    category: "PDF Tools",
    description: "Combine multiple PDF documents into one PDF file.",
  },
  {
    name: "PDF Metadata Editor",
    href: "/tools/pdf-metadata",
    icon: "📄",
    category: "PDF Tools",
    description: "View and edit important PDF document metadata.",
  },
  {
    name: "PDF OCR",
    href: "/tools/pdf-ocr",
    icon: "🔍",
    category: "PDF Tools",
    description: "Extract text from scanned PDF documents using OCR.",
  },
  {
    name: "PDF Organizer",
    href: "/tools/pdf-organizer",
    icon: "📄",
    category: "PDF Tools",
    description: "Rearrange and organize PDF pages in your preferred order.",
  },
  {
    name: "PDF Page Number",
    href: "/tools/pdf-page-number",
    icon: "📄",
    category: "PDF Tools",
    description: "Add page numbers to PDF documents quickly.",
  },
  {
    name: "PDF Protect",
    href: "/tools/pdf-protect",
    icon: "📄",
    category: "PDF Tools",
    description: "Protect your PDF documents with password security.",
  },
  {
    name: "PDF Rotator",
    href: "/tools/pdf-rotator",
    icon: "📄",
    category: "PDF Tools",
    description: "Rotate individual or multiple PDF pages easily.",
  },
  {
    name: "PDF Splitter",
    href: "/tools/pdf-splitter",
    icon: "📄",
    category: "PDF Tools",
    description: "Split a PDF into separate documents or pages.",
  },
  {
    name: "PDF Text Extractor",
    href: "/tools/pdf-text-extractor",
    icon: "📄",
    category: "PDF Tools",
    description: "Extract text content from PDF files instantly.",
  },
  {
    name: "PDF to JPG",
    href: "/tools/pdf-to-jpg",
    icon: "🖼️",
    category: "PDF Tools",
    description: "Convert PDF pages into high-quality JPG images.",
  },
  {
    name: "PDF Unlock",
    href: "/tools/pdf-unlock",
    icon: "🔓",
    category: "PDF Tools",
    description: "Remove supported PDF restrictions from your own documents.",
  },
  {
    name: "PDF Watermark",
    href: "/tools/pdf-watermark",
    icon: "📄",
    category: "PDF Tools",
    description: "Add custom watermarks to PDF pages quickly.",
  },

  // SEO & Developer Tools
  {
    name: "Keyword Density Checker",
    href: "/tools/keyword-density-checker",
    icon: "⌕",
    category: "SEO & Developer Tools",
    description: "Analyze keyword frequency and density within your content.",
  },
  {
    name: "QR Code Generator",
    href: "/tools/qr-generator",
    icon: "📱",
    category: "SEO & Developer Tools",
    description: "Create QR codes for links, text and other information.",
  },
  {
    name: "Robots.txt Generator",
    href: "/tools/robots-txt-generator",
    icon: "TXT",
    category: "SEO & Developer Tools",
    description: "Generate a robots.txt file for search engine crawlers.",
  },
  {
    name: "Schema Markup Generator",
    href: "/tools/schema-markup-generator",
    icon: "{}",
    category: "SEO & Developer Tools",
    description: "Create structured schema markup for your web pages.",
  },
  {
    name: "SEO Meta Tag Generator",
    href: "/tools/seo-meta-tag-generator",
    icon: "</>",
    category: "SEO & Developer Tools",
    description: "Generate optimized title and meta description tags.",
  },
  {
    name: "SERP Preview",
    href: "/tools/serp-preview",
    icon: "T",
    category: "SEO & Developer Tools",
    description: "Preview how your page may appear in search results.",
  },
];

const categories: {
  name: Category;
  icon: string;
  color: string;
  badge: string;
}[] = [
  {
    name: "Calculators",
    icon: "▦",
    color: "text-emerald-400 bg-emerald-400/10",
    badge: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    name: "Business Tools",
    icon: "▣",
    color: "text-violet-400 bg-violet-400/10",
    badge: "text-violet-300 bg-violet-400/10 border-violet-400/20",
  },
  {
    name: "Business Name Tools",
    icon: "✦",
    color: "text-purple-400 bg-purple-400/10",
    badge: "text-purple-300 bg-purple-400/10 border-purple-400/20",
  },
  {
    name: "AI Tools",
    icon: "✦",
    color: "text-blue-400 bg-blue-400/10",
    badge: "text-blue-300 bg-blue-400/10 border-blue-400/20",
  },
  {
    name: "Image Tools",
    icon: "▧",
    color: "text-orange-400 bg-orange-400/10",
    badge: "text-orange-300 bg-orange-400/10 border-orange-400/20",
  },
  {
    name: "PDF Tools",
    icon: "▤",
    color: "text-rose-400 bg-rose-400/10",
    badge: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  },
  {
    name: "SEO & Developer Tools",
    icon: "</>",
    color: "text-cyan-400 bg-cyan-400/10",
    badge: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
  },
];

const iconStyles = [
  {
    box: "bg-gradient-to-br from-violet-400 to-purple-600 border-violet-300/30 shadow-violet-950/30",
    accent: "text-violet-400",
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/25",
  },
  {
    box: "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300/30 shadow-emerald-950/30",
    accent: "text-emerald-400",
    badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  },
  {
    box: "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300/30 shadow-orange-950/30",
    accent: "text-orange-400",
    badge: "text-orange-300 bg-orange-500/10 border-orange-500/25",
  },
  {
    box: "bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300/30 shadow-pink-950/30",
    accent: "text-pink-400",
    badge: "text-pink-300 bg-pink-500/10 border-pink-500/25",
  },
  {
    box: "bg-gradient-to-br from-sky-400 to-blue-600 border-sky-300/30 shadow-blue-950/30",
    accent: "text-sky-400",
    badge: "text-sky-300 bg-sky-500/10 border-sky-500/25",
  },
  {
    box: "bg-gradient-to-br from-amber-300 to-amber-500 border-amber-200/30 shadow-amber-950/30",
    accent: "text-amber-400",
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/25",
  },
  {
    box: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 border-fuchsia-300/30 shadow-fuchsia-950/30",
    accent: "text-fuchsia-400",
    badge: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25",
  },
  {
    box: "bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300/30 shadow-cyan-950/30",
    accent: "text-cyan-400",
    badge: "text-cyan-300 bg-cyan-500/10 border-cyan-500/25",
  },
  {
    box: "bg-gradient-to-br from-lime-400 to-green-600 border-lime-300/30 shadow-green-950/30",
    accent: "text-lime-400",
    badge: "text-lime-300 bg-lime-500/10 border-lime-500/25",
  },
  {
    box: "bg-gradient-to-br from-rose-400 to-rose-600 border-rose-300/30 shadow-rose-950/30",
    accent: "text-rose-400",
    badge: "text-rose-300 bg-rose-500/10 border-rose-500/25",
  },
  {
    box: "bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-300/30 shadow-indigo-950/30",
    accent: "text-indigo-400",
    badge: "text-indigo-300 bg-indigo-500/10 border-indigo-500/25",
  },
  {
    box: "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-300/30 shadow-teal-950/30",
    accent: "text-teal-400",
    badge: "text-teal-300 bg-teal-500/10 border-teal-500/25",
  },
];

export default function AllToolsClient() {
  const [active, setActive] = useState<Category | "All Tools">("All Tools");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Supabase Auth
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setAuthLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMobileMenu(false);
    window.location.href = "/tools/all";
  }

  const userEmail = user?.email ?? "";
  const userInitial =
    userEmail.length > 0 ? userEmail.charAt(0).toUpperCase() : "U";

  const query = search.trim().toLowerCase();

  const grouped = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: tools.filter(
            (tool) =>
              tool.category === category.name &&
              (active === "All Tools" || active === category.name) &&
              (!query ||
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.category.toLowerCase().includes(query))
          ),
        }))
        .filter((category) => category.items.length > 0),
    [active, query]
  );

  const visibleCount = grouped.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const goTo = (category: Category | "All Tools") => {
    setActive(category);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* Main Website Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020817]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[73px] max-w-[1800px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight text-white"
          >
            Tool<span className="text-purple-400">Voraa</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="/" className="transition hover:text-purple-400">
              Home
            </a>

            <a
              href="/tools/all"
              className="font-semibold text-purple-400"
            >
              All Tools
            </a>

            <a
              href="/#pricing"
              className="transition hover:text-purple-400"
            >
              Pricing
            </a>

            <a
              href="/contact"
              className="transition hover:text-purple-400"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 md:flex">
            {authLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-800" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                    {userInitial}
                  </div>

                  <span
                    className="max-w-[150px] truncate text-sm text-slate-300"
                    title={userEmail}
                  >
                    {userEmail}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-purple-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-purple-400"
                >
                  Login
                </a>

                <a
                  href="/signup"
                  className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu((value) => !value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xl text-white md:hidden"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>

        {mobileMenu && (
          <nav className="flex flex-col gap-4 border-t border-slate-800 bg-[#050d1d] px-6 py-5 text-sm font-medium text-slate-300 md:hidden">
            <a href="/" onClick={() => setMobileMenu(false)}>
              Home
            </a>

            <a
              href="/tools/all"
              onClick={() => setMobileMenu(false)}
              className="text-purple-400"
            >
              All Tools
            </a>

            <a href="/#pricing" onClick={() => setMobileMenu(false)}>
              Pricing
            </a>

            <a href="/contact" onClick={() => setMobileMenu(false)}>
              Contact
            </a>

            <div className="mt-2 border-t border-slate-800 pt-4">
              {authLoading ? (
                <p className="text-slate-500">Loading account...</p>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                      {userInitial}
                    </div>

                    <span className="max-w-[230px] truncate text-slate-300">
                      {userEmail}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-left font-semibold transition hover:border-purple-500 hover:text-purple-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="rounded-lg border border-slate-700 px-4 py-3 text-center font-semibold transition hover:border-purple-500 hover:text-purple-400"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    onClick={() => setMobileMenu(false)}
                    className="rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-500"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      <div className="relative lg:pl-[270px]">
        {/* Desktop Sidebar */}
        <aside className="fixed bottom-0 left-0 top-[73px] z-40 hidden w-[270px] flex-col border-r border-white/5 bg-[#06132c] px-4 py-6 lg:flex">
          <div className="mb-5 px-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Browse Categories
            </p>
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => goTo("All Tools")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                active === "All Tools"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-950/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
                ⌂
              </span>

              <span className="flex-1">All Tools</span>

              <span className="text-xs opacity-70">{tools.length}</span>
            </button>

            {categories.map((category) => {
              const count = tools.filter(
                (tool) => tool.category === category.name
              ).length;

              return (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => goTo(category.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    active === category.name
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-950/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      active === category.name
                        ? "bg-white/15 text-white"
                        : category.color
                    }`}
                  >
                    {category.icon}
                  </span>

                  <span className="flex-1">{category.name}</span>

                  <span className="text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-7 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-white">
              <span className="text-amber-400">⚡</span>
              {tools.length} Free Online Tools
            </div>

            <p className="text-xs leading-5 text-slate-400">
              Fast, simple and free tools for everyday work.
            </p>
          </div>

          <a
            href="/"
            className="mt-auto px-4 py-3 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Home
          </a>
        </aside>

        {/* All Tools Top Area */}
        <div className="sticky top-[73px] z-30 border-b border-white/5 bg-[#071225]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="shrink-0">
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  All Tools
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Find the right free online tool in seconds.
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3 sm:flex-row xl:justify-end">
                <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-slate-700 bg-[#0b162b] px-4 transition focus-within:border-purple-500 sm:max-w-xl">
                  <span className="text-lg text-slate-500">⌕</span>

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tools..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-sm text-slate-500 transition hover:text-white"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </label>

                <div className="flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-slate-700 bg-[#0b162b] px-4 text-sm font-semibold text-slate-200">
                  <span className="mr-2 text-amber-400">⚡</span>
                  {visibleCount}{" "}
                  {visibleCount === 1 ? "Tool" : "Tools"}
                </div>
              </div>
            </div>

            {/* Mobile Category Selector */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              <button
                type="button"
                onClick={() => setActive("All Tools")}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  active === "All Tools"
                    ? "bg-purple-600 text-white"
                    : "border border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                All Tools
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => setActive(category.name)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    active === category.name
                      ? "bg-purple-600 text-white"
                      : "border border-slate-700 bg-slate-900 text-slate-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Content */}
        <div className="mx-auto min-h-[70vh] max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          {grouped.length > 0 ? (
            <div className="space-y-12">
              {grouped.map((category) => (
                <section key={category.name}>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-bold ${category.color}`}
                      >
                        {category.icon}
                      </span>

                      <div>
                        <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                          {category.name}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {category.items.length}{" "}
                          {category.items.length === 1 ? "tool" : "tools"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {category.items.map((tool) => (
                      <a
                        key={tool.href}
                        href={tool.href}
                        className="group flex min-h-[145px] flex-col rounded-xl border border-slate-700/70 bg-[#0b1428] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-[#0d1830]"
                      >
                        <div className="mb-4 text-[27px] leading-none">
                          {tool.icon}
                        </div>

                        <h3 className="text-[16px] font-bold leading-6 text-white">
                          {tool.name}
                        </h3>

                        <div className="mt-auto pt-3">
                          <span className="text-sm font-medium text-purple-400 transition group-hover:text-purple-300">
                            Open Tool →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#091426] px-6 py-20 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-purple-500/10 text-2xl text-purple-400">
                ⌕
              </div>

              <h2 className="text-xl font-bold text-white">
                No tools found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Try another search term or select All Tools.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActive("All Tools");
                }}
                className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Show All Tools
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-[#071225] px-6 py-8">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
            <span>© 2026 ToolVoraa</span>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/privacy"
                className="transition hover:text-purple-400"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="transition hover:text-purple-400"
              >
                Terms
              </a>

              <a
                href="/contact"
                className="transition hover:text-purple-400"
              >
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}