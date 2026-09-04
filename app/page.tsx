"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

const tools = [
  {
    icon: "🧾",
    title: "Invoice Generator",
    slug: "/tools/invoice-generator",
    category: "Business",
  },
  {
    icon: "🧮",
    title: "EMI Calculator",
    slug: "/tools/emi-calculator",
    category: "Calculator",
  },
  {
    icon: "📊",
    title: "Percentage Calculator",
    slug: "/tools/percentage-calculator",
    category: "Calculator",
  },
  {
    icon: "🔳",
    title: "QR Code Generator",
    slug: "/tools/qr-generator",
    category: "Utility",
  },
  {
    icon: "🤖",
    title: "AI Business Name Generator",
    slug: "/tools/ai-business-name-generator",
    category: "AI",
  },
  {
    icon: "💰",
    title: "Profit Calculator",
    slug: "/tools/profit-calculator",
    category: "Business",
  },
  {
    icon: "📋",
    title: "Quotation Generator",
    slug: "/tools/quotation-generator",
    category: "Business",
  },
  {
    icon: "🧮",
    title: "GST Calculator",
    slug: "/tools/gst-calculator",
    category: "Calculator",
  },
  {
    icon: "💳",
    title: "Credit Card Payoff Calculator",
    slug: "/tools/credit-card-payoff-calculator",
    category: "Calculator",
  },
  {
    icon: "🏦",
    title: "Loan Eligibility Calculator",
    slug: "/tools/loan-eligibility-calculator",
    category: "Calculator",
  },
  {
    icon: "📈",
    title: "Investment Return Calculator",
    slug: "/tools/investment-return-calculator",
    category: "Calculator",
  },
  {
    icon: "🎯",
    title: "Break Even Calculator",
    slug: "/tools/break-even-calculator",
    category: "Business",
  },
  {
    icon: "💼",
    title: "Business Expense Tracker",
    slug: "/tools/business-expense-tracker",
    category: "Business",
  },
  {
    icon: "🏷️",
    title: "Discount Calculator",
    slug: "/tools/discount-calculator",
    category: "Business",
  },
  {
    icon: "➕",
    title: "Markup Calculator",
    slug: "/tools/markup-calculator",
    category: "Business",
  },
  {
    icon: "🎂",
    title: "Age Calculator",
    slug: "/tools/age-calculator",
    category: "Utility",
  },
  {
    icon: "🖼️",
    title: "Image Compressor",
    slug: "/tools/image-compressor",
    category: "Image",
  },
  {
    icon: "📐",
    title: "Image Resizer",
    slug: "/tools/image-resizer",
    category: "Image",
  },
  {
    icon: "✂️",
    title: "Image Cropper",
    slug: "/tools/image-cropper",
    category: "Image",
  },
  {
    icon: "🔄",
    title: "Image Rotator",
    slug: "/tools/image-rotator",
    category: "Image",
  },
  {
    icon: "📝",
    title: "Image to Text",
    slug: "/tools/image-to-text",
    category: "Image",
  },
  {
    icon: "💧",
    title: "Image Watermark",
    slug: "/tools/image-watermark",
    category: "Image",
  },
  {
    icon: "🔀",
    title: "Image Converter",
    slug: "/tools/image-converter",
    category: "Image",
  },
  {
    icon: "🧹",
    title: "Background Remover",
    slug: "/tools/background-remover",
    category: "Image",
  },
  {
    icon: "📄",
    title: "JPG to PDF",
    slug: "/tools/jpg-to-pdf",
    category: "PDF",
  },
  {
    icon: "📄",
    title: "PDF Merge",
    slug: "/tools/pdf-merge",
    category: "PDF",
  },
  {
    icon: "🗜️",
    title: "PDF Compressor",
    slug: "/tools/pdf-compressor",
    category: "PDF",
  },
  {
    icon: "✂️",
    title: "PDF Cropper",
    slug: "/tools/pdf-cropper",
    category: "PDF",
  },
  {
    icon: "📑",
    title: "PDF Extract Pages",
    slug: "/tools/pdf-extract-pages",
    category: "PDF",
  },
  {
    icon: "🔢",
    title: "PDF Page Number",
    slug: "/tools/pdf-page-number",
    category: "PDF",
  },
  {
    icon: "🔄",
    title: "PDF Rotator",
    slug: "/tools/pdf-rotator",
    category: "PDF",
  },
  {
    icon: "🔓",
    title: "PDF Unlock",
    slug: "/tools/pdf-unlock",
    category: "PDF",
  },
  {
    icon: "🔒",
    title: "PDF Protect",
    slug: "/tools/pdf-protect",
    category: "PDF",
  },
  {
    icon: "💧",
    title: "PDF Watermark",
    slug: "/tools/pdf-watermark",
    category: "PDF",
  },
  {
    icon: "🗂️",
    title: "PDF Organizer",
    slug: "/tools/pdf-organizer",
    category: "PDF",
  },
  {
    icon: "✂️",
    title: "PDF Splitter",
    slug: "/tools/pdf-splitter",
    category: "PDF",
  },
  {
    icon: "🔎",
    title: "PDF Text Extractor",
    slug: "/tools/pdf-text-extractor",
    category: "PDF",
  },
  {
    icon: "🖼️",
    title: "PDF to JPG",
    slug: "/tools/pdf-to-jpg",
    category: "PDF",
  },
  {
    icon: "🔍",
    title: "Keyword Density Checker",
    slug: "/tools/keyword-density-checker",
    category: "SEO",
  },
  {
    icon: "🤖",
    title: "Robots TXT Generator",
    slug: "/tools/robots-txt-generator",
    category: "Developer",
  },
];

