"use client";

import { useMemo, useState } from "react";

export default function SalaryCalculator() {
  const [basic, setBasic] = useState("30000");
  const [hra, setHra] = useState("12000");
  const [allowances, setAllowances] = useState("8000");
  const [bonus, setBonus] = useState("2000");

  const [pf, setPf] = useState("3600");
  const [professionalTax, setProfessionalTax] = useState("200");
  const [tds, setTds] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const [frequency, setFrequency] = useState<"monthly" | "annual">(
    "monthly"
  );

  const result = useMemo(() => {
    const basicValue = Number(basic) || 0;
    const hraValue = Number(hra) || 0;
    const allowancesValue = Number(allowances) || 0;
    const bonusValue = Number(bonus) || 0;

    const pfValue = Number(pf) || 0;
    const professionalTaxValue = Number(professionalTax) || 0;
    const tdsValue = Number(tds) || 0;
    const otherDeductionsValue = Number(otherDeductions) || 0;

    const grossMonthly =
      basicValue +
      hraValue +
      allowancesValue +
      bonusValue;

    const totalDeductions =
      pfValue +
      professionalTaxValue +
      tdsValue +
      otherDeductionsValue;

    const netMonthly =
      grossMonthly - totalDeductions;

    const annualGross = grossMonthly * 12;
    const annualDeductions = totalDeductions * 12;
    const annualNet = netMonthly * 12;

    const basicPercentage =
      grossMonthly > 0
        ? (basicValue / grossMonthly) * 100
        : 0;

    const deductionPercentage =
      grossMonthly > 0
        ? (totalDeductions / grossMonthly) * 100
        : 0;

    const displayGross =
      frequency === "monthly"
        ? grossMonthly
        : annualGross;

    const displayDeductions =
      frequency === "monthly"
        ? totalDeductions
        : annualDeductions;

    const displayNet =
      frequency === "monthly"
        ? netMonthly
        : annualNet;

    return {
      grossMonthly,
      totalDeductions,
      netMonthly,
      annualGross,
      annualDeductions,
      annualNet,
      basicPercentage,
      deductionPercentage,
      displayGross,
      displayDeductions,
      displayNet,
    };
  }, [
    basic,
    hra,
    allowances,
    bonus,
    pf,
    professionalTax,
    tds,
    otherDeductions,
    frequency,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setBasic("30000");
    setHra("12000");
    setAllowances("8000");
    setBonus("2000");

    setPf("3600");
    setProfessionalTax("200");
    setTds("0");
    setOtherDeductions("0");

    setFrequency("monthly");
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">
            💰
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Salary Calculator
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Calculate your gross salary, deductions and
            estimated take-home salary.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Salary Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your monthly salary components.
              </p>
            </div>

            {/* Basic Salary */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Basic Salary
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={basic}
                  onChange={(e) =>
                    setBasic(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="30000"
                />
              </div>
            </div>

            {/* HRA */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                HRA
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={hra}
                  onChange={(e) =>
                    setHra(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="12000"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                House Rent Allowance.
              </p>
            </div>

            {/* Allowances */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Other Allowances
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={allowances}
                  onChange={(e) =>
                    setAllowances(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="8000"
                />
              </div>
            </div>

            {/* Bonus */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Bonus / Incentives
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={bonus}
                  onChange={(e) =>
                    setBonus(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="2000"
                />
              </div>
            </div>

            {/* Deductions Heading */}
            <div className="mb-5 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Deductions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Enter your monthly deductions.
              </p>
            </div>

            {/* PF */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Provident Fund (PF)
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={pf}
                  onChange={(e) =>
                    setPf(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="3600"
                />
              </div>
            </div>

            {/* Professional Tax */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Professional Tax
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={professionalTax}
                  onChange={(e) =>
                    setProfessionalTax(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="200"
                />
              </div>
            </div>

            {/* TDS */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                TDS / Income Tax Deduction
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={tds}
                  onChange={(e) =>
                    setTds(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="0"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Enter your estimated monthly TDS.
              </p>
            </div>

            {/* Other deductions */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Other Deductions
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={otherDeductions}
                  onChange={(e) =>
                    setOtherDeductions(e.target.value)
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Frequency */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Result View
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setFrequency("monthly")
                  }
                  className={`rounded-lg px-4 py-3 font-semibold transition ${
                    frequency === "monthly"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFrequency("annual")
                  }
                  className={`rounded-lg px-4 py-3 font-semibold transition ${
                    frequency === "annual"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Annual
                </button>

              </div>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={resetCalculator}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              ↻ Reset Calculator
            </button>

          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Salary Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your estimated salary breakdown.
              </p>
            </div>

            {/* Net Salary */}
            <div className="rounded-xl bg-blue-600 p-6 text-center text-white">

              <p className="text-sm font-medium text-blue-100">
                Estimated In-Hand Salary
              </p>

              <div className="mt-2 text-4xl font-bold">
                {formatCurrency(result.displayNet)}
              </div>

              <p className="mt-2 text-sm text-blue-100">
                {frequency === "monthly"
                  ? "per month"
                  : "per year"}
              </p>

            </div>

            {/* Main Stats */}
            <div className="mt-5 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Gross Salary
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatCurrency(result.displayGross)}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Deductions
                </p>

                <p className="mt-1 text-lg font-bold text-red-600">
                  {formatCurrency(
                    result.displayDeductions
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-gray-500">
                  Annual Gross
                </p>

                <p className="mt-1 text-lg font-bold text-green-700">
                  {formatCurrency(
                    result.annualGross
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs text-gray-500">
                  Annual In-Hand
                </p>

                <p className="mt-1 text-lg font-bold text-purple-700">
                  {formatCurrency(
                    result.annualNet
                  )}
                </p>
              </div>

            </div>

            {/* Salary Breakdown */}
            <div className="mt-6">

              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Monthly Breakdown
              </h3>

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Basic Salary
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(Number(basic) || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    HRA
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(Number(hra) || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Other Allowances
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      Number(allowances) || 0
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Bonus / Incentives
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(Number(bonus) || 0)}
                  </span>
                </div>

                <div className="my-2 border-t border-gray-200" />

                <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    PF
                  </span>

                  <span className="font-semibold text-red-600">
                    - {formatCurrency(Number(pf) || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Professional Tax
                  </span>

                  <span className="font-semibold text-red-600">
                    -{" "}
                    {formatCurrency(
                      Number(professionalTax) || 0
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    TDS
                  </span>

                  <span className="font-semibold text-red-600">
                    - {formatCurrency(Number(tds) || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Other Deductions
                  </span>

                  <span className="font-semibold text-red-600">
                    -{" "}
                    {formatCurrency(
                      Number(otherDeductions) || 0
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* Salary Ratio */}
            <div className="mt-6 rounded-xl bg-blue-50 p-5">

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Basic Salary Ratio
                </span>

                <span className="font-bold text-blue-700">
                  {result.basicPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      100,
                      result.basicPercentage
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Deduction Ratio
                </span>

                <span className="font-bold text-red-600">
                  {result.deductionPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-red-100">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${Math.min(
                      100,
                      result.deductionPercentage
                    )}%`,
                  }}
                />
              </div>

            </div>

            {/* Note */}
            <div className="mt-6 rounded-xl bg-yellow-50 p-4">

              <div className="flex gap-3">

                <span className="text-xl">
                  💡
                </span>

                <p className="text-sm leading-6 text-gray-600">
                  This calculator provides an estimate
                  based on the values you enter. Actual
                  salary deductions can vary based on
                  your employer, state, benefits and
                  applicable tax rules.
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* Formula / Explanation */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Salary Calculation Formula
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Gross Salary
              </p>

              <p className="mt-2 font-semibold text-blue-600">
                Basic + HRA + Allowances + Bonus
              </p>

            </div>

            <div className="rounded-xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                In-Hand Salary
              </p>

              <p className="mt-2 font-semibold text-green-600">
                Gross Salary − Total Deductions
              </p>

            </div>

          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            Enter your salary components and deductions
            to estimate the amount you may receive in
            your bank account. For tax planning, use the
            actual TDS or tax amount applicable to your
            situation.
          </p>

        </div>

        {/* How to Use */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            How to use the Salary Calculator
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">

            <li>
              Enter your Basic Salary.
            </li>

            <li>
              Enter HRA, allowances and bonus if
              applicable.
            </li>

            <li>
              Enter PF, Professional Tax, TDS and
              other deductions.
            </li>

            <li>
              Select Monthly or Annual to change the
              result view.
            </li>

            <li>
              Check your estimated Gross Salary,
              deductions and In-Hand Salary.
            </li>

          </ol>

        </div>

        {/* Privacy */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">

          <div className="flex gap-3">

            <span className="text-xl">
              🔒
            </span>

            <div>

              <h3 className="font-semibold text-gray-900">
                Private & Secure
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                All calculations happen directly in your
                browser. Your salary information is not
                sent to a server by this calculator.
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}