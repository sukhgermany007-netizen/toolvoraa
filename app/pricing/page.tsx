"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

type CashfreeCheckoutResult = {
  error?: {
    message?: string;
  };
  redirect?: boolean;
};

type CashfreeInstance = {
  subscriptionsCheckout: (options: {
    subsSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
  }) => Promise<CashfreeCheckoutResult>;
};

type CashfreeFactory = (options: {
  mode: "sandbox" | "production";
}) => CashfreeInstance;

declare global {
  interface Window {
    Cashfree?: CashfreeFactory;
  }
}

function loadCashfree(): Promise<CashfreeInstance> {
  return new Promise((resolve, reject) => {
    const getInstance = () => {
      const factory = window.Cashfree;

      if (typeof factory !== "function") {
        return null;
      }

      return factory({ mode: "sandbox" });
    };

    const existing = getInstance();

    if (existing) {
      resolve(existing);
      return;
    }

    const currentScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
    );

    const handleLoad = () => {
      const instance = getInstance();

      if (!instance) {
        reject(new Error("Cashfree SDK could not be initialized."));
        return;
      }

      resolve(instance);
    };

    const handleError = () => {
      reject(new Error("Cashfree SDK could not be loaded."));
    };

    if (currentScript) {
      currentScript.addEventListener("load", handleLoad, { once: true });
      currentScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });
}

export default function PricingPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(currentUser);
        setAuthLoading(false);
      }
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);
  useEffect(() => {
  const verifyReturnedSubscription = async () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("subscription_return") !== "1") {
      return;
    }

    const subscriptionId = sessionStorage.getItem(
      "toolvoraa_pending_subscription_id"
    );

    if (!subscriptionId) {
      setPaymentError(
        "Subscription returned from Cashfree, but subscription ID was not found."
      );
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await fetch(
        "/api/cashfree/verify-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.verified) {
        throw new Error(
          data?.error || "Subscription verification failed."
        );
      }

      sessionStorage.removeItem(
        "toolvoraa_pending_subscription_id"
      );

      setPaymentSuccess(
        "ToolVoraa Pro activated successfully."
      );

      window.history.replaceState(
        {},
        "",
        "/pricing"
      );

      window.location.reload();
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Subscription verification failed."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  void verifyReturnedSubscription();
}, []);