const categories = [
  {
    icon: "🤖",
    title: "AI Tools",
    description: "Smart AI tools for content and business",
    category: "AI",
  },
  {
    icon: "🧮",
    title: "Calculators",
    description: "Useful calculators for everyday needs",
    category: "Calculator",
  },
  {
    icon: "💼",
    title: "Business Tools",
    description: "Tools to manage and grow your business",
    category: "Business",
  },
  {
    icon: "📄",
    title: "PDF Tools",
    description: "Simple and powerful PDF utilities",
    category: "PDF",
  },
  {
    icon: "🛠️",
    title: "Developer Tools",
    description: "Helpful utilities for developers and websites",
    category: "Developer",
  },
  {
    icon: "🖼️",
    title: "Image Tools",
    description: "Resize, compress and convert images",
    category: "Image",
  },
];

export default function Home() {
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
    window.location.href = "/";
  }

  const userEmail = user?.email ?? "";
  const userInitial =
    userEmail.length > 0 ? userEmail.charAt(0).toUpperCase() : "U";

  const filteredTools = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(value) ||
        tool.category.toLowerCase().includes(value)
    );
  }, [search]);

  const popularTools = tools.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-purple-500/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="text-white">Tool</span>
            <span className="text-purple-400">Voraa</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="/"
              className="font-medium text-white transition hover:text-purple-400"
            >
              Home
            </a>

            <a
              href="/tools/all"
              className="transition hover:text-purple-400"
            >
              All Tools
            </a>

            <a
              href="#pricing"
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
                  className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xl transition hover:border-purple-500 md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5 text-sm text-slate-300">
              <a
                href="/"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-white hover:text-purple-400"
              >
                Home
              </a>

              <a
                href="/tools/all"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                All Tools
              </a>

              <a
                href="#pricing"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                Pricing
              </a>

              <a
                href="/contact"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                Contact
              </a>

              <div className="border-t border-slate-800 pt-4">
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

              <a
                href="/tools/all"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg bg-purple-600 px-5 py-3 text-center font-semibold"
              >
                Explore Tools →
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 py-24 text-center md:py-32">
        {/* Purple Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          {/* Badge */}
          <div className="mb-7 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 shadow-lg shadow-purple-950/20">
            🚀 49 useful online tools
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            Powerful Tools.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              One Simple Website.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            AI tools, calculators, business utilities, PDF tools,
            image tools and developer utilities — all in one place.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-10 max-w-2xl">
            <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-purple-950/20 focus-within:border-purple-500">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search for a tool..."
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-white outline-none placeholder:text-slate-500"
              />

              <button
                onClick={() =>
                  document
                    .getElementById("search-results")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-purple-600 px-7 font-semibold transition hover:bg-purple-500"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {search && (
              <div
                id="search-results"
                className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-left shadow-2xl shadow-purple-950/30"
              >
                {filteredTools.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto p-2">
                    {filteredTools.map((tool) => (
                      <a
                        key={tool.slug}
                        href={tool.slug}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-purple-500/10"
                      >
                        <span className="text-2xl">
                          {tool.icon}
                        </span>

                        <div>
                          <div className="font-medium">
                            {tool.title}
                          </div>

                          <div className="text-xs text-slate-500">
                            {tool.category}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-sm text-slate-400">
                    No matching tool found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Small Features */}
          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
            <span>✓ Free tools</span>
            <span>•</span>
            <span>✓ Easy to use</span>
            <span>•</span>
            <span>✓ No installation</span>
          </div>
        </div>
      </section>

      {/* ================= POPULAR TOOLS ================= */}
      <section
        id="tools"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
            Featured
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Popular Tools
          </h2>

          <p className="mt-2 text-slate-400">
            Start with some of our most useful tools.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <a
              key={tool.slug}
              href={tool.slug}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition duration-200 hover:-translate-y-1 hover:border-purple-500/60 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-950/20"
            >
              <div className="text-3xl transition group-hover:scale-110">
                {tool.icon}
              </div>

              <h3 className="mt-5 font-semibold group-hover:text-purple-400">
                {tool.title}
              </h3>

              <p className="mt-3 text-sm text-purple-400">
                Open Tool →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section
        id="categories"
        className="border-y border-slate-800/80 bg-slate-950/80 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
              Explore
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Explore Tool Categories
            </h2>

            <p className="mt-3 text-slate-400">
              Find the right tool quickly and get your work done.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryTools = tools
                .filter(
                  (tool) =>
                    tool.category === category.category
                )
                .slice(0, 5);

              return (
                <div
                  key={category.title}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-200 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/10"
                >
                  <div className="text-4xl transition group-hover:scale-110">
                    {category.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {category.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    {categoryTools.length > 0 ? (
                      categoryTools.map((tool) => (
                        <a
                          key={tool.slug}
                          href={tool.slug}
                          className="block rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-purple-600/20 hover:text-white"
                        >
                          {tool.title}
                        </a>
                      ))
                    ) : (
                      <div className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-500">
                        More tools coming soon
                      </div>
                    )}
                  </div>

                  <a
                    href="/tools/all"
                    className="mt-5 inline-block text-sm font-medium text-purple-400 hover:text-purple-300"
                  >
                    Explore more →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHY TOOLHUB ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-purple-950/10 md:p-12">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
              Why ToolVoraa?
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Everything you need, in one place.
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-3xl">⚡</div>

              <h3 className="mt-4 text-lg font-bold">
                Fast & Simple
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Simple interfaces designed to help you finish
                tasks quickly.
              </p>
            </div>

            <div>
              <div className="text-3xl">🧰</div>

              <h3 className="mt-4 text-lg font-bold">
                All in One Place
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Business, PDF, image, calculator and AI utilities
                under one website.
              </p>
            </div>

            <div>
              <div className="text-3xl">📱</div>

              <h3 className="mt-4 text-lg font-bold">
                Works Everywhere
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Responsive design for desktop, tablet and mobile
                users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section
        id="pricing"
        className="border-t border-slate-800 px-6 py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
            Pricing
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Simple Pricing
          </h2>

          <p className="mt-3 text-slate-400">
            Start free. Premium features can be added later.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition hover:border-purple-500/40">
              <h3 className="text-xl font-bold">
                Free
              </h3>

              <p className="mt-4 text-4xl font-bold">
                ₹0
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Forever free
              </p>

              <ul className="mt-6 space-y-3 text-slate-300">
                <li>✓ Basic tools</li>
                <li>✓ Calculators</li>
                <li>✓ PDF utilities</li>
                <li>✓ Image utilities</li>
              </ul>

              <a
                href="#tools"
                className="mt-8 block w-full rounded-lg border border-slate-700 py-3 text-center font-semibold transition hover:border-purple-500 hover:bg-purple-500/10"
              >
                Start Free
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-purple-500/60 bg-purple-600/10 p-8 text-left shadow-xl shadow-purple-950/20">
              <div className="absolute right-6 top-6 rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-300">
                COMING SOON
              </div>

              <h3 className="text-xl font-bold">
                Pro
              </h3>

              <p className="mt-4 text-4xl font-bold">
                ₹299
                <span className="text-base text-slate-400">
                  /month
                </span>
              </p>

              <ul className="mt-6 space-y-3 text-slate-300">
                <li>✓ All tools</li>
                <li>✓ More AI generations</li>
                <li>✓ Saved history</li>
                <li>✓ Premium features</li>
              </ul>

              <button
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-lg bg-purple-600/40 py-3 font-semibold text-purple-200"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-slate-900 px-6 py-14 text-center md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Find the right tool for your work.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Explore ToolVoraa and use simple online tools without
            installing complicated software.
          </p>

          <a
            href="/tools/all"
            className="mt-8 inline-block rounded-lg bg-purple-600 px-7 py-3 font-semibold shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
          >
            Explore All Tools →
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div>
              <a
                href="/"
                className="text-xl font-extrabold"
              >
                <span className="text-white">Tool</span>
                <span className="text-purple-400">Voraa</span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                Simple online tools for business, productivity,
                images, PDFs and more.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold text-white">
                Tools
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a
                  href="#tools"
                  className="block hover:text-purple-400"
                >
                  Popular Tools
                </a>

                <a
                  href="#categories"
                  className="block hover:text-purple-400"
                >
                  Categories
                </a>

                <a
                  href="#pricing"
                  className="block hover:text-purple-400"
                >
                  Pricing
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-white">
                Categories
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a
                  href="#categories"
                  className="block hover:text-purple-400"
                >
                  AI Tools
                </a>

                <a
                  href="#categories"
                  className="block hover:text-purple-400"
                >
                  PDF Tools
                </a>

                <a
                  href="#categories"
                  className="block hover:text-purple-400"
                >
                  Image Tools
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white">
                Company
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a
                  href="/privacy"
                  className="block hover:text-purple-400"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="block hover:text-purple-400"
                >
                  Terms of Service
                </a>

                <a
                  href="/contact"
                  className="block hover:text-purple-400"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-600">
            © 2026 ToolVoraa. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
