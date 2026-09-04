"use client";

import Link from "next/link";
import { useState } from "react";

type BillingType = "monthly" | "yearly";

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingType>("monthly");

  const proPrice = billing === "monthly" ? "₹199" : "₹1,499";
  const proPeriod = billing === "monthly" ? "/ month" : "/ year";

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
              T
            </div>

            <span className="text-xl font-bold tracking-tight">
              ToolVoraa
            </span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link
              href="/"
              className="transition hover:text-violet-600"
            >
              Home
            </Link>

            <Link
              href="/tools/all"
              className="transition hover:text-violet-600"
            >
              All Tools
            </Link>

            <Link
              href="/pricing"
              className="font-semibold text-violet-600"
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              className="hidden transition hover:text-violet-600 sm:block"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-10 pt-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700">
            Simple & transparent pricing
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Choose the right plan for you
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Use ToolVoraa&apos;s everyday tools for free and upgrade
            when you need higher AI limits and a cleaner,
            ad-free experience.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                billing === "monthly"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                billing === "yearly"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                SAVE
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                ⚡
              </div>

              <h2 className="text-2xl font-bold">
                Free
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Great for everyday calculations, PDF, image,
                business and occasional AI use.
              </p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-extrabold tracking-tight">
                ₹0
              </span>

              <span className="ml-2 text-slate-500">
                forever
              </span>
            </div>

            <Link
              href="/tools/all"
              className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              Use Free Tools
            </Link>

            <div className="my-8 h-px bg-slate-100" />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-800">
              What&apos;s included
            </h3>

            <div className="space-y-4">
              <Feature text="Access to standard ToolVoraa tools" />
              <Feature text="Calculators & business tools" />
              <Feature text="PDF & image utilities" />
              <Feature text="SEO & developer tools" />
              <Feature text="Up to 5 text AI generations per day*" />
              <Feature text="1 AI Resume Analysis per day*" />
              <Feature text="1 AI PDF Summary per day*" />
              <Feature text="Standard processing limits" />
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-400">
              *Daily account-based AI quotas will become active when
              the ToolVoraa account system launches.
            </p>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl border-2 border-violet-600 bg-white p-7 shadow-xl shadow-violet-100 sm:p-9">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="whitespace-nowrap rounded-full bg-violet-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                Most Popular
              </span>
            </div>

            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                ✦
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  Pro
                </h2>

                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">
                  PRO
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                For users who need ToolVoraa&apos;s AI tools more
                frequently.
              </p>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-950">
                {proPrice}
              </span>

              <span className="ml-2 text-slate-500">
                {proPeriod}
              </span>
            </div>

            {billing === "yearly" && (
              <p className="mb-6 text-sm font-semibold text-emerald-600">
                Equivalent to about ₹125/month
              </p>
            )}

            {billing === "monthly" && (
              <p className="mb-6 text-sm text-slate-500">
                Cancel anytime
              </p>
            )}

            <button
              type="button"
              className="w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
              onClick={() =>
                alert(
                  "ToolVoraa Pro payments are coming soon."
                )
              }
            >
              Get ToolVoraa Pro
            </button>

            <div className="my-8 h-px bg-slate-100" />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-800">
              Everything in Free, plus
            </h3>

            <div className="space-y-4">
              <Feature text="Up to 100 text AI generations per day*" />
              <Feature text="Up to 20 AI Resume Analyses per day*" />
              <Feature text="Up to 20 AI PDF Summaries per day*" />
              <Feature text="Higher AI usage limits" />
              <Feature text="Ad-free experience*" />
              <Feature text="Priority AI processing*" />
              <Feature text="Access to future Pro features*" />
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-400">
              *Pro account features will activate after login and
              payment integration is completed.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Free vs Pro
            </h2>

            <p className="mt-3 text-slate-500">
              Standard tools stay accessible while Pro gives you
              substantially higher AI usage.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <ComparisonRow
              label="Standard tools"
              free="Included"
              pro="Included"
              heading
            />

            <ComparisonRow
              label="Text AI tools"
              free="5 / day*"
              pro="100 / day*"
            />

            <ComparisonRow
              label="Resume Analyzer"
              free="1 / day*"
              pro="20 / day*"
            />

            <ComparisonRow
              label="PDF Summarizer"
              free="1 / day*"
              pro="20 / day*"
            />

            <ComparisonRow
              label="Advertisements"
              free="Yes"
              pro="No*"
            />

            <ComparisonRow
              label="Higher AI limits"
              free="—"
              pro="✓"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-9 text-center text-3xl font-bold">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            <Faq
              question="Will ToolVoraa still have free tools?"
              answer="Yes. Standard calculators, business tools, PDF utilities, image tools and SEO/developer utilities can remain available without a Pro subscription."
            />

            <Faq
              question="Why are AI tools limited?"
              answer="AI requests use external computing resources. Usage limits help ToolVoraa keep the service reliable while still giving free users access to AI features."
            />

            <Faq
              question="Can I cancel Pro?"
              answer="The planned monthly subscription will be cancellable. Final billing and cancellation details will be shown before payments are enabled."
            />

            <Faq
              question="Are payments available now?"
              answer="Not yet. This pricing page currently previews the planned ToolVoraa Free and Pro plans. Payment and account integration will be added separately."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-950 px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-3xl font-bold">
            Start using ToolVoraa today
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Use our free online tools now. Upgrade options will be
            available when ToolVoraa Pro officially launches.
          </p>

          <Link
            href="/tools/all"
            className="mt-7 inline-flex rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} ToolVoraa. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="hover:text-violet-600"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-violet-600"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="hover:text-violet-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        ✓
      </div>

      <span className="text-sm leading-6 text-slate-600">
        {text}
      </span>
    </div>
  );
}

function ComparisonRow({
  label,
  free,
  pro,
  heading = false,
}: {
  label: string;
  free: string;
  pro: string;
  heading?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 border-b border-slate-100 last:border-b-0 ${
        heading ? "bg-slate-50" : "bg-white"
      }`}
    >
      <div className="px-4 py-4 text-sm font-semibold text-slate-700 sm:px-6">
        {label}
      </div>

      <div className="border-l border-slate-100 px-3 py-4 text-center text-sm text-slate-600 sm:px-6">
        {free}
      </div>

      <div className="border-l border-slate-100 px-3 py-4 text-center text-sm font-semibold text-violet-700 sm:px-6">
        {pro}
      </div>
    </div>
  );
}

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none font-semibold text-slate-900">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="text-xl text-violet-600 transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {answer}
      </p>
    </details>
  );
}