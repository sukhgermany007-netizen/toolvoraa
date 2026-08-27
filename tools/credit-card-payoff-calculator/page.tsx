"use client";

import { useMemo, useState } from "react";

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(100000);
  const [interestRate, setInterestRate] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  const [extraPayment, setExtraPayment] = useState(2000);

  const calculatePayoff = (
    startingBalance: number,
    annualRate: number,
    payment: number
  ) => {
    let currentBalance = startingBalance;
    let months = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    const monthlyRate = annualRate / 12 / 100;

    if (currentBalance <= 0 || payment <= 0) {
      return {
        months: 0,
        totalInterest: 0,
        totalPayment: 0,
      };
    }

    // If payment is not enough to cover monthly interest,
    // the balance will never be paid off.
    if (
      monthlyRate > 0 &&
      payment <= currentBalance * monthlyRate
    ) {
      return {
        months: Infinity,
        totalInterest: Infinity,
        totalPayment: Infinity,
      };
    }

    while (currentBalance > 0 && months < 1200) {
      const interest = currentBalance * monthlyRate;

      let principal = payment - interest;

      if (principal > currentBalance) {
        principal = currentBalance;
      }

      const actualPayment = principal + interest;

      currentBalance -= principal;
      totalInterest += interest;
      totalPayment += actualPayment;
      months++;

      if (currentBalance < 0.01) {
        currentBalance = 0;
      }
    }

    return {
      months,
      totalInterest,
      totalPayment,
    };
  };

  const result = useMemo(() => {
    const regularPayment = calculatePayoff(
      balance,
      interestRate,
      monthlyPayment
    );

    const acceleratedPayment = calculatePayoff(
      balance,
      interestRate,
      monthlyPayment + extraPayment
    );

    const interestSaved =
      regularPayment.totalInterest === Infinity ||
      acceleratedPayment.totalInterest === Infinity
        ? 0
        : Math.max(
            0,
            regularPayment.totalInterest -
              acceleratedPayment.totalInterest
          );

    const monthsSaved =
      regularPayment.months === Infinity ||
      acceleratedPayment.months === Infinity
        ? 0
        : Math.max(
            0,
            regularPayment.months -
              acceleratedPayment.months
          );

    return {
      regularPayment,
      acceleratedPayment,
      interestSaved,
      monthsSaved,
    };
  }, [
    balance,
    interestRate,
    monthlyPayment,
    extraPayment,
  ]);

  const formatCurrency = (value: number) => {
    if (!Number.isFinite(value)) {
      return "N/A";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  const formatTime = (months: number) => {
    if (!Number.isFinite(months)) {
      return "Cannot pay off";
    }

    if (months <= 0) {
      return "0 months";
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${months} months`;
    }

    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    }

    return `${years}y ${remainingMonths}m`;
  };

  const resetCalculator = () => {
    setBalance(100000);
    setInterestRate(36);
    setMonthlyPayment(5000);
    setExtraPayment(2000);
  };

  const paymentIsTooLow =
    result.regularPayment.months === Infinity;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">
            💳
          </div>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Credit Card Payoff Calculator
          </h1>

          <p className="mt-3 text-gray-600">
            Find out how long it may take to pay off your
            credit card debt and how much interest you could save.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Input Section */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Credit Card Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your current credit card debt and payment details.
            </p>

            <div className="mt-6 space-y-5">

              {/* Balance */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Credit Card Balance
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={balance}
                    onChange={(e) =>
                      setBalance(
                        Math.max(0, Number(e.target.value))
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Current outstanding credit card balance.
                </p>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Annual Interest Rate
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(
                        Math.max(
                          0,
                          Math.min(
                            100,
                            Number(e.target.value)
                          )
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Enter your approximate annual credit card interest rate.
                </p>
              </div>

              {/* Monthly Payment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Monthly Payment
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={monthlyPayment}
                    onChange={(e) =>
                      setMonthlyPayment(
                        Math.max(
                          0,
                          Number(e.target.value)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Amount you currently plan to pay every month.
                </p>
              </div>

              {/* Extra Payment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Extra Monthly Payment
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={extraPayment}
                    onChange={(e) =>
                      setExtraPayment(
                        Math.max(
                          0,
                          Number(e.target.value)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Optional additional amount paid every month.
                </p>
              </div>

              {/* Total Payment */}
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Monthly Payment With Extra
                  </span>

                  <span className="text-lg font-bold text-blue-700">
                    {formatCurrency(
                      monthlyPayment + extraPayment
                    )}
                  </span>
                </div>
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

          {/* Results Section */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Payoff Results
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare your normal payment with an extra-payment strategy.
            </p>

            {/* Main Result */}
            <div className="mt-6 rounded-2xl bg-blue-600 p-7 text-center text-white">

              <p className="text-sm font-medium opacity-90">
                Debt-Free Time With Extra Payment
              </p>

              <p className="mt-2 text-4xl font-extrabold md:text-5xl">
                {formatTime(
                  result.acceleratedPayment.months
                )}
              </p>

              <p className="mt-2 text-sm opacity-90">
                Pay ₹
                {(
                  monthlyPayment + extraPayment
                ).toLocaleString("en-IN")}{" "}
                per month
              </p>

            </div>

            {/* Comparison Cards */}
            <div className="mt-5 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Normal Payoff Time
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {formatTime(
                    result.regularPayment.months
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-gray-500">
                  Faster By
                </p>

                <p className="mt-2 text-xl font-bold text-green-700">
                  {formatTime(
                    result.monthsSaved
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs text-gray-500">
                  Normal Interest
                </p>

                <p className="mt-2 text-xl font-bold text-red-600">
                  {formatCurrency(
                    result.regularPayment.totalInterest
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs text-gray-500">
                  Interest With Extra
                </p>

                <p className="mt-2 text-xl font-bold text-purple-700">
                  {formatCurrency(
                    result.acceleratedPayment.totalInterest
                  )}
                </p>
              </div>

            </div>

            {/* Interest Savings */}
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-sm text-green-700">
                    Estimated Interest Savings
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-green-800">
                    {formatCurrency(
                      result.interestSaved
                    )}
                  </p>
                </div>

                <div className="text-4xl">
                  💰
                </div>

              </div>

            </div>

            {/* Summary */}
            <div className="mt-5 rounded-xl border border-gray-200 p-5">

              <h3 className="font-bold text-gray-900">
                Payment Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Current Balance
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Annual Interest Rate
                  </span>

                  <span className="font-semibold">
                    {interestRate}%
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Normal Monthly Payment
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">
                    Extra Monthly Payment
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(extraPayment)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Total Monthly Payment
                  </span>

                  <span className="font-bold text-blue-600">
                    {formatCurrency(
                      monthlyPayment + extraPayment
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* Warning */}
            {paymentIsTooLow ? (
              <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">

                <div className="flex gap-3">
                  <span className="text-xl">
                    ⚠️
                  </span>

                  <div>
                    <p className="font-bold">
                      Monthly payment may be too low
                    </p>

                    <p className="mt-1 text-sm">
                      Your current monthly payment does not
                      appear to cover the estimated monthly
                      interest. Increase the payment amount
                      to pay off the balance.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">

                <div className="flex gap-3">
                  <span className="text-xl">
                    ✓
                  </span>

                  <div>
                    <p className="font-bold">
                      Extra payments can reduce interest
                    </p>

                    <p className="mt-1 text-sm">
                      Paying an additional{" "}
                      <strong>
                        {formatCurrency(extraPayment)}
                      </strong>{" "}
                      every month could save approximately{" "}
                      <strong>
                        {formatCurrency(
                          result.interestSaved
                        )}
                      </strong>{" "}
                      in interest.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </section>
        </div>

        {/* How It Works */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            How Credit Card Payoff Works
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-3xl">
                💳
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                1. Enter Your Balance
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Enter your current outstanding credit card balance
                and approximate annual interest rate.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-3xl">
                📅
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                2. Choose Your Payment
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Enter the amount you plan to pay every month.
                You can also add an extra monthly payment.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-3xl">
                💰
              </div>

              <h3 className="mt-3 font-bold text-gray-900">
                3. See Your Savings
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Compare the payoff time and estimated interest
                with and without extra payments.
              </p>
            </div>

          </div>
        </section>

        {/* Formula */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Important Note
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            This calculator uses a simplified monthly-interest
            model. Actual credit card interest can vary depending
            on daily balances, billing cycles, fees, taxes,
            minimum-payment rules and the card issuer's terms.
          </p>

          <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Disclaimer:</strong> Results are estimates
            for educational purposes and should not be considered
            financial advice. Check your credit card statement
            and issuer terms for the exact interest calculation.
          </div>

        </section>

      </div>
    </main>
  );
}