"use client";

import { useMemo, useState } from "react";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const monthly = Math.max(0, Number(monthlyInvestment) || 0);
    const rate = Math.max(0, Number(annualReturn) || 0);
    const duration = Math.max(1, Number(years) || 1);

    const months = Math.round(duration * 12);
    const monthlyRate = rate / 100 / 12;

    let maturityValue = 0;

    if (monthlyRate === 0) {
      maturityValue = monthly * months;
    } else {
      maturityValue =
        monthly *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));
    }

    const totalInvestment = monthly * months;
    const estimatedReturns = Math.max(
      0,
      maturityValue - totalInvestment
    );

    const returnPercentage =
      totalInvestment > 0
        ? (estimatedReturns / totalInvestment) * 100
        : 0;

    return {
      months,
      maturityValue,
      totalInvestment,
      estimatedReturns,
      returnPercentage,
    };
  }, [monthlyInvestment, annualReturn, years]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const resetCalculator = () => {
    setMonthlyInvestment(10000);
    setAnnualReturn(12);
    setYears(10);
  };

  const investmentPercentage =
    result.maturityValue > 0
      ? Math.min(
          100,
          (result.totalInvestment / result.maturityValue) * 100
        )
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">💰</div>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            SIP Calculator
          </h1>

          <p className="mt-2 text-gray-600">
            Calculate your SIP investment, estimated returns and
            maturity value.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* LEFT SIDE */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              SIP Information
            </h2>

            <p className="mt-1 mb-6 text-sm text-gray-500">
              Enter your monthly SIP and expected investment details.
            </p>

            {/* Monthly SIP */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Monthly SIP Investment
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
                Amount you plan to invest every month.
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
                Estimated average annual return.
              </p>
            </div>

            {/* Duration */}
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
                  onChange={(e) =>
                    setYears(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  Years
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                How long you want to continue the SIP.
              </p>
            </div>

            {/* SIP Summary */}
            <div className="rounded-xl bg-blue-50 p-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Monthly SIP
                </span>

                <span className="font-bold text-blue-600">
                  {formatCurrency(monthlyInvestment)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  SIP Duration
                </span>

                <span className="font-bold text-blue-600">
                  {years} years
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Expected Return
                </span>

                <span className="font-bold text-blue-600">
                  {annualReturn}%
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

          {/* RIGHT SIDE */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              SIP Results
            </h2>

            <p className="mt-1 mb-6 text-sm text-gray-500">
              Your estimated SIP maturity value.
            </p>

            {/* Maturity Value */}
            <div className="rounded-xl bg-blue-600 p-7 text-center text-white">

              <p className="text-sm opacity-90">
                Estimated Maturity Value
              </p>

              <p className="mt-2 text-4xl font-bold">
                {formatCurrency(result.maturityValue)}
              </p>

              <p className="mt-2 text-sm opacity-90">
                After {years} years
              </p>

            </div>

            {/* Result Cards */}
            <div className="mt-5 grid grid-cols-2 gap-4">

              {/* Total Investment */}
              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs text-gray-500">
                  Total Investment
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatCurrency(result.totalInvestment)}
                </p>

              </div>

              {/* Estimated Returns */}
              <div className="rounded-xl bg-green-50 p-4">

                <p className="text-xs text-gray-500">
                  Estimated Returns
                </p>

                <p className="mt-2 text-xl font-bold text-green-600">
                  {formatCurrency(result.estimatedReturns)}
                </p>

              </div>

              {/* Return Percentage */}
              <div className="rounded-xl bg-purple-50 p-4">

                <p className="text-xs text-gray-500">
                  Return Percentage
                </p>

                <p className="mt-2 text-xl font-bold text-purple-600">
                  {result.returnPercentage.toFixed(1)}%
                </p>

              </div>

              {/* Duration */}
              <div className="rounded-xl bg-orange-50 p-4">

                <p className="text-xs text-gray-500">
                  Investment Period
                </p>

                <p className="mt-2 text-xl font-bold text-orange-600">
                  {years} Years
                </p>

              </div>

            </div>

            {/* Growth Bar */}
            <div className="mt-6">

              <div className="mb-2 flex justify-between">

                <span className="text-sm font-semibold text-gray-700">
                  Investment vs Returns
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(investmentPercentage)}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${investmentPercentage}%`,
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
                    Monthly SIP
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(monthlyInvestment)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Expected Annual Return
                  </span>

                  <span className="font-semibold">
                    {annualReturn}%
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Investment Duration
                  </span>

                  <span className="font-semibold">
                    {years} years
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Total Investment
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(result.totalInvestment)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">
                    Estimated Returns
                  </span>

                  <span className="font-semibold text-green-600">
                    {formatCurrency(result.estimatedReturns)}
                  </span>
                </div>

                <div className="flex justify-between">

                  <span className="font-semibold text-gray-800">
                    Maturity Value
                  </span>

                  <span className="font-bold text-blue-600">
                    {formatCurrency(result.maturityValue)}
                  </span>

                </div>

              </div>

            </div>

            {/* Success Message */}
            <div className="mt-5 rounded-xl bg-green-50 p-4">

              <p className="font-semibold text-green-700">
                ✓ Your SIP could grow to{" "}
                {formatCurrency(result.maturityValue)}
              </p>

              <p className="mt-1 text-sm text-green-700">
                Based on your monthly SIP, expected annual return
                and investment duration.
              </p>

            </div>

          </section>

        </div>

        {/* Information Section */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            How SIP Calculator Works
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            A SIP calculator estimates the future value of regular
            monthly investments. It uses your monthly investment,
            expected annual return and investment duration to estimate
            the total amount invested and potential returns.
          </p>

          <div className="mt-5 rounded-xl bg-gray-50 p-4">

            <p className="font-semibold text-gray-800">
              Important:
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              SIP returns are market-linked and actual returns can be
              higher or lower than the estimated amount. This calculator
              is for estimation and educational purposes only and does
              not guarantee future investment performance.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}