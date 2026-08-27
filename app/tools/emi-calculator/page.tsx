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
      !Number.isFinite(principal) ||
      !Number.isFinite(annualRate) ||
      !Number.isFinite(years) ||
      principal <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      alert("Please enter valid loan details.");
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
        <header className="mb-10 text-center">
          <div className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            🧮 Free Financial Tool
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            EMI Calculator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Calculate your monthly loan EMI, total interest and total
            repayment instantly using our free online EMI Calculator.
          </p>
        </header>

        {/* Calculator */}
        <section
          className="grid gap-8 md:grid-cols-2"
          aria-label="EMI Calculator"
        >
          {/* Input Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <h2 className="mb-6 text-2xl font-bold">
              Loan Details
            </h2>

            <div className="mb-5">
              <label
                htmlFor="loanAmount"
                className="mb-2 block text-sm text-slate-300"
              >
                Loan Amount (₹)
              </label>

              <input
                id="loanAmount"
                type="number"
                min="1"
                inputMode="decimal"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="500000"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="interestRate"
                className="mb-2 block text-sm text-slate-300"
              >
                Annual Interest Rate (%)
              </label>

              <input
                id="interestRate"
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="8.5"
              />
            </div>

            <div className="mb-7">
              <label
                htmlFor="loanTenure"
                className="mb-2 block text-sm text-slate-300"
              >
                Loan Tenure (Years)
              </label>

              <input
                id="loanTenure"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="5"
              />
            </div>

            <button
              type="button"
              onClick={calculateEMI}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500"
            >
              Calculate EMI
            </button>
          </div>

          {/* Result Card */}
          <div
            className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-7"
            aria-live="polite"
          >
            <h2 className="mb-6 text-2xl font-bold">
              Your EMI Result
            </h2>

            {emi !== null &&
            totalInterest !== null &&
            totalPayment !== null ? (
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
                    {formatCurrency(totalInterest)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Total Payment
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(totalPayment)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-center text-slate-400">
                <div>
                  <div className="text-5xl" aria-hidden="true">
                    🧮
                  </div>

                  <p className="mt-4">
                    Enter your loan details and click
                    <br />
                    Calculate EMI
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SEO Information */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <h2 className="text-2xl font-bold">
            What is an EMI Calculator?
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            An EMI Calculator helps you estimate the fixed monthly
            payment required to repay a loan. Enter the loan amount,
            annual interest rate and loan tenure to instantly calculate
            your monthly EMI, total interest and total repayment amount.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            How is EMI calculated?
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            EMI is calculated using the principal loan amount, monthly
            interest rate and total number of monthly installments. The
            calculator converts the annual interest rate into a monthly
            rate and calculates a fixed monthly repayment amount.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Where can you use this EMI Calculator?
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            You can use this calculator to estimate EMI for home loans,
            car loans, personal loans and other fixed-payment loans. It
            can also help you compare different loan amounts, interest
            rates and repayment periods before choosing a loan.
          </p>
        </section>

        {/* Back */}
        <nav className="mt-8 text-center" aria-label="Back to homepage">
          <a
            href="/"
            className="text-blue-400 transition hover:text-blue-300"
          >
            ← Back to ToolVoraa
          </a>
        </nav>
      </div>
    </main>
  );
}