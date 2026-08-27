"use client";

import { useState } from "react";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [loanTenure, setLoanTenure] = useState("5");

  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  function calculateEMI() {
    const principal = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(loanTenure);

    if (
      principal <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      alert("कृपया सही जानकारी भरें।");
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    let monthlyEmi: number;

    if (monthlyRate === 0) {
      monthlyEmi = principal / months;
    } else {
      monthlyEmi =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const payment = monthlyEmi * months;
    const interest = payment - principal;

    setEmi(monthlyEmi);
    setTotalPayment(payment);
    setTotalInterest(interest);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            🧮 Free Financial Tool
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            EMI Calculator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Calculate your monthly EMI, total interest and total loan
            payment easily.
          </p>
        </div>

        {/* Calculator */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* Input Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <h2 className="mb-6 text-2xl font-bold">
              Loan Details
            </h2>

            {/* Loan Amount */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-300">
                Loan Amount (₹)
              </label>

              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="500000"
              />
            </div>

            {/* Interest Rate */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-300">
                Annual Interest Rate (%)
              </label>

              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="8.5"
              />
            </div>

            {/* Tenure */}
            <div className="mb-7">
              <label className="mb-2 block text-sm text-slate-300">
                Loan Tenure (Years)
              </label>

              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="5"
              />
            </div>

            <button
              onClick={calculateEMI}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
            >
              Calculate EMI
            </button>
          </div>

          {/* Result Card */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-7">

            <h2 className="mb-6 text-2xl font-bold">
              Your Result
            </h2>

            {emi !== null ? (
              <div className="space-y-5">

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Monthly EMI
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-400">
                    {formatCurrency(emi)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Total Interest
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(totalInterest!)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Total Payment
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(totalPayment!)}
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-center text-slate-400">
                <div>
                  <div className="text-5xl">🧮</div>

                  <p className="mt-4">
                    Enter your loan details and click
                    <br />
                    Calculate EMI
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <h2 className="text-xl font-bold">
            How EMI is calculated
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            EMI is calculated using the loan amount, annual interest
            rate and loan tenure. The calculator converts the annual
            interest rate into a monthly rate and calculates the fixed
            monthly payment.
          </p>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to ToolHub AI
          </a>
        </div>

      </div>
    </main>
  );
}