"use client";

import { useMemo, useState } from "react";

type ItemType =
  | "Car"
  | "Bike"
  | "Phone"
  | "Laptop"
  | "Appliance"
  | "Equipment"
  | "Other";

const money = (value: number) => {
  if (!Number.isFinite(value)) return "₹0";

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const numberValue = (value: string) =>
  Math.max(0, Number(value) || 0);

export default function TruePurchaseCostPage() {
  const [itemType, setItemType] = useState<ItemType>("Car");

  const [purchasePrice, setPurchasePrice] = useState("800000");
  const [upfrontFees, setUpfrontFees] = useState("50000");

  const [downPayment, setDownPayment] = useState("200000");
  const [loanInterest, setLoanInterest] = useState("9");
  const [loanYears, setLoanYears] = useState("5");

  const [annualMaintenance, setAnnualMaintenance] =
    useState("15000");

  const [annualRunningCost, setAnnualRunningCost] =
    useState("80000");

  const [annualInsurance, setAnnualInsurance] =
    useState("20000");

  const [otherAnnualCost, setOtherAnnualCost] =
    useState("5000");

  const [resaleValue, setResaleValue] = useState("350000");
  const [ownershipYears, setOwnershipYears] = useState("5");

  const result = useMemo(() => {
    const price = numberValue(purchasePrice);
    const fees = numberValue(upfrontFees);

    const down = Math.min(numberValue(downPayment), price);

    const interestRate = numberValue(loanInterest);
    const financeYears = numberValue(loanYears);

    const maintenance = numberValue(annualMaintenance);
    const running = numberValue(annualRunningCost);
    const insurance = numberValue(annualInsurance);
    const other = numberValue(otherAnnualCost);

    const resale = numberValue(resaleValue);
    const plannedYears = Math.max(
      1,
      numberValue(ownershipYears)
    );

    const financedAmount = Math.max(0, price - down);

    const monthlyRate = interestRate / 100 / 12;
    const months = financeYears * 12;

    let monthlyPayment = 0;
    let totalLoanPayment = financedAmount;

    if (financedAmount > 0 && months > 0) {
      if (monthlyRate > 0) {
        monthlyPayment =
          (financedAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

        totalLoanPayment = monthlyPayment * months;
      } else {
        monthlyPayment = financedAmount / months;
        totalLoanPayment = financedAmount;
      }
    }

    const totalInterest = Math.max(
      0,
      totalLoanPayment - financedAmount
    );

    const annualOwnershipCost =
      maintenance + running + insurance + other;

    const costForYears = (years: number) => {
      const effectiveYears = Math.max(1, years);

      const financingInterest =
        financeYears > 0
          ? totalInterest *
            Math.min(effectiveYears / financeYears, 1)
          : 0;

      return (
        price +
        fees +
        financingInterest +
        annualOwnershipCost * effectiveYears
      );
    };

    const cost1 = costForYears(1);
    const cost3 = costForYears(3);
    const cost5 = costForYears(5);
    const cost10 = costForYears(10);

    const plannedGrossCost = costForYears(plannedYears);

    const trueNetCost = Math.max(
      0,
      plannedGrossCost - resale
    );

    const monthlyTrueCost =
      trueNetCost / (plannedYears * 12);

    const dailyTrueCost =
      trueNetCost / (plannedYears * 365);

    const priceDifference = Math.max(
      0,
      trueNetCost - price
    );

    const hiddenCostPercentage =
      price > 0 ? (priceDifference / price) * 100 : 0;

    return {
      financedAmount,
      monthlyPayment,
      totalInterest,
      annualOwnershipCost,
      cost1,
      cost3,
      cost5,
      cost10,
      plannedGrossCost,
      trueNetCost,
      monthlyTrueCost,
      dailyTrueCost,
      priceDifference,
      hiddenCostPercentage,
    };
  }, [
    purchasePrice,
    upfrontFees,
    downPayment,
    loanInterest,
    loanYears,
    annualMaintenance,
    annualRunningCost,
    annualInsurance,
    otherAnnualCost,
    resaleValue,
    ownershipYears,
  ]);

  const reset = () => {
    setItemType("Car");
    setPurchasePrice("800000");
    setUpfrontFees("50000");
    setDownPayment("200000");
    setLoanInterest("9");
    setLoanYears("5");
    setAnnualMaintenance("15000");
    setAnnualRunningCost("80000");
    setAnnualInsurance("20000");
    setOtherAnnualCost("5000");
    setResaleValue("350000");
    setOwnershipYears("5");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Simple Header */}
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
            Smart Ownership Calculator
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            True Purchase Cost
            <span className="text-emerald-600">
              {" "}Calculator
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            The price tag is not the real price.
            Calculate financing, maintenance,
            running expenses, insurance, fees and
            resale value to discover what your
            purchase may actually cost.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          {/* Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Purchase Details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your estimated ownership
                expenses.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Item Type">
                <select
                  value={itemType}
                  onChange={(e) =>
                    setItemType(
                      e.target.value as ItemType
                    )
                  }
                  className={inputClass}
                >
                  <option>Car</option>
                  <option>Bike</option>
                  <option>Phone</option>
                  <option>Laptop</option>
                  <option>Appliance</option>
                  <option>Equipment</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Purchase Price">
                <NumberInput
                  value={purchasePrice}
                  setValue={setPurchasePrice}
                  prefix="₹"
                />
              </Field>

              <Field label="Taxes / Registration / Upfront Fees">
                <NumberInput
                  value={upfrontFees}
                  setValue={setUpfrontFees}
                  prefix="₹"
                />
              </Field>

              <Field label="Down Payment">
                <NumberInput
                  value={downPayment}
                  setValue={setDownPayment}
                  prefix="₹"
                />
              </Field>

              <Field label="Loan Interest Rate">
                <NumberInput
                  value={loanInterest}
                  setValue={setLoanInterest}
                  suffix="%"
                />
              </Field>

              <Field label="Loan Duration">
                <NumberInput
                  value={loanYears}
                  setValue={setLoanYears}
                  suffix="years"
                />
              </Field>

              <Field label="Annual Maintenance">
                <NumberInput
                  value={annualMaintenance}
                  setValue={setAnnualMaintenance}
                  prefix="₹"
                />
              </Field>

              <Field label="Annual Running Cost">
                <NumberInput
                  value={annualRunningCost}
                  setValue={setAnnualRunningCost}
                  prefix="₹"
                />
              </Field>

              <Field label="Annual Insurance">
                <NumberInput
                  value={annualInsurance}
                  setValue={setAnnualInsurance}
                  prefix="₹"
                />
              </Field>

              <Field label="Other Annual Costs">
                <NumberInput
                  value={otherAnnualCost}
                  setValue={setOtherAnnualCost}
                  prefix="₹"
                />
              </Field>

              <Field label="Expected Resale Value">
                <NumberInput
                  value={resaleValue}
                  setValue={setResaleValue}
                  prefix="₹"
                />
              </Field>

              <Field label="Planned Ownership Period">
                <NumberInput
                  value={ownershipYears}
                  setValue={setOwnershipYears}
                  suffix="years"
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-7 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Reset Example
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Estimated True Cost
              </p>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  Your {itemType} may really cost
                </p>

                <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {money(result.trueNetCost)}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  over your selected{" "}
                  {ownershipYears || "1"}-year
                  ownership period after estimated
                  resale value.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ResultBox
                  title="True Monthly Cost"
                  value={money(
                    result.monthlyTrueCost
                  )}
                />

                <ResultBox
                  title="True Daily Cost"
                  value={money(
                    result.dailyTrueCost
                  )}
                />
              </div>
            </div>

            {/* Price Tag vs Real Cost */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Price Tag vs True Cost
              </h3>

              <div className="mt-6 space-y-4">
                <ComparisonRow
                  label="Purchase Price"
                  value={money(
                    numberValue(purchasePrice)
                  )}
                />

                <ComparisonRow
                  label="True Ownership Cost"
                  value={money(
                    result.trueNetCost
                  )}
                  strong
                />

                <ComparisonRow
                  label="Extra Cost Beyond Price"
                  value={money(
                    result.priceDifference
                  )}
                />

                <ComparisonRow
                  label="Extra Cost Percentage"
                  value={`${result.hiddenCostPercentage.toFixed(
                    1
                  )}%`}
                />
              </div>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  A purchase can cost much more
                  than its sticker price once
                  financing and ongoing expenses
                  are included.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Timeline */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-2xl font-bold">
              Ownership Cost Timeline
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              See how your total estimated cost
              grows over time before resale value.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TimelineCard
              period="1 Year"
              value={result.cost1}
            />

            <TimelineCard
              period="3 Years"
              value={result.cost3}
            />

            <TimelineCard
              period="5 Years"
              value={result.cost5}
            />

            <TimelineCard
              period="10 Years"
              value={result.cost10}
            />
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Cost Breakdown
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Amount Financed"
              value={money(
                result.financedAmount
              )}
              description="Purchase price remaining after the down payment."
            />

            <InfoCard
              title="Estimated Monthly Loan Payment"
              value={money(
                result.monthlyPayment
              )}
              description="Estimated payment based on the interest rate and loan duration."
            />

            <InfoCard
              title="Estimated Loan Interest"
              value={money(
                result.totalInterest
              )}
              description="Estimated total financing cost over the full loan."
            />

            <InfoCard
              title="Annual Ownership Expenses"
              value={money(
                result.annualOwnershipCost
              )}
              description="Maintenance, running cost, insurance and other yearly expenses."
            />
          </div>
        </section>

        {/* Why Useful */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="🏷️"
            title="Beyond the Price Tag"
            description="See costs that are easy to overlook when deciding whether something is affordable."
          />

          <FeatureCard
            icon="📅"
            title="Long-Term View"
            description="Compare estimated ownership costs across 1, 3, 5 and 10 years."
          />

          <FeatureCard
            icon="💰"
            title="Resale Included"
            description="Expected resale value is deducted to estimate your net ownership cost."
          />
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">
              Note:
            </strong>{" "}
            Results are estimates based on the
            information you enter. Actual loan
            charges, maintenance, depreciation,
            insurance, taxes, resale value and
            running costs can vary.
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
              className="hover:text-emerald-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-emerald-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-emerald-600"
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
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

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
    <div className="rounded-xl border border-emerald-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-emerald-600">
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
            ? "text-xl text-emerald-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </span>
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
      <p className="text-sm font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-emerald-600">
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

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}