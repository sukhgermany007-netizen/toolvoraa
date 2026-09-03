"use client";

import { useMemo, useState } from "react";

type ItemType =
  | "Car"
  | "Phone"
  | "Laptop"
  | "AC"
  | "Refrigerator"
  | "Washing Machine"
  | "TV"
  | "Other";

type ResultType = {
  recommendation: "KEEP & REPAIR" | "REPLACE";
  repairScore: number;
  replaceScore: number;
  repairCost1Year: number;
  repairCost3Year: number;
  repairCost5Year: number;
  replaceCost1Year: number;
  replaceCost3Year: number;
  replaceCost5Year: number;
  savings: number;
  breakEvenYears: number | null;
  reasons: string[];
};

const formatMoney = (value: number) => {
  if (!Number.isFinite(value)) return "₹0";
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function SmartReplaceOrKeepPage() {
  const [itemType, setItemType] = useState<ItemType>("Washing Machine");
  const [currentAge, setCurrentAge] = useState("5");
  const [purchasePrice, setPurchasePrice] = useState("30000");
  const [repairCost, setRepairCost] = useState("5000");
  const [replacementPrice, setReplacementPrice] = useState("32000");
  const [remainingLife, setRemainingLife] = useState("4");
  const [previousRepairs, setPreviousRepairs] = useState("1");
  const [currentRunningCost, setCurrentRunningCost] = useState("6000");
  const [newRunningCost, setNewRunningCost] = useState("4000");

  const result: ResultType = useMemo(() => {
    const age = Math.max(0, Number(currentAge) || 0);
    const originalPrice = Math.max(0, Number(purchasePrice) || 0);
    const repair = Math.max(0, Number(repairCost) || 0);
    const replacement = Math.max(0, Number(replacementPrice) || 0);
    const lifeLeft = Math.max(0, Number(remainingLife) || 0);
    const repairHistory = Math.max(0, Number(previousRepairs) || 0);
    const oldRun = Math.max(0, Number(currentRunningCost) || 0);
    const newRun = Math.max(0, Number(newRunningCost) || 0);

    const repairRatio =
      replacement > 0 ? (repair / replacement) * 100 : 100;

    const agePressure = clamp(age * 4, 0, 32);
    const repairPressure = clamp(repairRatio * 0.55, 0, 35);
    const historyPressure = clamp(repairHistory * 7, 0, 21);

    const runningSavings = Math.max(0, oldRun - newRun);

    const efficiencyPressure =
      oldRun > 0 ? clamp((runningSavings / oldRun) * 18, 0, 18) : 0;

    const lifeBonus = clamp(lifeLeft * 6, 0, 30);

    let keepStrength =
      72 -
      agePressure -
      repairPressure -
      historyPressure -
      efficiencyPressure +
      lifeBonus;

    if (repairRatio <= 20) keepStrength += 12;
    if (repairRatio >= 50) keepStrength -= 25;
    if (lifeLeft <= 1) keepStrength -= 18;
    if (repairHistory >= 3) keepStrength -= 12;

    if (originalPrice > 0 && repair <= originalPrice * 0.1) {
      keepStrength += 5;
    }

    const repairScore = Math.round(clamp(keepStrength, 5, 95));
    const replaceScore = 100 - repairScore;

    const likelyRepairMultiplier =
      repairHistory >= 3 ? 0.3 : repairHistory >= 1 ? 0.15 : 0.08;

    const yearlyFutureRepair = repair * likelyRepairMultiplier;

    const repairCost1Year = repair + oldRun + yearlyFutureRepair;
    const repairCost3Year = repair + oldRun * 3 + yearlyFutureRepair * 3;
    const repairCost5Year = repair + oldRun * 5 + yearlyFutureRepair * 5;

    const replaceCost1Year = replacement + newRun;
    const replaceCost3Year = replacement + newRun * 3;
    const replaceCost5Year = replacement + newRun * 5;

    const savings = Math.abs(repairCost5Year - replaceCost5Year);

    let breakEvenYears: number | null = null;

    if (oldRun > newRun) {
      const annualSavings = oldRun - newRun;
      const extraUpfront = replacement - repair;

      if (annualSavings > 0 && extraUpfront > 0) {
        breakEvenYears = extraUpfront / annualSavings;
      } else if (extraUpfront <= 0) {
        breakEvenYears = 0;
      }
    }

    const recommendation =
      replaceScore > repairScore ? "REPLACE" : "KEEP & REPAIR";

    const reasons: string[] = [];

    if (repairRatio <= 20) {
      reasons.push(
        `Repair cost is only ${repairRatio.toFixed(
          1
        )}% of the replacement price, which strongly supports repairing.`
      );
    } else if (repairRatio >= 50) {
      reasons.push(
        `Repair cost is ${repairRatio.toFixed(
          1
        )}% of replacement price, making replacement more attractive.`
      );
    } else {
      reasons.push(
        `Repair cost is ${repairRatio.toFixed(
          1
        )}% of replacement price, so other factors are important.`
      );
    }

    if (lifeLeft >= 4) {
      reasons.push(
        `You estimate around ${lifeLeft} years of useful life remaining, which favors keeping the current item.`
      );
    } else if (lifeLeft <= 1) {
      reasons.push(
        `Only about ${lifeLeft} year of useful life remains, increasing the case for replacement.`
      );
    }

    if (repairHistory >= 3) {
      reasons.push(
        `The item has already needed ${repairHistory} repairs, suggesting increasing reliability risk.`
      );
    } else if (repairHistory === 0) {
      reasons.push(
        `There is no previous repair history, which is a positive sign for keeping it.`
      );
    }

    if (oldRun > newRun) {
      reasons.push(
        `A replacement may save around ${formatMoney(
          oldRun - newRun
        )} per year in running costs.`
      );
    } else {
      reasons.push(
        "Running-cost savings from replacement appear limited."
      );
    }

    return {
      recommendation,
      repairScore,
      replaceScore,
      repairCost1Year,
      repairCost3Year,
      repairCost5Year,
      replaceCost1Year,
      replaceCost3Year,
      replaceCost5Year,
      savings,
      breakEvenYears,
      reasons,
    };
  }, [
    currentAge,
    purchasePrice,
    repairCost,
    replacementPrice,
    remainingLife,
    previousRepairs,
    currentRunningCost,
    newRunningCost,
  ]);

  const resetForm = () => {
    setItemType("Washing Machine");
    setCurrentAge("5");
    setPurchasePrice("30000");
    setRepairCost("5000");
    setReplacementPrice("32000");
    setRemainingLife("4");
    setPreviousRepairs("1");
    setCurrentRunningCost("6000");
    setNewRunningCost("4000");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Simple Tool Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool<span className="text-purple-600">Voraa</span>
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-purple-200 bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-700">
            Smart Decision Tool
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Smart Replace-or-Keep
            <span className="text-purple-600"> Decision Engine</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Find out whether repairing your current item or replacing it
            makes more financial sense. Compare cost, age, remaining life,
            reliability and long-term running expenses.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          {/* Input Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Tell us about your item
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter realistic estimates to get a more useful result.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Item Type">
                <select
                  value={itemType}
                  onChange={(e) =>
                    setItemType(e.target.value as ItemType)
                  }
                  className={inputClass}
                >
                  <option>Car</option>
                  <option>Phone</option>
                  <option>Laptop</option>
                  <option>AC</option>
                  <option>Refrigerator</option>
                  <option>Washing Machine</option>
                  <option>TV</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Current Age">
                <NumberInput
                  value={currentAge}
                  setValue={setCurrentAge}
                  suffix="years"
                />
              </Field>

              <Field label="Original Purchase Price">
                <NumberInput
                  value={purchasePrice}
                  setValue={setPurchasePrice}
                  prefix="₹"
                />
              </Field>

              <Field label="Current Repair Cost">
                <NumberInput
                  value={repairCost}
                  setValue={setRepairCost}
                  prefix="₹"
                />
              </Field>

              <Field label="New Replacement Price">
                <NumberInput
                  value={replacementPrice}
                  setValue={setReplacementPrice}
                  prefix="₹"
                />
              </Field>

              <Field label="Expected Remaining Life">
                <NumberInput
                  value={remainingLife}
                  setValue={setRemainingLife}
                  suffix="years"
                />
              </Field>

              <Field label="Previous Repairs">
                <NumberInput
                  value={previousRepairs}
                  setValue={setPreviousRepairs}
                  suffix="times"
                />
              </Field>

              <Field label="Current Annual Running Cost">
                <NumberInput
                  value={currentRunningCost}
                  setValue={setCurrentRunningCost}
                  prefix="₹"
                />
              </Field>

              <Field label="New Item Annual Running Cost">
                <NumberInput
                  value={newRunningCost}
                  setValue={setNewRunningCost}
                  prefix="₹"
                />
              </Field>
            </div>

            <button
              onClick={resetForm}
              className="mt-7 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
            >
              Reset Example
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
                Smart Recommendation
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="text-4xl">
                  {result.recommendation === "KEEP & REPAIR"
                    ? "🛠️"
                    : "✨"}
                </div>

                <div>
                  <h2 className="text-3xl font-black">
                    {result.recommendation}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Best estimated choice for your {itemType}.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <ScoreCard
                  title="Repair Score"
                  score={result.repairScore}
                />

                <ScoreCard
                  title="Replace Score"
                  score={result.replaceScore}
                />
              </div>

              <div className="mt-7">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Repair</span>
                  <span>Replace</span>
                </div>

                <div className="flex h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${result.repairScore}%` }}
                  />

                  <div
                    className="bg-purple-500 transition-all"
                    style={{ width: `${result.replaceScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Long-Term Cost Comparison
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Estimated ownership cost for each option.
              </p>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <span>Period</span>
                  <span className="text-right">Repair</span>
                  <span className="text-right">Replace</span>
                </div>

                <CostRow
                  period="1 Year"
                  repair={result.repairCost1Year}
                  replace={result.replaceCost1Year}
                />

                <CostRow
                  period="3 Years"
                  repair={result.repairCost3Year}
                  replace={result.replaceCost3Year}
                />

                <CostRow
                  period="5 Years"
                  repair={result.repairCost5Year}
                  replace={result.replaceCost5Year}
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  title="5-Year Difference"
                  value={formatMoney(result.savings)}
                  description="Estimated difference between both options."
                />

                <InfoBox
                  title="Running Cost Break-Even"
                  value={
                    result.breakEvenYears === null
                      ? "Not reached"
                      : result.breakEvenYears === 0
                      ? "Immediate"
                      : `${result.breakEvenYears.toFixed(1)} yrs`
                  }
                  description="Estimated time for lower running costs to recover the extra replacement cost."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Why does ToolVoraa recommend this?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {result.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="💰"
            title="Cost Analysis"
            description="Compares repair cost, replacement cost and future running expenses."
          />

          <FeatureCard
            icon="🧠"
            title="Smart Scoring"
            description="Uses age, repair history, remaining life and cost ratios to score both choices."
          />

          <FeatureCard
            icon="📊"
            title="Long-Term View"
            description="Shows estimated 1-year, 3-year and 5-year ownership costs."
          />
        </section>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">Note:</strong>{" "}
            This tool provides an estimated financial comparison based
            on the information you enter. Safety, warranty, sentimental
            value, parts availability and professional inspection may
            also affect the final decision.
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ToolVoraa. Free online tools for
            smarter decisions.
          </p>

          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-purple-600">
              Privacy
            </a>

            <a href="/terms" className="hover:text-purple-600">
              Terms
            </a>

            <a href="/contact" className="hover:text-purple-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

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

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {score}
        <span className="text-sm font-medium text-slate-400">
          /100
        </span>
      </p>
    </div>
  );
}

function CostRow({
  period,
  repair,
  replace,
}: {
  period: string;
  repair: number;
  replace: number;
}) {
  const repairBetter = repair <= replace;

  return (
    <div className="grid grid-cols-3 border-t border-slate-200 px-4 py-4 text-sm">
      <span className="font-medium text-slate-700">
        {period}
      </span>

      <span
        className={`text-right font-bold ${
          repairBetter ? "text-emerald-600" : "text-slate-700"
        }`}
      >
        {formatMoney(repair)}
      </span>

      <span
        className={`text-right font-bold ${
          !repairBetter ? "text-purple-600" : "text-slate-700"
        }`}
      >
        {formatMoney(replace)}
      </span>
    </div>
  );
}

function InfoBox({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-extrabold text-purple-600">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
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
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}