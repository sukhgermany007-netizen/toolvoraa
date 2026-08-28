"use client";

import { useMemo, useState } from "react";

type Category = "Calculators" | "Business Tools" | "Business Name Tools" | "Image Tools" | "PDF Tools" | "SEO & Developer Tools";
type Tool = { name: string; href: string; icon: string; category: Category };

const tools: Tool[] = [
  { name: "Age Calculator", href: "/tools/age-calculator", icon: "▦", category: "Calculators" },
  { name: "Break-Even Calculator", href: "/tools/break-even-calculator", icon: "⌁", category: "Calculators" },
  { name: "Credit Card Payoff Calculator", href: "/tools/credit-card-payoff-calculator", icon: "▤", category: "Calculators" },
  { name: "Discount Calculator", href: "/tools/discount-calculator", icon: "%", category: "Calculators" },
  { name: "EMI Calculator", href: "/tools/emi-calculator", icon: "▦", category: "Calculators" },
  { name: "GST Calculator", href: "/tools/gst-calculator", icon: "％", category: "Calculators" },
  { name: "Investment Return Calculator", href: "/tools/investment-return-calculator", icon: "↗", category: "Calculators" },
  { name: "Loan Eligibility Calculator", href: "/tools/loan-eligibility-calculator", icon: "₹", category: "Calculators" },
  { name: "Markup Calculator", href: "/tools/markup-calculator", icon: "+", category: "Calculators" },
  { name: "Percentage Calculator", href: "/tools/percentage-calculator", icon: "%", category: "Calculators" },
  { name: "Profit Calculator", href: "/tools/profit-calculator", icon: "↗", category: "Calculators" },
  { name: "Salary Calculator", href: "/tools/salary-calculator", icon: "₹", category: "Calculators" },
  { name: "SIP Calculator", href: "/tools/sip-calculator", icon: "⌁", category: "Calculators" },

  { name: "Business Expense Tracker", href: "/tools/business-expense-tracker", icon: "▤", category: "Business Tools" },
  { name: "Invoice Generator", href: "/tools/invoice-generator", icon: "▧", category: "Business Tools" },
  { name: "Quotation Generator", href: "/tools/quotation-generator", icon: "▨", category: "Business Tools" },

  { name: "AI Business Name Generator", href: "/tools/ai-business-name-generator", icon: "✦", category: "Business Name Tools" },
  { name: "Business Name Generator", href: "/tools/business-name-generator", icon: "◉", category: "Business Name Tools" },

  { name: "Background Remover", href: "/tools/background-remover", icon: "✦", category: "Image Tools" },
  { name: "Image Compressor", href: "/tools/image-compressor", icon: "⌘", category: "Image Tools" },
  { name: "Image Converter", href: "/tools/image-converter", icon: "⇄", category: "Image Tools" },
  { name: "Image Cropper", href: "/tools/image-cropper", icon: "⌗", category: "Image Tools" },
  { name: "Image Resizer", href: "/tools/image-resizer", icon: "▣", category: "Image Tools" },
  { name: "Image Rotator", href: "/tools/image-rotator", icon: "↻", category: "Image Tools" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: "▧", category: "Image Tools" },
  { name: "Image to Text", href: "/tools/image-to-text", icon: "T", category: "Image Tools" },
  { name: "Image Watermark", href: "/tools/image-watermark", icon: "◒", category: "Image Tools" },

  { name: "JPG to PDF", href: "/tools/jpg-to-pdf", icon: "▧", category: "PDF Tools" },
  { name: "PDF Compressor", href: "/tools/pdf-compressor", icon: "⇲", category: "PDF Tools" },
  { name: "PDF Cropper", href: "/tools/pdf-cropper", icon: "⌗", category: "PDF Tools" },
  { name: "PDF Extract Pages", href: "/tools/pdf-extract-pages", icon: "⇱", category: "PDF Tools" },
  { name: "PDF Merge", href: "/tools/pdf-merge", icon: "⌘", category: "PDF Tools" },
  { name: "PDF Metadata Editor", href: "/tools/pdf-metadata", icon: "i", category: "PDF Tools" },
  { name: "PDF OCR", href: "/tools/pdf-ocr", icon: "T", category: "PDF Tools" },
  { name: "PDF Organizer", href: "/tools/pdf-organizer", icon: "▦", category: "PDF Tools" },
  { name: "PDF Page Number", href: "/tools/pdf-page-number", icon: "#", category: "PDF Tools" },
  { name: "PDF Protect", href: "/tools/pdf-protect", icon: "▣", category: "PDF Tools" },
  { name: "PDF Rotator", href: "/tools/pdf-rotator", icon: "↻", category: "PDF Tools" },
  { name: "PDF Splitter", href: "/tools/pdf-splitter", icon: "⇥", category: "PDF Tools" },
  { name: "PDF Text Extractor", href: "/tools/pdf-text-extractor", icon: "T", category: "PDF Tools" },
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg", icon: "▣", category: "PDF Tools" },
  { name: "PDF Unlock", href: "/tools/pdf-unlock", icon: "⌑", category: "PDF Tools" },
  { name: "PDF Watermark", href: "/tools/pdf-watermark", icon: "◒", category: "PDF Tools" },

  { name: "Keyword Density Checker", href: "/tools/keyword-density-checker", icon: "⌕", category: "SEO & Developer Tools" },
  { name: "QR Code Generator", href: "/tools/qr-generator", icon: "▦", category: "SEO & Developer Tools" },
  { name: "Robots.txt Generator", href: "/tools/robots-txt-generator", icon: "⌘", category: "SEO & Developer Tools" },
  { name: "Schema Markup Generator", href: "/tools/schema-markup-generator", icon: "{}", category: "SEO & Developer Tools" },
  { name: "SEO Meta Tag Generator", href: "/tools/seo-meta-tag-generator", icon: "</>", category: "SEO & Developer Tools" },
  { name: "SERP Preview", href: "/tools/serp-preview", icon: "◎", category: "SEO & Developer Tools" },
];

