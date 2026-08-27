"use client";

import { useMemo, useState } from "react";

const tools = [
  // ================= AI / BUSINESS =================
  {
    icon: "🤖",
    title: "AI Business Name Generator",
    slug: "/tools/business-name-generator",
    category: "AI Tools",
  },
  {
    icon: "🧾",
    title: "Invoice Generator",
    slug: "/tools/invoice-generator",
    category: "Business Tools",
  },
  {
    icon: "📋",
    title: "Quotation Generator",
    slug: "/tools/quotation-generator",
    category: "Business Tools",
  },
  {
    icon: "💰",
    title: "Profit Calculator",
    slug: "/tools/profit-calculator",
    category: "Business Tools",
  },
  {
    icon: "💼",
    title: "Business Expense Tracker",
    slug: "/tools/business-expense-tracker",
    category: "Business Tools",
  },
  {
    icon: "🎯",
    title: "Break Even Calculator",
    slug: "/tools/break-even-calculator",
    category: "Business Tools",
  },
  {
    icon: "🏷️",
    title: "Discount Calculator",
    slug: "/tools/discount-calculator",
    category: "Business Tools",
  },
  {
    icon: "➕",
    title: "Markup Calculator",
    slug: "/tools/markup-calculator",
    category: "Business Tools",
  },

  // ================= CALCULATORS =================
  {
    icon: "🎂",
    title: "Age Calculator",
    slug: "/tools/age-calculator",
    category: "Calculators",
  },
  {
    icon: "🧮",
    title: "EMI Calculator",
    slug: "/tools/emi-calculator",
    category: "Calculators",
  },
  {
    icon: "🧾",
    title: "GST Calculator",
    slug: "/tools/gst-calculator",
    category: "Calculators",
  },
  {
    icon: "📊",
    title: "Percentage Calculator",
    slug: "/tools/percentage-calculator",
    category: "Calculators",
  },
  {
    icon: "💳",
    title: "Credit Card Payoff Calculator",
    slug: "/tools/credit-card-payoff-calculator",
    category: "Calculators",
  },
  {
    icon: "🏦",
    title: "Loan Eligibility Calculator",
    slug: "/tools/loan-eligibility-calculator",
    category: "Calculators",
  },
  {
    icon: "📈",
    title: "Investment Return Calculator",
    slug: "/tools/investment-return-calculator",
    category: "Calculators",
  },

  // ================= IMAGE TOOLS =================
  {
    icon: "🗜️",
    title: "Image Compressor",
    slug: "/tools/image-compressor",
    category: "Image Tools",
  },
  {
    icon: "🔄",
    title: "Image Converter",
    slug: "/tools/image-converter",
    category: "Image Tools",
  },
  {
    icon: "✂️",
    title: "Image Cropper",
    slug: "/tools/image-cropper",
    category: "Image Tools",
  },
  {
    icon: "📐",
    title: "Image Resizer",
    slug: "/tools/image-resizer",
    category: "Image Tools",
  },
  {
    icon: "🔃",
    title: "Image Rotator",
    slug: "/tools/image-rotator",
    category: "Image Tools",
  },
  {
    icon: "📄",
    title: "Image to PDF",
    slug: "/tools/image-to-pdf",
    category: "Image Tools",
  },
  {
    icon: "📝",
    title: "Image to Text",
    slug: "/tools/image-to-text",
    category: "Image Tools",
  },
  {
    icon: "💧",
    title: "Image Watermark",
    slug: "/tools/image-watermark",
    category: "Image Tools",
  },
  {
    icon: "🧹",
    title: "Background Remover",
    slug: "/tools/background-remover",
    category: "Image Tools",
  },

  // ================= PDF TOOLS =================
  {
    icon: "🗜️",
    title: "PDF Compressor",
    slug: "/tools/pdf-compressor",
    category: "PDF Tools",
  },
  {
    icon: "✂️",
    title: "PDF Cropper",
    slug: "/tools/pdf-cropper",
    category: "PDF Tools",
  },
  {
    icon: "📑",
    title: "PDF Extract Pages",
    slug: "/tools/pdf-extract-pages",
    category: "PDF Tools",
  },
  {
    icon: "🔀",
    title: "PDF Merge",
    slug: "/tools/pdf-merge",
    category: "PDF Tools",
  },
  {
    icon: "ℹ️",
    title: "PDF Metadata",
    slug: "/tools/pdf-metadata",
    category: "PDF Tools",
  },
  {
    icon: "🔎",
    title: "PDF OCR",
    slug: "/tools/pdf-ocr",
    category: "PDF Tools",
  },
  {
    icon: "🗂️",
    title: "PDF Organizer",
    slug: "/tools/pdf-organizer",
    category: "PDF Tools",
  },
  {
    icon: "🔢",
    title: "PDF Page Number",
    slug: "/tools/pdf-page-number",
    category: "PDF Tools",
  },
  {
    icon: "🔒",
    title: "PDF Protect",
    slug: "/tools/pdf-protect",
    category: "PDF Tools",
  },
  {
    icon: "🔄",
    title: "PDF Rotator",
    slug: "/tools/pdf-rotator",
    category: "PDF Tools",
  },
  {
    icon: "✂️",
    title: "PDF Splitter",
    slug: "/tools/pdf-splitter",
    category: "PDF Tools",
  },
  {
    icon: "📝",
    title: "PDF Text Extractor",
    slug: "/tools/pdf-text-extractor",
    category: "PDF Tools",
  },
  {
    icon: "🖼️",
    title: "PDF to JPG",
    slug: "/tools/pdf-to-jpg",
    category: "PDF Tools",
  },
  {
    icon: "🔓",
    title: "PDF Unlock",
    slug: "/tools/pdf-unlock",
    category: "PDF Tools",
  },
  {
    icon: "💧",
    title: "PDF Watermark",
    slug: "/tools/pdf-watermark",
    category: "PDF Tools",
  },

  // ================= JPG / PDF =================
  {
    icon: "📄",
    title: "JPG to PDF",
    slug: "/tools/jpg-to-pdf",
    category: "PDF & Image",
  },

  // ================= SEO / DEVELOPER =================
  {
    icon: "🔍",
    title: "Keyword Density Checker",
    slug: "/tools/keyword-density-checker",
    category: "SEO Tools",
  },
  {
    icon: "🤖",
    title: "Robots TXT Generator",
    slug: "/tools/robots-txt-generator",
    category: "Developer Tools",
  },
];

