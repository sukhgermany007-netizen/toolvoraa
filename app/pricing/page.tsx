"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";


export default function PricingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-purple-500/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">Tool</span>
            <span className="text-purple-400">Voraa</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link href="/" className="transition hover:text-purple-400">
              Home
            </Link>

            <Link
              href="/tools/all"
              className="transition hover:text-purple-400"
            >
              All Tools
            </Link>

            <Link href="/pricing" className="font-medium text-purple-400">
              Pricing
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-purple-400"
            >
              Contact
            </Link>
          </nav>

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
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-purple-400"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
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
              <Link
                href="/"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                Home
              </Link>

              <Link
                href="/tools/all"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                All Tools
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-purple-400"
              >
                Pricing
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenu(false)}
                className="hover:text-purple-400"
              >
                Contact
              </Link>

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
                    <Link
                      href="/login"
                      onClick={() => setMobileMenu(false)}
                      className="rounded-lg border border-slate-700 px-4 py-3 text-center font-semibold transition hover:border-purple-500 hover:text-purple-400"
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      onClick={() => setMobileMenu(false)}
                      className="rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-500"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="px-5 pb-10 pt-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-semibold text-purple-300">
            Simple & transparent pricing
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Choose the right plan for you
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Use ToolVoraa&apos;s everyday tools for free and upgrade
            when you need higher AI limits and a cleaner,
            ad-free experience.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl shadow-purple-950/10 sm:p-9">
            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
                ⚡
              </div>

              <h2 className="text-2xl font-bold">
                Free
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Great for everyday calculations, PDF, image,
                business and occasional AI use.
              </p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-extrabold tracking-tight">
                ₹0
              </span>

              <span className="ml-2 text-slate-400">
                forever
              </span>
            </div>

            <Link
              href="/tools/all"
              className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:border-purple-500 hover:bg-purple-500/10 hover:text-white"
            >
              Use Free Tools
            </Link>

            <div className="my-8 h-px bg-slate-800" />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-200">
              What&apos;s included
            </h3>

            <div className="space-y-4">
              <Feature text="Access to standard ToolVoraa tools" />
              <Feature text="Calculators & business tools" />
              <Feature text="PDF & image utilities" />
              <Feature text="SEO & developer tools" />
              <Feature text="Up to 5 uses per text AI tool per day*" />
              <Feature text="2 AI Resume Analyses per day*" />
              <Feature text="2 AI PDF Summaries per day*" />
              <Feature text="Standard processing limits" />
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">
              *Daily account-based AI quotas will become active when
              the ToolVoraa account system launches.
            </p>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl border-2 border-purple-500 bg-gradient-to-b from-purple-950/30 to-slate-900 p-7 shadow-2xl shadow-purple-950/20 sm:p-9">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="whitespace-nowrap rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-purple-950/30">
                Most Popular
              </span>
            </div>

            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-xl">
                ✦
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  Pro
                </h2>

                <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-bold text-purple-300">
                  PRO
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                For users who need ToolVoraa&apos;s AI tools more
                frequently.
              </p>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-extrabold tracking-tight text-white">
                ₹299
              </span>
              <span className="ml-2 text-slate-400">/ month</span>
            </div>

            <p className="mb-6 text-sm text-slate-500">
              Cancel anytime
            </p>

            <button
              type="button"
              className="w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
              onClick={() =>
                alert(
                  "ToolVoraa Pro payments are coming soon."
                )
              }
            >
              Get ToolVoraa Pro
            </button>

            <div className="my-8 h-px bg-slate-800" />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-200">
              Everything in Free, plus
            </h3>

            <div className="space-y-4">
              <Feature text="Up to 50 uses per text AI tool per day*" />
              <Feature text="Up to 20 AI Resume Analyses per day*" />
              <Feature text="Up to 20 AI PDF Summaries per day*" />
              <Feature text="Higher AI usage limits" />
              <Feature text="Ad-free experience*" />
              <Feature text="Priority AI processing*" />
              <Feature text="Access to future Pro features*" />
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">
              *Pro account features will activate after login and
              payment integration is completed.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-slate-800 bg-slate-900/40 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Free vs Pro
            </h2>

            <p className="mt-3 text-slate-400">
              Standard tools stay accessible while Pro gives you
              substantially higher AI usage.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <ComparisonRow
              label="Standard tools"
              free="Included"
              pro="Included"
              heading
            />

            <ComparisonRow
              label="Text AI tools"
              free="Up to 5 / tool / day*"
              pro="Up to 50 / tool / day*"
            />

            <ComparisonRow
              label="Resume Analyzer"
              free="2 / day*"
              pro="20 / day*"
            />

            <ComparisonRow
              label="PDF Summarizer"
              free="2 / day*"
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
              answer="The monthly Pro plan is planned to be cancellable. Final billing and cancellation details will be shown before payments are enabled."
            />

            <Faq
              question="Are payments available now?"
              answer="Not yet. This pricing page shows the planned ToolVoraa Free and Pro plans. Payment and account integration will be added separately."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-slate-900 px-6 py-12 text-center text-white shadow-2xl shadow-purple-950/10 sm:px-10">
          <h2 className="text-3xl font-bold">
            Start using ToolVoraa today
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Use our free online tools now. Upgrade options will be
            available when ToolVoraa Pro officially launches.
          </p>

          <Link
            href="/tools/all"
            className="mt-7 inline-flex rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-purple-500"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} ToolVoraa. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="hover:text-purple-400"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-purple-400"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="hover:text-purple-400"
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
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300">
        ✓
      </div>

      <span className="text-sm leading-6 text-slate-300">
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
      className={`grid grid-cols-3 border-b border-slate-800 last:border-b-0 ${
        heading ? "bg-slate-800/80" : "bg-slate-900"
      }`}
    >
      <div className="px-4 py-4 text-sm font-semibold text-slate-200 sm:px-6">
        {label}
      </div>

      <div className="border-l border-slate-800 px-3 py-4 text-center text-sm text-slate-300 sm:px-6">
        {free}
      </div>

      <div className="border-l border-slate-800 px-3 py-4 text-center text-sm font-semibold text-purple-300 sm:px-6">
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
    <details className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-purple-950/5">
      <summary className="cursor-pointer list-none font-semibold text-white">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="text-xl text-purple-400 transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {answer}
      </p>
    </details>
  );
}