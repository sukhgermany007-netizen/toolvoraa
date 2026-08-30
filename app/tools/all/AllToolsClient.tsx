"use client";

import { useMemo, useState } from "react";

type Category =
  | "Calculators"
  | "Business Tools"
  | "Business Name Tools"
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
    icon: "▦",
    category: "Calculators",
    description: "Calculate your exact age in years, months and days.",
  },
  {
    name: "Break-Even Calculator",
    href: "/tools/break-even-calculator",
    icon: "⌁",
    category: "Calculators",
    description: "Find the sales level needed to cover your business costs.",
  },
  {
    name: "Credit Card Payoff Calculator",
    href: "/tools/credit-card-payoff-calculator",
    icon: "▤",
    category: "Calculators",
    description: "Estimate how long it will take to pay off credit card debt.",
  },
  {
    name: "Discount Calculator",
    href: "/tools/discount-calculator",
    icon: "%",
    category: "Calculators",
    description: "Quickly calculate discounts, savings and final prices.",
  },
  {
    name: "EMI Calculator",
    href: "/tools/emi-calculator",
    icon: "₹",
    category: "Calculators",
    description: "Calculate monthly EMI, total interest and loan repayment.",
  },
  {
    name: "GST Calculator",
    href: "/tools/gst-calculator",
    icon: "％",
    category: "Calculators",
    description: "Calculate GST inclusive and exclusive amounts instantly.",
  },
  {
    name: "Investment Return Calculator",
    href: "/tools/investment-return-calculator",
    icon: "↗",
    category: "Calculators",
    description: "Estimate returns and growth on your investments.",
  },
  {
    name: "Loan Eligibility Calculator",
    href: "/tools/loan-eligibility-calculator",
    icon: "₹",
    category: "Calculators",
    description: "Estimate your eligible loan amount based on income.",
  },
  {
    name: "Markup Calculator",
    href: "/tools/markup-calculator",
    icon: "+",
    category: "Calculators",
    description: "Calculate markup percentage, selling price and profit.",
  },
  {
    name: "Percentage Calculator",
    href: "/tools/percentage-calculator",
    icon: "%",
    category: "Calculators",
    description: "Calculate percentages, increases, decreases and differences.",
  },
  {
    name: "Profit Calculator",
    href: "/tools/profit-calculator",
    icon: "↗",
    category: "Calculators",
    description: "Calculate profit, margin and business earnings quickly.",
  },
  {
    name: "Salary Calculator",
    href: "/tools/salary-calculator",
    icon: "₹",
    category: "Calculators",
    description: "Estimate salary, deductions and take-home income.",
  },
  {
    name: "SIP Calculator",
    href: "/tools/sip-calculator",
    icon: "⌁",
    category: "Calculators",
    description: "Estimate SIP investment growth and future value.",
  },

  // Business Tools
  {
    name: "Business Expense Tracker",
    href: "/tools/business-expense-tracker",
    icon: "▤",
    category: "Business Tools",
    description: "Track and organize your day-to-day business expenses.",
  },
  {
    name: "Invoice Generator",
    href: "/tools/invoice-generator",
    icon: "▧",
    category: "Business Tools",
    description: "Create professional invoices quickly and download or print.",
  },
  {
    name: "Quotation Generator",
    href: "/tools/quotation-generator",
    icon: "▨",
    category: "Business Tools",
    description: "Create professional quotations for customers and clients.",
  },

  // Business Name Tools
  {
    name: "AI Business Name Generator",
    href: "/tools/ai-business-name-generator",
    icon: "✦",
    category: "Business Name Tools",
    description: "Generate creative AI-powered business name ideas instantly.",
  },
  {
    name: "Business Name Generator",
    href: "/tools/business-name-generator",
    icon: "◉",
    category: "Business Name Tools",
    description: "Discover unique and memorable names for your business.",
  },

  // Image Tools
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    icon: "✦",
    category: "Image Tools",
    description: "Remove image backgrounds quickly for clean transparent results.",
  },
  {
    name: "Image Compressor",
    href: "/tools/image-compressor",
    icon: "⌘",
    category: "Image Tools",
    description: "Reduce image file size while preserving visual quality.",
  },
  {
    name: "Image Converter",
    href: "/tools/image-converter",
    icon: "⇄",
    category: "Image Tools",
    description: "Convert images between popular file formats online.",
  },
  {
    name: "Image Cropper",
    href: "/tools/image-cropper",
    icon: "⌗",
    category: "Image Tools",
    description: "Crop images easily to your preferred size and area.",
  },
  {
    name: "Image Resizer",
    href: "/tools/image-resizer",
    icon: "▣",
    category: "Image Tools",
    description: "Resize image dimensions quickly for web and social media.",
  },
  {
    name: "Image Rotator",
    href: "/tools/image-rotator",
    icon: "↻",
    category: "Image Tools",
    description: "Rotate images left, right or to a custom angle.",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    icon: "▧",
    category: "Image Tools",
    description: "Convert your images into a clean PDF document.",
  },
  {
    name: "Image to Text",
    href: "/tools/image-to-text",
    icon: "T",
    category: "Image Tools",
    description: "Extract readable text from images using OCR technology.",
  },
  {
    name: "Image Watermark",
    href: "/tools/image-watermark",
    icon: "◒",
    category: "Image Tools",
    description: "Add custom text watermarks to your images easily.",
  },

  // PDF Tools
  {
    name: "JPG to PDF",
    href: "/tools/jpg-to-pdf",
    icon: "▧",
    category: "PDF Tools",
    description: "Convert JPG images into a downloadable PDF file.",
  },
  {
    name: "PDF Compressor",
    href: "/tools/pdf-compressor",
    icon: "⇲",
    category: "PDF Tools",
    description: "Reduce PDF file size for easier sharing and storage.",
  },
  {
    name: "PDF Cropper",
    href: "/tools/pdf-cropper",
    icon: "⌗",
    category: "PDF Tools",
    description: "Crop unwanted areas from your PDF pages.",
  },
  {
    name: "PDF Extract Pages",
    href: "/tools/pdf-extract-pages",
    icon: "⇱",
    category: "PDF Tools",
    description: "Extract selected pages from a PDF into a new file.",
  },
  {
    name: "PDF Merge",
    href: "/tools/pdf-merge",
    icon: "⌘",
    category: "PDF Tools",
    description: "Combine multiple PDF documents into one PDF file.",
  },
  {
    name: "PDF Metadata Editor",
    href: "/tools/pdf-metadata",
    icon: "i",
    category: "PDF Tools",
    description: "View and edit important PDF document metadata.",
  },
  {
    name: "PDF OCR",
    href: "/tools/pdf-ocr",
    icon: "T",
    category: "PDF Tools",
    description: "Extract text from scanned PDF documents using OCR.",
  },
  {
    name: "PDF Organizer",
    href: "/tools/pdf-organizer",
    icon: "▦",
    category: "PDF Tools",
    description: "Rearrange and organize PDF pages in your preferred order.",
  },
  {
    name: "PDF Page Number",
    href: "/tools/pdf-page-number",
    icon: "#",
    category: "PDF Tools",
    description: "Add page numbers to PDF documents quickly.",
  },
  {
    name: "PDF Protect",
    href: "/tools/pdf-protect",
    icon: "▣",
    category: "PDF Tools",
    description: "Protect your PDF documents with password security.",
  },
  {
    name: "PDF Rotator",
    href: "/tools/pdf-rotator",
    icon: "↻",
    category: "PDF Tools",
    description: "Rotate individual or multiple PDF pages easily.",
  },
  {
    name: "PDF Splitter",
    href: "/tools/pdf-splitter",
    icon: "⇥",
    category: "PDF Tools",
    description: "Split a PDF into separate documents or pages.",
  },
  {
    name: "PDF Text Extractor",
    href: "/tools/pdf-text-extractor",
    icon: "T",
    category: "PDF Tools",
    description: "Extract text content from PDF files instantly.",
  },
  {
    name: "PDF to JPG",
    href: "/tools/pdf-to-jpg",
    icon: "▣",
    category: "PDF Tools",
    description: "Convert PDF pages into high-quality JPG images.",
  },
  {
    name: "PDF Unlock",
    href: "/tools/pdf-unlock",
    icon: "⌑",
    category: "PDF Tools",
    description: "Remove supported PDF restrictions from your own documents.",
  },
  {
    name: "PDF Watermark",
    href: "/tools/pdf-watermark",
    icon: "◒",
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
    icon: "▦",
    category: "SEO & Developer Tools",
    description: "Create QR codes for links, text and other information.",
  },
  {
    name: "Robots.txt Generator",
    href: "/tools/robots-txt-generator",
    icon: "⌘",
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
    icon: "◎",
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

const iconColors = [
  "text-purple-300 bg-purple-500/10 border-purple-500/20",
  "text-blue-300 bg-blue-500/10 border-blue-500/20",
  "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  "text-orange-300 bg-orange-500/10 border-orange-500/20",
  "text-rose-300 bg-rose-500/10 border-rose-500/20",
  "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
];

export default function AllToolsClient() {
  const [active, setActive] = useState<Category | "All Tools">("All Tools");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

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

          <a
            href="/tools/all"
            className="hidden rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 md:inline-flex"
          >
            Explore Tools →
          </a>

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

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {category.items.map((tool, index) => (
                      <a
                        key={tool.href}
                        href={tool.href}
                        className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-800 bg-[#091426] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-500/60 hover:bg-[#0b1830] hover:shadow-xl hover:shadow-purple-950/20"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <span
                            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-lg font-bold ${
                              iconColors[index % iconColors.length]
                            }`}
                          >
                            {tool.icon}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${category.badge}`}
                          >
                            {category.name}
                          </span>
                        </div>

                        <h3 className="text-base font-bold leading-6 text-slate-100 transition group-hover:text-purple-300">
                          {tool.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {tool.description}
                        </p>

                        <div className="mt-auto pt-5">
                          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                            <span className="text-sm font-semibold text-purple-400">
                              Open Tool
                            </span>

                            <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-purple-400">
                              →
                            </span>
                          </div>
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