"use client";

import { useMemo, useState } from "react";

type Category =
  | "Calculators"
  | "Business"
  | "PDF Tools"
  | "Image Tools"
  | "SEO & Developer"
  | "Name Tools";

type Tool = {
  name: string;
  href: string;
  icon: string;
  category: Category;
  description: string;
};

const tools: Tool[] = [
  { name: "Age Calculator", href: "/tools/age-calculator", icon: "🎂", category: "Calculators", description: "Calculate your exact age instantly." },
  { name: "Break-Even Calculator", href: "/tools/break-even-calculator", icon: "🎯", category: "Calculators", description: "Find your business break-even point." },
  { name: "Credit Card Payoff Calculator", href: "/tools/credit-card-payoff-calculator", icon: "💳", category: "Calculators", description: "Estimate payoff time and total interest." },
  { name: "Discount Calculator", href: "/tools/discount-calculator", icon: "🏷️", category: "Calculators", description: "Calculate sale price and total savings." },
  { name: "EMI Calculator", href: "/tools/emi-calculator", icon: "🧮", category: "Calculators", description: "Calculate loan EMI and total interest." },
  { name: "GST Calculator", href: "/tools/gst-calculator", icon: "％", category: "Calculators", description: "Add or remove GST from any amount." },
  { name: "Investment Return Calculator", href: "/tools/investment-return-calculator", icon: "📈", category: "Calculators", description: "Estimate returns on your investment." },
  { name: "Loan Eligibility Calculator", href: "/tools/loan-eligibility-calculator", icon: "🏦", category: "Calculators", description: "Check your estimated loan eligibility." },
  { name: "Markup Calculator", href: "/tools/markup-calculator", icon: "➕", category: "Calculators", description: "Calculate markup, cost and selling price." },
  { name: "Percentage Calculator", href: "/tools/percentage-calculator", icon: "📊", category: "Calculators", description: "Calculate percentages quickly and easily." },
  { name: "Salary Calculator", href: "/tools/salary-calculator", icon: "💵", category: "Calculators", description: "Calculate salary and take-home estimates." },
  { name: "SIP Calculator", href: "/tools/sip-calculator", icon: "📉", category: "Calculators", description: "Estimate returns from monthly SIPs." },

  { name: "Business Expense Tracker", href: "/tools/business-expense-tracker", icon: "📒", category: "Business", description: "Track and manage business expenses." },
  { name: "Invoice Generator", href: "/tools/invoice-generator", icon: "🧾", category: "Business", description: "Create professional GST invoices." },
  { name: "Profit Calculator", href: "/tools/profit-calculator", icon: "💰", category: "Business", description: "Calculate profit, loss and margin." },
  { name: "QR Code Generator", href: "/tools/qr-generator", icon: "🔳", category: "Business", description: "Generate a QR code for text or URLs." },
  { name: "Quotation Generator", href: "/tools/quotation-generator", icon: "📋", category: "Business", description: "Create professional business quotations." },

  { name: "JPG to PDF", href: "/tools/jpg-to-pdf", icon: "📄", category: "PDF Tools", description: "Convert JPG images into a PDF." },
  { name: "PDF Compressor", href: "/tools/pdf-compressor", icon: "🗜️", category: "PDF Tools", description: "Reduce PDF size while retaining quality." },
  { name: "PDF Cropper", href: "/tools/pdf-cropper", icon: "✂️", category: "PDF Tools", description: "Crop PDF pages online." },
  { name: "PDF Extract Pages", href: "/tools/pdf-extract-pages", icon: "📑", category: "PDF Tools", description: "Extract selected pages from a PDF." },
  { name: "PDF Merge", href: "/tools/pdf-merge", icon: "📎", category: "PDF Tools", description: "Merge multiple PDF files into one." },
  { name: "PDF Metadata", href: "/tools/pdf-metadata", icon: "ℹ️", category: "PDF Tools", description: "View and manage PDF metadata." },
  { name: "PDF OCR", href: "/tools/pdf-ocr", icon: "🔤", category: "PDF Tools", description: "Recognize text inside PDF documents." },
  { name: "PDF Organizer", href: "/tools/pdf-organizer", icon: "🗂️", category: "PDF Tools", description: "Reorder and organize PDF pages." },
  { name: "PDF Page Number", href: "/tools/pdf-page-number", icon: "🔢", category: "PDF Tools", description: "Add page numbers to your PDF." },
  { name: "PDF Protect", href: "/tools/pdf-protect", icon: "🔒", category: "PDF Tools", description: "Protect a PDF with a password." },
  { name: "PDF Rotator", href: "/tools/pdf-rotator", icon: "🔄", category: "PDF Tools", description: "Rotate PDF pages easily." },
  { name: "PDF Splitter", href: "/tools/pdf-splitter", icon: "➗", category: "PDF Tools", description: "Split a PDF into separate files." },
  { name: "PDF Text Extractor", href: "/tools/pdf-text-extractor", icon: "🔎", category: "PDF Tools", description: "Extract readable text from PDF files." },
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg", icon: "🖼️", category: "PDF Tools", description: "Convert PDF pages to JPG images." },
  { name: "PDF Unlock", href: "/tools/pdf-unlock", icon: "🔓", category: "PDF Tools", description: "Remove a password from your PDF." },
  { name: "PDF Watermark", href: "/tools/pdf-watermark", icon: "💧", category: "PDF Tools", description: "Add a custom watermark to PDF pages." },

  { name: "Background Remover", href: "/tools/background-remover", icon: "🪄", category: "Image Tools", description: "Remove an image background quickly." },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "🌄", category: "Image Tools", description: "Compress images without losing quality." },
  { name: "Image Converter", href: "/tools/image-converter", icon: "🔀", category: "Image Tools", description: "Convert images into another format." },
  { name: "Image Cropper", href: "/tools/image-cropper", icon: "✂️", category: "Image Tools", description: "Crop images to the perfect size." },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "↗️", category: "Image Tools", description: "Resize images to exact dimensions." },
  { name: "Image Rotator", href: "/tools/image-rotator", icon: "🔄", category: "Image Tools", description: "Rotate and flip images online." },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "📄", category: "Image Tools", description: "Turn images into a PDF document." },
  { name: "Image to Text", href: "/tools/image-to-text", icon: "📝", category: "Image Tools", description: "Extract text from an image." },
  { name: "Image Watermark", href: "/tools/image-watermark", icon: "💧", category: "Image Tools", description: "Add text or a logo watermark." },

  { name: "Keyword Density Checker", href: "/tools/keyword-density-checker", icon: "🔍", category: "SEO & Developer", description: "Check keyword frequency in your text." },
  { name: "Robots.txt Generator", href: "/tools/robots-txt-generator", icon: "🤖", category: "SEO & Developer", description: "Generate a robots.txt file." },
  { name: "Schema Markup Generator", href: "/tools/schema-markup-generator", icon: "{ }", category: "SEO & Developer", description: "Create structured data markup." },
  { name: "SEO Meta Tag Generator", href: "/tools/seo-meta-tag-generator", icon: "🏷️", category: "SEO & Developer", description: "Generate SEO-ready meta tags." },
  { name: "SERP Preview", href: "/tools/serp-preview", icon: "🌐", category: "SEO & Developer", description: "Preview your Google search result." },

  { name: "AI Business Name Generator", href: "/tools/ai-business-name-generator", icon: "🤖", category: "Name Tools", description: "Generate creative business names." },
  { name: "Business Name Generator", href: "/tools/business-name-generator", icon: "✨", category: "Name Tools", description: "Find a professional business name." },
];

