"use client";

import { useMemo, useState } from "react";

const money = (value: number) => {
  if (!Number.isFinite(value)) return "₹0";
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const numberValue = (value: string) =>
  Math.max(0, Number(value) || 0);

export default function PriceIncreaseImpactCalculatorPage() {
  const [itemName, setItemName] = useState("Monthly Rent");
  const [oldPrice, setOldPrice] = useState("15000");
  const [newPrice, setNewPrice] = useState("17000");
  const [quantityPerMonth, setQuantityPerMonth] = useState("1");
  const [monthlyBudget, setMonthlyBudget] = useState("50000");

  const result = useMemo(() => {
    const oldUnitPrice = numberValue(oldPrice);
    const newUnitPrice = numberValue(newPrice);
    const quantity = numberValue(quantityPerMonth);
    const budget = numberValue(monthlyBudget);

    const oldMonthlyCost = oldUnitPrice * quantity;
    const newMonthlyCost = newUnitPrice * quantity;

    const monthlyIncrease = Math.max(
      0,
      newMonthlyCost - oldMonthlyCost
    );

    const annualIncrease = monthlyIncrease * 12;

    const priceIncreasePercent =
      oldUnitPrice > 0
        ? ((newUnitPrice - oldUnitPrice) / oldUnitPrice) * 100
        : 0;

    const oldBudgetShare =
      budget > 0 ? (oldMonthlyCost / budget) * 100 : 0;

    const newBudgetShare =
      budget > 0 ? (newMonthlyCost / budget) * 100 : 0;

    const budgetImpactIncrease =
      newBudgetShare - oldBudgetShare;

    const remainingBudgetBefore = Math.max(
      0,
      budget - oldMonthlyCost
    );

    const remainingBudgetAfter = Math.max(
      0,
      budget - newMonthlyCost
    );

    const extraWorkingMonths =
      budget > 0 ? annualIncrease / budget : 0;

    let impactLevel = "Low";

    if (
      priceIncreasePercent >= 20 ||
      budgetImpactIncrease >= 10
    ) {
      impactLevel = "High";
    } else if (
      priceIncreasePercent >= 8 ||
      budgetImpactIncrease >= 4
    ) {
      impactLevel = "Medium";
    }

    return {
      oldMonthlyCost,
      newMonthlyCost,
      monthlyIncrease,
      annualIncrease,
      priceIncreasePercent,
      oldBudgetShare,
      newBudgetShare,
      budgetImpactIncrease,
      remainingBudgetBefore,
      remainingBudgetAfter,
      extraWorkingMonths,
      impactLevel,
    };
  }, [
    oldPrice,
    newPrice,
    quantityPerMonth,
    monthlyBudget,
  ]);

  const reset = () => {
    setItemName("Monthly Rent");
    setOldPrice("15000");
    setNewPrice("17000");
    setQuantityPerMonth("1");
    setMonthlyBudget("50000");
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700">
            Budget Impact Tool
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Price Increase Impact
            <span className="text-orange-600">
              {" "}Calculator
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            See how a price increase affects your monthly budget,
            annual spending and remaining income. Useful for rent,
            fuel, groceries, subscriptions, utilities and business costs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          {/* Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Price Details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter the old price, new price and how often
                you pay for it.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Expense / Product Name">
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) =>
                      setItemName(e.target.value)
                    }
                    placeholder="Example: Monthly Rent"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Old Price">
                <NumberInput
                  value={oldPrice}
                  setValue={setOldPrice}
                  prefix="₹"
                />
              </Field>

              <Field label="New Price">
                <NumberInput
                  value={newPrice}
                  setValue={setNewPrice}
                  prefix="₹"
                />
              </Field>

              <Field label="Quantity / Payments Per Month">
                <NumberInput
                  value={quantityPerMonth}
                  setValue={setQuantityPerMonth}
                  suffix="times"
                />
              </Field>

              <Field label="Monthly Budget / Income">
                <NumberInput
                  value={monthlyBudget}
                  setValue={setMonthlyBudget}
                  prefix="₹"
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-7 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
            >
              Reset Example
            </button>
          </div>

          {/* Main Result */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Monthly Impact
              </p>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {itemName || "This expense"} now costs
              </p>

              <p className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
                +{money(result.monthlyIncrease)}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                more per month compared with the previous price.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ResultBox
                  title="Annual Extra Cost"
                  value={money(result.annualIncrease)}
                />

                <ResultBox
                  title="Price Increase"
                  value={`${result.priceIncreasePercent.toFixed(
                    1
                  )}%`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Impact Level
              </h3>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Estimated Budget Pressure
                  </p>

                  <p
                    className={`mt-2 text-3xl font-black ${
                      result.impactLevel === "High"
                        ? "text-red-600"
                        : result.impactLevel === "Medium"
                        ? "text-orange-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {result.impactLevel}
                  </p>
                </div>

                <div className="text-4xl">
                  {result.impactLevel === "High"
                    ? "🔴"
                    : result.impactLevel === "Medium"
                    ? "🟠"
                    : "🟢"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Before vs After
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Compare how much this expense consumes from your
            monthly budget.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ComparisonCard
              title="Before Price Increase"
              monthlyCost={result.oldMonthlyCost}
              budgetShare={result.oldBudgetShare}
              remainingBudget={result.remainingBudgetBefore}
            />

            <ComparisonCard
              title="After Price Increase"
              monthlyCost={result.newMonthlyCost}
              budgetShare={result.newBudgetShare}
              remainingBudget={result.remainingBudgetAfter}
              highlight
            />
          </div>
        </section>

        {/* Detailed Impact */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Budget Impact Breakdown
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              title="Old Monthly Cost"
              value={money(result.oldMonthlyCost)}
              description="Estimated monthly cost before the increase."
            />

            <InfoCard
              title="New Monthly Cost"
              value={money(result.newMonthlyCost)}
              description="Estimated monthly cost after the increase."
            />

            <InfoCard
              title="Budget Share Increase"
              value={`${result.budgetImpactIncrease.toFixed(
                1
              )}%`}
              description="Additional share of your monthly budget now used."
            />

            <InfoCard
              title="Annual Impact"
              value={money(result.annualIncrease)}
              description="Estimated extra amount paid over one year."
            />
          </div>
        </section>

        {/* Longer-Term View */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Long-Term Extra Cost
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            See what the same price increase could cost over time.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TimelineCard
              period="1 Year"
              value={result.annualIncrease}
            />

            <TimelineCard
              period="3 Years"
              value={result.annualIncrease * 3}
            />

            <TimelineCard
              period="5 Years"
              value={result.annualIncrease * 5}
            />

            <TimelineCard
              period="10 Years"
              value={result.annualIncrease * 10}
            />
          </div>
        </section>

        {/* Insights */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="📈"
            title="See the Real Increase"
            description="Convert a small-looking price change into its true monthly and yearly impact."
          />

          <FeatureCard
            icon="💰"
            title="Protect Your Budget"
            description="Understand how much more of your monthly income or budget the expense now consumes."
          />

          <FeatureCard
            icon="📅"
            title="Think Long Term"
            description="See how recurring price increases can add up over 1, 3, 5 and 10 years."
          />
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">
              Note:
            </strong>{" "}
            This calculator assumes the new price and monthly
            quantity remain unchanged over the selected period.
            Actual costs may vary due to future price changes,
            taxes, discounts or changes in usage.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ToolVoraa. Free online
            tools for smarter decisions.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="hover:text-orange-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-orange-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-orange-600"
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
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function NumberInput({
  value,
  setValue,
  prefix,
  suffix,
}: {
  value: string;
  setValue: (value: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {prefix}
        </span>
      )}

      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        className={`${inputClass} ${
          prefix ? "pl-8" : ""
        } ${suffix ? "pr-16" : ""}`}
      />

      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {suffix}
        </span>
      )}
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
    <div className="rounded-xl border border-orange-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-orange-600">
        {value}
      </p>
    </div>
  );
}

function ComparisonCard({
  title,
  monthlyCost,
  budgetShare,
  remainingBudget,
  highlight = false,
}: {
  title: string;
  monthlyCost: number;
  budgetShare: number;
  remainingBudget: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-sm font-bold text-slate-700">
        {title}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          highlight
            ? "text-orange-600"
            : "text-slate-900"
        }`}
      >
        {money(monthlyCost)}
      </p>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Budget Share
          </span>

          <span className="font-bold text-slate-700">
            {budgetShare.toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Budget Remaining
          </span>

          <span className="font-bold text-slate-700">
            {money(remainingBudget)}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-orange-600">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function TimelineCard({
  period,
  value,
}: {
  period: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-500">
        {period}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {money(value)}
      </p>
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