const categories: { name: Category; icon: string; color: string }[] = [
  { name: "Calculators", icon: "▦", color: "text-emerald-600 bg-emerald-50" },
  { name: "Business Tools", icon: "▣", color: "text-violet-600 bg-violet-50" },
  { name: "Business Name Tools", icon: "✦", color: "text-blue-600 bg-blue-50" },
  { name: "Image Tools", icon: "▧", color: "text-orange-600 bg-orange-50" },
  { name: "PDF Tools", icon: "▤", color: "text-rose-600 bg-rose-50" },
  { name: "SEO & Developer Tools", icon: "</>", color: "text-teal-600 bg-teal-50" },
];

const iconColors = [
  "text-emerald-600 bg-emerald-50",
  "text-violet-600 bg-violet-50",
  "text-blue-600 bg-blue-50",
  "text-orange-600 bg-orange-50",
  "text-rose-600 bg-rose-50",
  "text-teal-600 bg-teal-50",
];

export default function AllToolsPage() {
  const [active, setActive] = useState<Category | "All Tools">("All Tools");
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const grouped = useMemo(() => categories.map((category) => ({
    ...category,
    items: tools.filter((tool) =>
      tool.category === category.name &&
      (active === "All Tools" || active === category.name) &&
      (!query || tool.name.toLowerCase().includes(query))
    ),
  })).filter((category) => category.items.length), [active, query]);

  const goTo = (category: Category | "All Tools") => {
    setActive(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#061633] px-4 py-7 text-white lg:flex">
        <a href="/" className="px-2 text-2xl font-black tracking-tight">Tool<span className="text-blue-500">Voraa</span></a>
        <nav className="mt-8 space-y-2">
          <button onClick={() => goTo("All Tools")} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${active === "All Tools" ? "bg-blue-600" : "text-slate-200 hover:bg-white/10"}`}><span>⌂</span>All Tools</button>
          {categories.map((category) => <button key={category.name} onClick={() => goTo(category.name)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${active === category.name ? "bg-blue-600" : "text-slate-200 hover:bg-white/10"}`}><span className="w-5 text-center">{category.icon}</span>{category.name}</button>)}
        </nav>
        <div className="mt-8 rounded-lg border border-blue-400/30 px-4 py-3 text-sm font-bold"><span className="mr-2 text-amber-400">⚡</span>{tools.length} Free Online Tools</div>
        <a href="/" className="mt-auto px-4 text-sm text-slate-300 hover:text-white">← Back to Home</a>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4">
          <a href="/" className="text-xl font-black lg:hidden">Tool<span className="text-blue-600">Voraa</span></a>
          <h1 className="hidden text-3xl font-extrabold lg:block">All Tools</h1>
          <label className="ml-auto flex h-11 w-full max-w-xl items-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm focus-within:border-blue-500">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            <span className="text-slate-400">⌕</span>
          </label>
          <span className="hidden whitespace-nowrap rounded-lg border border-violet-200 px-4 py-3 text-sm font-semibold sm:block"><span className="mr-2 text-blue-600">⚡</span>{tools.length} Free Online Tools</span>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setActive("All Tools")} className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold ${active === "All Tools" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white"}`}>All Tools</button>
          {categories.map((category) => <button key={category.name} onClick={() => setActive(category.name)} className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold ${active === category.name ? "bg-blue-600 text-white" : "border border-slate-200 bg-white hover:border-blue-300"}`}>{category.name}</button>)}
        </div>

        <div className="space-y-10">
          {grouped.map((category) => (
            <section key={category.name}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-extrabold">{category.name}</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{category.items.length} tools</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {category.items.map((tool, index) => (
                  <a key={tool.href} href={tool.href} className="group flex min-h-20 items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-bold ${iconColors[index % iconColors.length]}`}>{tool.icon}</span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">{tool.name}</span>
                    <span className="ml-auto text-slate-300 group-hover:text-blue-500">›</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {!grouped.length && <div className="rounded-xl border border-slate-200 bg-white py-20 text-center text-slate-500">No matching tools found.</div>}
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 ToolVoraa</span>
          <div className="flex gap-6"><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a><a href="/terms" className="hover:text-blue-600">Terms</a><a href="/contact" className="hover:text-blue-600">Contact Us</a></div>
        </div>
      </footer>
    </main>
  );
}