const categories = [
  "All",
  "AI Tools",
  "Business Tools",
  "Calculators",
  "Image Tools",
  "PDF Tools",
  "PDF & Image",
  "SEO Tools",
  "Developer Tools",
];

export default function AllToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-purple-500/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Tool<span className="text-purple-400">Hub</span>{" "}
            AI
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="/tools/all"
              className="text-purple-400"
            >
              All Tools
            </a>

            <a
              href="/#categories"
              className="transition hover:text-purple-400"
            >
              Categories
            </a>

            <a
              href="/#pricing"
              className="transition hover:text-purple-400"
            >
              Pricing
            </a>
          </nav>

          <a
            href="/"
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
          >
            Home
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            🧰 ToolHub AI Tools
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            All Tools
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              In One Place.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Explore our collection of online tools for business,
            calculators, images, PDFs, SEO and more.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 max-w-2xl">
            <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-purple-950/20 focus-within:border-purple-500">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a tool..."
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-white outline-none placeholder:text-slate-500"
              />

              <button
                onClick={() => {
                  const element =
                    document.getElementById("tool-list");

                  element?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="bg-purple-600 px-7 font-semibold transition hover:bg-purple-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TOOL DIRECTORY ================= */}
      <section
        id="tool-list"
        className="mx-auto max-w-7xl px-6 pb-24"
      >
        {/* Top Bar */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Explore Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredTools.length} tools available
            </p>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-950/20"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-purple-500/40 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Cards */}
        {filteredTools.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <a
                key={tool.slug}
                href={tool.slug}
                className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition duration-200 hover:-translate-y-1 hover:border-purple-500/60 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-950/20"
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl transition group-hover:scale-110">
                    {tool.icon}
                  </div>

                  <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] text-purple-300">
                    {tool.category}
                  </span>
                </div>

                <h3 className="mt-6 min-h-[48px] font-semibold leading-6 group-hover:text-purple-400">
                  {tool.title}
                </h3>

                <p className="mt-4 text-sm font-medium text-purple-400">
                  Open Tool →
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="text-5xl">🔍</div>

            <h3 className="mt-5 text-xl font-bold">
              No tool found
            </h3>

            <p className="mt-2 text-slate-500">
              Try another search term or select a different category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
            >
              Show All Tools
            </button>
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-slate-900 px-6 py-14 text-center shadow-2xl shadow-purple-950/10 md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            More tools. Less hassle.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            ToolHub AI brings useful online utilities together
            in one simple website.
          </p>

          <a
            href="/"
            className="mt-8 inline-block rounded-lg bg-purple-600 px-7 py-3 font-semibold shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
          >
            Back to Home →
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 ToolHub AI. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a
              href="/"
              className="hover:text-purple-400"
            >
              Home
            </a>

            <a
              href="/tools/all"
              className="hover:text-purple-400"
            >
              All Tools
            </a>

            <a
              href="/#pricing"
              className="hover:text-purple-400"
            >
              Pricing
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}