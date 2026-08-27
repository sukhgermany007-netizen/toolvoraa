"use client";

import { useMemo, useState } from "react";

export default function LoanEligibilityCalculator() {
  const [income, setIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(5000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [foir, setFoir] = useState(50);

  const result = useMemo(() => {
    // Maximum total EMI allowed according to FOIR
    const maxTotalEmi = income * (foir / 100);

    // EMI available for the new loan
    const eligibleEmi = Math.max(0, maxTotalEmi - existingEmi);

    // Monthly interest rate
    const monthlyRate = interestRate / 12 / 100;

    // Number of months
    const months = tenure * 12;

    // Loan amount using EMI formula
    let loanAmount = 0;

    if (eligibleEmi > 0 && monthlyRate > 0 && months > 0) {
      loanAmount =
        (eligibleEmi *
          (Math.pow(1 + monthlyRate, months) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, months));
    }

    // If interest rate is 0
    if (eligibleEmi > 0 && monthlyRate === 0) {
      loanAmount = eligibleEmi * months;
    }

    const totalPayment = eligibleEmi * months;
    const totalInterest = Math.max(0, totalPayment - loanAmount);

    return {
      maxTotalEmi,
      eligibleEmi,
      loanAmount,
      totalPayment,
      totalInterest,
      months,
    };
  }, [income, existingEmi, interestRate, tenure, foir]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  const resetCalculator = () => {
    setIncome(50000);
    setExistingEmi(5000);
    setInterestRate(10);
    setTenure(5);
    setFoir(50);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🏦</div>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Loan Eligibility Calculator
          </h1>

          <p className="mt-3 text-gray-600">
            Estimate how much loan you may be eligible for based on your
            income, existing EMI and FOIR.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Applicant Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your monthly income and current loan details.
            </p>

            <div className="mt-6 space-y-5">
              {/* Monthly Income */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Monthly Income
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) =>
                      setIncome(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Your monthly net/take-home income.
                </p>
              </div>

              {/* Existing EMI */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Existing Monthly EMI
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={existingEmi}
                    onChange={(e) =>
                      setExistingEmi(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Total EMI you are already paying every month.
                </p>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Expected Interest Rate
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(
                        Math.max(0, Math.min(50, Number(e.target.value)))
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Approximate annual interest rate.
                </p>
              </div>

              {/* Tenure */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Loan Tenure
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tenure}
                    onChange={(e) =>
                      setTenure(
                        Math.max(1, Math.min(30, Number(e.target.value)))
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-16 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    Years
                  </span>
                </div>
              </div>

              {/* FOIR */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    FOIR
                  </label>

                  <span className="font-bold text-blue-600">{foir}%</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="70"
                  step="1"
                  value={foir}
                  onChange={(e) => setFoir(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />

                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>20%</span>
                  <span>70%</span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  FOIR determines how much of your income can be used toward
                  total EMIs.
                </p>
              </div>

              {/* Reset */}
              <button
                onClick={resetCalculator}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ↻ Reset Calculator
              </button>
            </div>
          </section>

          {/* Results Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Loan Eligibility Results
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your estimated borrowing capacity.
            </p>

            {/* Main Result */}
            <div className="mt-6 rounded-2xl bg-blue-600 p-7 text-center text-white">
              <p className="text-sm font-medium opacity-90">
                Estimated Loan Eligibility
              </p>

              <p className="mt-2 text-4xl font-extrabold md:text-5xl">
                {formatCurrency(result.loanAmount)}
              </p>

              <p className="mt-2 text-sm opacity-90">
                Approximate eligible loan amount
              </p>
            </div>

            {/* Result Boxes */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Maximum Total EMI
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatCurrency(result.maxTotalEmi)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Eligible New EMI
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatCurrency(result.eligibleEmi)}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Interest
                </p>

                <p className="mt-2 text-xl font-bold text-green-700">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Repayment
                </p>

                <p className="mt-2 text-xl font-bold text-purple-700">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-5 rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900">
                Calculation Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Monthly Income
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(income)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Existing EMI
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(existingEmi)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Interest Rate
                  </span>

                  <span className="font-semibold">
                    {interestRate}%
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Tenure
                  </span>

                  <span className="font-semibold">
                    {tenure} years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    FOIR
                  </span>

                  <span className="font-semibold">
                    {foir}%
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            {result.eligibleEmi > 0 ? (
              <div className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">
                <div className="flex gap-3">
                  <span className="text-xl">✓</span>

                  <div>
                    <p className="font-bold">
                      You may be eligible for a loan
                    </p>

                    <p className="mt-1 text-sm">
                      Based on the entered income, existing EMI and FOIR,
                      your estimated new EMI capacity is{" "}
                      <strong>
                        {formatCurrency(result.eligibleEmi)}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">
                <div className="flex gap-3">
                  <span className="text-xl">!</span>

                  <div>
                    <p className="font-bold">
                      No additional EMI capacity
                    </p>

                    <p className="mt-1 text-sm">
                      Your existing EMI is already at or above the selected
                      FOIR limit.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Information Section */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            How Loan Eligibility Is Calculated
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">💰</div>

              <h3 className="mt-3 font-bold">
                1. Income
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your monthly income is used to determine the maximum EMI
                amount you can generally afford.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">📊</div>

              <h3 className="mt-3 font-bold">
                2. FOIR
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                FOIR represents the portion of your monthly income that can
                be allocated toward loan EMIs.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">🏦</div>

              <h3 className="mt-3 font-bold">
                3. Loan Amount
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                The eligible EMI is converted into an estimated loan amount
                using the interest rate and selected tenure.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This calculator provides an
          approximate estimate only. Actual loan eligibility depends on the
          lender, credit score, income, employment profile, existing
          liabilities, interest rate and other eligibility criteria.
        </div>
      </div>
    </main>
  );
}