"use client";

import { useMemo, useState } from "react";

const money = (value: number) => {
  if (!Number.isFinite(value)) return "₹0";
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const numberValue = (value: string) =>
  Math.max(0, Number(value) || 0);

export default function TimeToMoneyCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [workingDays, setWorkingDays] = useState("26");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [itemPrice, setItemPrice] = useState("60000");
  const [extraMonthlyIncome, setExtraMonthlyIncome] = useState("0");

  const result = useMemo(() => {
    const income = numberValue(monthlyIncome);
    const extraIncome = numberValue(extraMonthlyIncome);
    const days = Math.max(1, numberValue(workingDays));
    const hours = Math.max(1, numberValue(hoursPerDay));
    const price = numberValue(itemPrice);

    const totalMonthlyIncome = income + extraIncome;
    const totalMonthlyHours = days * hours;

    const hourlyIncome =
      totalMonthlyHours > 0
        ? totalMonthlyIncome / totalMonthlyHours
        : 0;

    const dailyIncome =
      days > 0 ? totalMonthlyIncome / days : 0;

    const requiredHours =
      hourlyIncome > 0 ? price / hourlyIncome : 0;

    const requiredDays =
      dailyIncome > 0 ? price / dailyIncome : 0;

    const salaryMonths =
      totalMonthlyIncome > 0
        ? price / totalMonthlyIncome
        : 0;

    const salaryPercent =
      totalMonthlyIncome > 0
        ? (price / totalMonthlyIncome) * 100
        : 0;

    const workWeeks = requiredDays / 6;

    return {
      totalMonthlyIncome,
      hourlyIncome,
      dailyIncome,
      requiredHours,
      requiredDays,
      salaryMonths,
      salaryPercent,
      workWeeks,
    };
  }, [
    monthlyIncome,
    extraMonthlyIncome,
    workingDays,
    hoursPerDay,
    itemPrice,
  ]);

  const reset = () => {
    setMonthlyIncome("50000");
    setExtraMonthlyIncome("0");
    setWorkingDays("26");
    setHoursPerDay("8");
    setItemPrice("60000");
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700">
            Time Value Calculator
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Time-to-Money
            <span className="text-amber-600">
              {" "}Calculator
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Convert a purchase price into the real amount of work time
            needed to afford it. See how many hours, days and months of
            your income that purchase represents.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          {/* Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Income & Work Details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your income, work schedule and the price you want
                to evaluate.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Monthly Income">
                <NumberInput
                  value={monthlyIncome}
                  setValue={setMonthlyIncome}
                  prefix="₹"
                />
              </Field>

              <Field label="Extra Monthly Income">
                <NumberInput
                  value={extraMonthlyIncome}
                  setValue={setExtraMonthlyIncome}
                  prefix="₹"
                />
              </Field>

              <Field label="Working Days Per Month">
                <NumberInput
                  value={workingDays}
                  setValue={setWorkingDays}
                  suffix="days"
                />
              </Field>

              <Field label="Working Hours Per Day">
                <NumberInput
                  value={hoursPerDay}
                  setValue={setHoursPerDay}
                  suffix="hours"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Price of Item / Purchase">
                  <NumberInput
                    value={itemPrice}
                    setValue={setItemPrice}
                    prefix="₹"
                  />
                </Field>
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-7 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
            >
              Reset Example
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Work Time Needed
              </p>

              <p className="mt-4 text-sm font-medium text-slate-500">
                This purchase represents about
              </p>

              <p className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
                {result.requiredHours.toFixed(1)} Hours
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                of your estimated working time.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ResultBox
                  title="Working Days"
                  value={`${result.requiredDays.toFixed(1)} days`}
                />

                <ResultBox
                  title="Salary Months"
                  value={`${result.salaryMonths.toFixed(2)} months`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Your Time Value
              </h3>

              <div className="mt-6 space-y-4">
                <ComparisonRow
                  label="Total Monthly Income"
                  value={money(result.totalMonthlyIncome)}
                />

                <ComparisonRow
                  label="Estimated Daily Income"
                  value={money(result.dailyIncome)}
                />

                <ComparisonRow
                  label="Estimated Hourly Income"
                  value={money(result.hourlyIncome)}
                  strong
                />

                <ComparisonRow
                  label="Purchase as % of Monthly Income"
                  value={`${result.salaryPercent.toFixed(1)}%`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reality Check */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Purchase Reality Check
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View the same purchase in different units of your working life.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              title="Work Hours"
              value={result.requiredHours.toFixed(1)}
              description="Estimated hours of work needed."
            />

            <InfoCard
              title="Work Days"
              value={result.requiredDays.toFixed(1)}
              description="Estimated working days needed."
            />

            <InfoCard
              title="Work Weeks"
              value={result.workWeeks.toFixed(1)}
              description="Approximate six-day work weeks."
            />

            <InfoCard
              title="Income Months"
              value={result.salaryMonths.toFixed(2)}
              description="How many months of total income the price equals."
            />
          </div>
        </section>

        {/* Interpretation */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            What Does This Mean?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InsightCard
              icon="⏱️"
              title="Think in Hours"
              description={`Instead of seeing only ${money(
                numberValue(itemPrice)
              )}, think of it as approximately ${result.requiredHours.toFixed(
                1
              )} hours of your work.`}
            />

            <InsightCard
              icon="💼"
              title="Think in Work Days"
              description={`The same purchase represents around ${result.requiredDays.toFixed(
                1
              )} working days based on your current income and schedule.`}
            />

            <InsightCard
              icon="📅"
              title="Think in Monthly Income"
              description={`The price equals about ${result.salaryMonths.toFixed(
                2
              )} months of your total monthly income.`}
            />

            <InsightCard
              icon="🎯"
              title="Use Before Buying"
              description="Comparing price with your work time can make large purchase decisions easier to understand."
            />
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="⏱️"
            title="Time Value"
            description="Convert money into the hours and days you spend earning it."
          />

          <FeatureCard
            icon="₹"
            title="Income Perspective"
            description="See how large a purchase is compared with your monthly earning power."
          />

          <FeatureCard
            icon="🛒"
            title="Smarter Purchases"
            description="Use your work-time cost as another perspective before buying something."
          />
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">
              Note:
            </strong>{" "}
            This calculator uses gross income and the working schedule
            you enter. Taxes, unpaid work, commuting time, benefits and
            other personal costs are not automatically included.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ToolVoraa. Free online tools for
            smarter decisions.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="hover:text-amber-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-amber-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-amber-600"
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
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

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
        onChange={(e) => setValue(e.target.value)}
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
    <div className="rounded-xl border border-amber-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-amber-600">
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
            ? "text-xl text-amber-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </span>
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

      <p className="mt-2 text-3xl font-black text-amber-600">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-2xl">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
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