const categories = [
  { name: "All Tools", icon: "▦" },
  { name: "Calculators", icon: "🧮" },
  { name: "Business", icon: "💼" },
  { name: "PDF Tools", icon: "📄" },
  { name: "Image Tools", icon: "🖼️" },
  { name: "SEO & Developer", icon: "</>" },
  { name: "Name Tools", icon: "👤" },
] as const;

const categoryStyle: Record<Category, string> = {
  Calculators: "border-violet-300/35 text-violet-300",
  Business: "border-emerald-200/35 text-emerald-200",
  "PDF Tools": "border-rose-200/35 text-rose-200",
  "Image Tools": "border-sky-200/35 text-sky-200",
  "SEO & Developer": "border-amber-100/35 text-amber-100",
  "Name Tools": "border-fuchsia-200/35 text-fuchsia-200",
};

export default function AllToolsPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["name"]>("All Tools");
  const [search, setSearch] = useState("");

  const visibleTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const categoryMatches = activeCategory === "All Tools" || tool.category === activeCategory;
      const searchMatches = !query || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query);
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            Tool<span className="text-purple-400">Voraa</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="/tools/all" className="border-b-2 border-purple-400 pb-1 text-purple-300">All Tools</a>
            <a href="/#categories" className="transition hover:text-purple-300">Categories</a>
            <a href="/#pricing" className="transition hover:text-purple-300">Pricing</a>
            <a href="/contact" className="transition hover:text-purple-300">Contact</a>
          </nav>
          <a href="#tool-grid" className="rounded-lg border border-purple-400/50 bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500">Get Started →</a>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pb-14 pt-12 text-center md:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Explore All Tools</h1>
          <p className="mt-4 text-base text-slate-400 md:text-lg">
            Access <span className="font-semibold text-purple-400">{tools.length} free online tools</span> to solve problems, save time, and boost productivity.
          </p>
          <label className="mx-auto mt-8 flex max-w-3xl items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/70 px-5 py-4 text-left shadow-xl shadow-purple-950/10 focus-within:border-purple-400">
            <span className="text-xl text-slate-500">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools by name, category or keyword..." className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="scrollbar-hide mb-7 flex gap-3 overflow-x-auto pb-2 lg:justify-center">
          {categories.map((category) => {
            const active = activeCategory === category.name;
            return (
              <button key={category.name} onClick={() => setActiveCategory(category.name)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition ${active ? "border-purple-400 bg-purple-600 text-white shadow-lg shadow-purple-900/30" : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-purple-400/60 hover:text-white"}`}>
                <span className="text-base">{category.icon}</span>{category.name}
              </button>
            );
          })}
        </div>

        <div id="tool-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTools.map((tool) => (
            <a key={tool.href} href={tool.href} className={`group flex min-h-48 flex-col rounded-2xl border bg-slate-900/75 p-6 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-950/20 ${categoryStyle[tool.category]}`}>
              <span className="text-[30px] leading-none" aria-hidden="true">{tool.icon}</span>
              <h2 className="mt-5 text-lg font-bold text-white">{tool.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{tool.description}</p>
              <div className="mt-auto flex items-end justify-between pt-5">
                <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-300">{tool.category}</span>
                <span className="text-sm font-semibold text-purple-300 transition group-hover:translate-x-1">Open Tool →</span>
              </div>
            </a>
          ))}
        </div>

        {visibleTools.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center text-slate-400">No matching tools found.</div>
        )}
      </section>
    </main>
  );
}
