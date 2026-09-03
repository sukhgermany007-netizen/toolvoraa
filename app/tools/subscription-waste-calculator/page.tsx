"use client";

import { useMemo, useState } from "react";

type Subscription = {
  name: string;
  monthlyCost: number;
  usagePerMonth: number;
  importance: number;
};

const money = (value: number) => {
  if (!Number.isFinite(value)) return "₹0";

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function SubscriptionWasteCalculatorPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      name: "Netflix",
      monthlyCost: 649,
      usagePerMonth: 4,
      importance: 6,
    },
    {
      name: "Gym Membership",
      monthlyCost: 1200,
      usagePerMonth: 3,
      importance: 5,
    },
    {
      name: "Music App",
      monthlyCost: 119,
      usagePerMonth: 20,
      importance: 8,
    },
  ]);

  const result = useMemo(() => {
    let totalMonthly = 0;
    let totalAnnual = 0;
    let wastedMonthly = 0;

    const analyzed = subscriptions.map((item) => {
      totalMonthly += item.monthlyCost;
      totalAnnual += item.monthlyCost * 12;

      let usageScore = 100;

      if (item.usagePerMonth === 0) {
        usageScore = 0;
      } else if (item.usagePerMonth <= 2) {
        usageScore = 25;
      } else if (item.usagePerMonth <= 5) {
        usageScore = 50;
      } else if (item.usagePerMonth <= 10) {
        usageScore = 75;
      }

      const importanceScore = item.importance * 10;

      const valueScore = Math.round(
        usageScore * 0.65 + importanceScore * 0.35
      );

      const wastePercent = clamp(100 - valueScore, 0, 100);

      const estimatedWaste =
        item.monthlyCost * (wastePercent / 100);

      wastedMonthly += estimatedWaste;

      let recommendation = "Keep";

      if (valueScore < 35) {
        recommendation = "Cancel";
      } else if (valueScore < 60) {
        recommendation = "Review";
      }

      return {
        ...item,
        valueScore,
        wastePercent,
        estimatedWaste,
        recommendation,
      };
    });

    const annualWaste = wastedMonthly * 12;

    const annualSavingsPercent =
      totalAnnual > 0
        ? (annualWaste / totalAnnual) * 100
        : 0;

    return {
      analyzed,
      totalMonthly,
      totalAnnual,
      wastedMonthly,
      annualWaste,
      annualSavingsPercent,
    };
  }, [subscriptions]);

  const updateSubscription = (
    index: number,
    field: keyof Subscription,
    value: string | number
  ) => {
    setSubscriptions((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "name"
                  ? value
                  : Number(value) || 0,
            }
          : item
      )
    );
  };

  const addSubscription = () => {
    setSubscriptions((current) => [
      ...current,
      {
        name: `Subscription ${current.length + 1}`,
        monthlyCost: 500,
        usagePerMonth: 5,
        importance: 5,
      },
    ]);
  };

  const removeSubscription = (index: number) => {
    if (subscriptions.length <= 1) return;

    setSubscriptions((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const reset = () => {
    setSubscriptions([
      {
        name: "Netflix",
        monthlyCost: 649,
        usagePerMonth: 4,
        importance: 6,
      },
      {
        name: "Gym Membership",
        monthlyCost: 1200,
        usagePerMonth: 3,
        importance: 5,
      },
      {
        name: "Music App",
        monthlyCost: 119,
        usagePerMonth: 20,
        importance: 8,
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool
            <span className="text-purple-600">
              Voraa
            </span>
          </a>

          <a
            href="/tools/all"
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-rose-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-rose-200 bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700">
            Smart Savings Tool
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Subscription Waste
            <span className="text-rose-600">
              {" "}Calculator
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Find out how much money may be wasted on
            subscriptions you rarely use. Compare usage,
            importance and monthly cost to identify potential savings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Subscription Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Your Subscriptions
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Add monthly services, apps or memberships.
                </p>
              </div>

              <button
                type="button"
                onClick={addSubscription}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                + Add Subscription
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {subscriptions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateSubscription(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSubscription(index)
                      }
                      disabled={subscriptions.length <= 1}
                      className="rounded-md px-2 py-1 text-sm text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <MiniInput
                      label="Monthly Cost"
                      value={item.monthlyCost}
                      prefix="₹"
                      onChange={(value) =>
                        updateSubscription(
                          index,
                          "monthlyCost",
                          value
                        )
                      }
                    />

                    <MiniInput
                      label="Uses Per Month"
                      value={item.usagePerMonth}
                      onChange={(value) =>
                        updateSubscription(
                          index,
                          "usagePerMonth",
                          value
                        )
                      }
                    />

                    <MiniInput
                      label="Importance 0-10"
                      value={item.importance}
                      max={10}
                      onChange={(value) =>
                        updateSubscription(
                          index,
                          "importance",
                          clamp(value, 0, 10)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-6 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700"
            >
              Reset Example
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
                Estimated Waste
              </p>

              <p className="mt-4 text-sm font-medium text-slate-500">
                You may be wasting around
              </p>

              <p className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
                {money(result.wastedMonthly)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                every month
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ResultBox
                  title="Possible Annual Waste"
                  value={money(result.annualWaste)}
                />

                <ResultBox
                  title="Potential Savings"
                  value={`${result.annualSavingsPercent.toFixed(
                    1
                  )}%`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Subscription Spending
              </h3>

              <div className="mt-6 space-y-4">
                <ComparisonRow
                  label="Total Monthly Cost"
                  value={money(result.totalMonthly)}
                />

                <ComparisonRow
                  label="Total Annual Cost"
                  value={money(result.totalAnnual)}
                />

                <ComparisonRow
                  label="Estimated Monthly Waste"
                  value={money(result.wastedMonthly)}
                  strong
                />

                <ComparisonRow
                  label="Estimated Annual Waste"
                  value={money(result.annualWaste)}
                  strong
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Subscription Analysis
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            See which subscriptions provide the least value.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Subscription</span>
              <span className="text-center">
                Monthly
              </span>
              <span className="text-center">
                Value Score
              </span>
              <span className="text-center">
                Waste
              </span>
              <span className="text-center">
                Action
              </span>
            </div>

            {result.analyzed.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 border-t border-slate-200 px-4 py-4 text-sm"
              >
                <span className="font-semibold text-slate-700">
                  {item.name}
                </span>

                <span className="text-center text-slate-700">
                  {money(item.monthlyCost)}
                </span>

                <span className="text-center font-bold text-slate-800">
                  {item.valueScore}/100
                </span>

                <span className="text-center font-bold text-rose-600">
                  {money(item.estimatedWaste)}
                </span>

                <span className="text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      item.recommendation === "Cancel"
                        ? "bg-red-100 text-red-700"
                        : item.recommendation === "Review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.recommendation}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="💳"
            title="Track Recurring Costs"
            description="Add streaming apps, software, memberships and other recurring monthly charges."
          />

          <FeatureCard
            icon="🧠"
            title="Value Score"
            description="Compare usage and importance to estimate whether a subscription is worth keeping."
          />

          <FeatureCard
            icon="💰"
            title="Savings Potential"
            description="See estimated monthly and yearly savings from reducing unused subscriptions."
          />
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">
              Note:
            </strong>{" "}
            This calculator provides an estimated
            subscription value based on usage and
            importance entered by you. Actual value
            is personal and may vary.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ToolVoraa.
            Free online tools for smarter decisions.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="hover:text-rose-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-rose-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-rose-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

function MiniInput({
  label,
  value,
  onChange,
  max,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          max={max}
          step="1"
          value={value}
          onChange={(e) =>
            onChange(Number(e.target.value) || 0)
          }
          className={`${inputClass} ${
            prefix ? "pl-8" : ""
          }`}
        />
      </div>
    </div>
  );
}

function ResultBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-rose-600">
        {value}
      </p>
    </div>
  );
}

function ComparisonRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span
        className={`text-right font-bold ${
          strong
            ? "text-xl text-rose-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}