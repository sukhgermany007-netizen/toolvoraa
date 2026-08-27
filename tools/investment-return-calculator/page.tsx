"use client";

import { useMemo, useState } from "react";

export default function InvestmentReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const initial = Math.max(0, Number(initialInvestment) || 0);
    const monthly = Math.max(0, Number(monthlyInvestment) || 0);
    const rate = Math.max(0, Number(annualReturn) || 0);
    const duration = Math.max(1, Number(years) || 1);

    const months = Math.round(duration * 12);
    const monthlyRate = rate / 100 / 12;

    let futureValue = initial;

    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + monthly;
    }

    const totalInvested = initial + monthly * months;
    const estimatedReturns = Math.max(0, futureValue - totalInvested);

    const returnPercentage =
      totalInvested > 0
        ? (estimatedReturns / totalInvested) * 100
        : 0;

    return {
      futureValue,
      totalInvested,
      estimatedReturns,
      returnPercentage,
      months,
    };
  }, [initialInvestment, monthlyInvestment, annualReturn, years]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const resetCalculator = () => {
    setInitialInvestment(100000);
    setMonthlyInvestment(10000);
    setAnnualReturn(12);
    setYears(10);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">📈</div>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Investment Return Calculator
          </h1>

          <p className="mt-2 text-gray-600">
            Estimate the future value of your investment and expected returns.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Side */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Investment Information
            </h2>

            <p className="mt-1 mb-6 text-sm text-gray-500">
              Enter your investment details.
            </p>

            {/* Initial Investment */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Initial Investment
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={initialInvestment}
                  onChange={(e) =>
                    setInitialInvestment(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Amount you invest initially.
              </p>
            </div>

            {/* Monthly Investment */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Monthly Investment
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    setMonthlyInvestment(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Amount invested every month.
              </p>
            </div>

            {/* Annual Return */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Expected Annual Return
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) =>
                    setAnnualReturn(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Estimated average annual investment return.
              </p>
            </div>

            {/* Investment Duration */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Investment Duration
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  Years
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                How long you plan to stay invested.
              </p>
            </div>

            {/* Investment Summary */}
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Monthly Investment
                </span>

                <span className="font-bold text-blue-600">
                  {formatCurrency(monthlyInvestment)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Investment Period
                </span>

                <span className="font-bold text-blue-600">
                  {years} years
                </span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={resetCalculator}
              className="mt-5 w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ↻ Reset Calculator
            </button>
          </section>

          {/* Right Side */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Investment Results
            </h2>

            <p className="mt-1 mb-6 text-sm text-gray-500">
              Your estimated investment growth.
            </p>

            {/* Future Value */}
            <div className="rounded-xl bg-blue-600 p-7 text-center text-white">
              <p className="text-sm opacity-90">
                Estimated Future Value
              </p>

              <p className="mt-2 text-4xl font-bold">
                {formatCurrency(result.futureValue)}
              </p>

              <p className="mt-2 text-sm opacity-90">
                After {years} years
              </p>
            </div>

            {/* Result Cards */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Invested
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatCurrency(result.totalInvested)}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-gray-500">
                  Estimated Returns
                </p>

                <p className="mt-2 text-xl font-bold text-green-600">
                  {formatCurrency(result.estimatedReturns)}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs text-gray-500">
                  Return Percentage
                </p>

                <p className="mt-2 text-xl font-bold text-purple-600">
                  {result.returnPercentage.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs text-gray-500">
                  Investment Period
                </p>

                <p className="mt-2 text-xl font-bold text-orange-600">
                  {years} Years
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Investment Growth
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(
                    (result.totalInvested / result.futureValue) * 100
                  ) || 0}
                  %
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      100,
                      (result.totalInvested / result.futureValue) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="mt-6 rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900">
                Calculation Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Initial Investment
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(initialInvestment)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Monthly Investment
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(monthlyInvestment)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Expected Return
                  </span>

                  <span className="font-semibold">
                    {annualReturn}%
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Duration
                  </span>

                  <span className="font-semibold">
                    {years} years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">
                    Estimated Final Value
                  </span>

                  <span className="font-bold text-blue-600">
                    {formatCurrency(result.futureValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-5 rounded-xl bg-green-50 p-4">
              <p className="font-semibold text-green-700">
                ✓ Your investment could grow to{" "}
                {formatCurrency(result.futureValue)}
              </p>

              <p className="mt-1 text-sm text-green-700">
                Based on the entered investment amount, monthly
                contribution and expected annual return.
              </p>
            </div>
          </section>
        </div>

        {/* Information */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            How Investment Return Is Calculated
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            This calculator estimates the future value of an investment
            using the initial investment, monthly contributions,
            expected annual return and investment duration. The
            calculation assumes monthly compounding.
          </p>

          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="font-semibold text-gray-800">
              Important:
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Actual investment returns can vary. This calculator is
              for estimation and educational purposes only and does not
              guarantee future investment performance.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}