useEffect(() => {
  const loadCurrentPlan = async () => {
    if (!user) {
      setCurrentPlan("free");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Unable to load user plan:", error);
      return;
    }

    setCurrentPlan(data?.plan === "pro" ? "pro" : "free");
  };

  void loadCurrentPlan();
}, [user, supabase]);
  const userInitial =
    user?.email?.trim().charAt(0).toUpperCase() || "U";

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleProPayment() {
    setPaymentError("");
    setPaymentSuccess("");

    if (!user) {
      window.location.href = "/login?next=/pricing";
      return;
    }

    const phoneInput = window.prompt(
      "Enter your 10-digit Indian mobile number for the monthly subscription:"
    );

    if (!phoneInput) {
      return;
    }

    const phone = phoneInput.replace(/\D/g, "").slice(-10);

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPaymentError(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    setPaymentLoading(true);

    try {
      // 1. Create Cashfree subscription
      const response = await fetch(
        "/api/cashfree/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.details?.message ||
            "Unable to create subscription."
        );
      }

      if (!data?.subscriptionSessionId) {
        throw new Error(
          "Cashfree subscription session ID was not received."
        );
      }

      if (!data?.subscriptionId) {
        throw new Error(
          "Cashfree subscription ID was not received."
        );
      }

      // 2. Open Cashfree subscription checkout
      const cashfree = await loadCashfree();
      sessionStorage.setItem(
  "toolvoraa_pending_subscription_id",
  data.subscriptionId
);

      const result = await cashfree.subscriptionsCheckout({
        subsSessionId: data.subscriptionSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error.message ||
            "Unable to open subscription checkout."
        );
      }

      // 3. Verify subscription server-side
      const verifyResponse = await fetch(
        "/api/cashfree/verify-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: data.subscriptionId,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData?.verified) {
        throw new Error(
          verifyData?.error ||
            "Subscription checkout completed, but verification failed."
        );
      }

      // 4. Pro successfully activated
      setPaymentSuccess("ToolVoraa Pro activated successfully.");

      // Refresh so the updated plan is reflected throughout the app
      window.location.reload();
    } catch (error) {
      console.error("Cashfree subscription error:", error);

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong while starting the subscription."
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-white"
          >
            Tool<span className="text-purple-400">Voraa</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link
              href="/tools/all"
              className="transition hover:text-white"
            >
              All Tools
            </Link>
            <Link href="/pricing" className="text-purple-300">
              Pricing
            </Link>
            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {authLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-800" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
                    {userInitial}
                  </div>
                  <span className="max-w-44 truncate text-xs text-slate-300">
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm md:hidden"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-semibold">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link
                href="/tools/all"
                onClick={() => setMobileOpen(false)}
              >
                All Tools
              </Link>
              <Link
                href="/pricing"
                className="text-purple-300"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>

              <div className="mt-2 border-t border-slate-800 pt-3">
                {user ? (
                  <div className="space-y-3">
                    <p className="break-all text-xs text-slate-400">
                      {user.email}
                    </p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl border border-slate-700 px-4 py-2 text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 rounded-xl bg-purple-600 px-4 py-2 text-center font-bold"
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

      <section className="px-5 pb-12 pt-16 text-center sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
            Simple pricing
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Use ToolVoraa free.
            <span className="block text-purple-400">
              Upgrade when you need more AI.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Standard online tools remain available for free. Pro gives
            signed-in users substantially higher daily AI limits.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-xl sm:p-9">
            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
                ✓
              </div>

              <h2 className="text-2xl font-bold">Free</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Great for everyday calculations, utilities and lighter
                AI usage.
              </p>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-extrabold tracking-tight">
                ₹0
              </span>
              <span className="ml-2 text-slate-400">forever</span>
            </div>

            <p className="mb-6 text-sm text-slate-500">
              No payment required
            </p>

            <Link
              href="/tools/all"
              className="block w-full rounded-xl border border-slate-700 px-5 py-3.5 text-center text-sm font-bold text-slate-200 transition hover:border-purple-500 hover:bg-purple-500/10"
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
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">
              *Daily AI quotas apply to signed-in users.
            </p>
          </div>

          <div className="relative rounded-3xl border-2 border-purple-500 bg-gradient-to-b from-purple-950/30 to-slate-900 p-7 shadow-2xl shadow-purple-950/20 sm:p-9">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="whitespace-nowrap rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-lg">
                Most Popular
              </span>
            </div>

            <div className="mb-7">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-xl">
                ✦
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Pro</h2>
                <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-bold text-purple-300">
                  PRO
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                For users who need ToolVoraa&apos;s AI tools more frequently.
              </p>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-extrabold tracking-tight">
                ₹299
              </span>
              <span className="ml-2 text-slate-400">/ month</span>
            </div>

            <p className="mb-6 text-sm text-slate-500">
              Cashfree recurring subscription Sandbox
            </p>

            {currentPlan === "pro" ? (
              <div className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-center text-sm font-bold text-emerald-300">
                ✓ Pro Active
              </div>
            ) : (
              <button
                type="button"
                onClick={handleProPayment}
                disabled={paymentLoading}
                className="w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentLoading
                  ? "Opening Subscription Checkout..."
                  : "Get ToolVoraa Pro"}
              </button>
            )}

            {paymentError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {paymentError}
              </div>
            )}

            {paymentSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {paymentSuccess}
              </div>
            )}

            <p className="mt-3 text-center text-xs text-slate-500">
              Cashfree Test Environment — no real charge
            </p>

            <div className="my-8 h-px bg-slate-800" />

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-200">
              Everything in Free, plus
            </h3>

            <div className="space-y-4">
              <Feature text="Up to 50 uses per text AI tool per day*" />
              <Feature text="Up to 20 AI Resume Analyses per day*" />
              <Feature text="Up to 20 AI PDF Summaries per day*" />
              <Feature text="Higher AI usage limits" />
              <Feature text="Access to future Pro features" />
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">
              *Recurring subscription checkout is currently being tested in Cashfree Sandbox. Pro access must not be activated until the subscription is verified server-side.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Free vs Pro
            </h2>
            <p className="mt-3 text-slate-400">
              Standard tools stay accessible while Pro gives you higher
              AI usage limits.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <ComparisonRow label="Feature" free="Free" pro="Pro" heading />
            <ComparisonRow
              label="Standard tools"
              free="Included"
              pro="Included"
            />
            <ComparisonRow
              label="Text AI tools"
              free="Up to 5 / tool / day"
              pro="Up to 50 / tool / day"
            />
            <ComparisonRow
              label="Resume Analyzer"
              free="2 / day"
              pro="20 / day"
            />
            <ComparisonRow
              label="PDF Summarizer"
              free="2 / day"
              pro="20 / day"
            />
            <ComparisonRow
              label="Higher AI limits"
              free="—"
              pro="✓"
            />
          </div>
        </div>
      </section>

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
              answer="AI requests use external computing resources. Daily limits help keep the service reliable while still giving free users access to AI features."
            />
            <Faq
              question="How is subscription verified?"
              answer="After checkout, ToolVoraa must verify the Cashfree subscription status on the server before Pro access is activated."
            />
            <Faq
              question="Is this already live billing?"
              answer="No. The current recurring subscription integration is using Cashfree Sandbox for testing. Production credentials, server verification and webhooks are still required before public launch."
            />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-slate-900 px-6 py-12 text-center shadow-2xl shadow-purple-950/10 sm:px-10">
          <h2 className="text-3xl font-bold">
            Start using ToolVoraa today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Explore free calculators, business tools, PDF tools, image
            utilities and AI tools.
          </p>

          <Link
            href="/tools/all"
            className="mt-7 inline-flex rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-bold transition hover:bg-purple-500"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ToolVoraa. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-purple-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-purple-400">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-purple-400">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300">
        ✓
      </div>
      <span className="text-sm leading-6 text-slate-300">{text}</span>
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
        heading ? "bg-slate-900" : "bg-slate-950/50"
      }`}
    >
      <div
        className={`px-4 py-4 text-sm sm:px-6 ${
          heading ? "font-bold text-white" : "text-slate-300"
        }`}
      >
        {label}
      </div>

      <div
        className={`border-l border-slate-800 px-4 py-4 text-center text-sm sm:px-6 ${
          heading ? "font-bold text-white" : "text-slate-400"
        }`}
      >
        {free}
      </div>

      <div
        className={`border-l border-slate-800 px-4 py-4 text-center text-sm sm:px-6 ${
          heading ? "font-bold text-purple-300" : "text-purple-300"
        }`}
      >
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
    <details className="group rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
      <summary className="cursor-pointer list-none pr-6 text-sm font-bold text-white">
        {question}
      </summary>

      <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
    </details>
  );
}
