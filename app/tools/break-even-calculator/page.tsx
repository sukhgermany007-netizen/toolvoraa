"use client";

import { useMemo, useState } from "react";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("50000");
  const [variableCost, setVariableCost] = useState("100");
  const [sellingPrice, setSellingPrice] = useState("250");
  const [quantity, setQuantity] = useState("500");

  const result = useMemo(() => {
    const fixed = Number(fixedCosts) || 0;
    const variable = Number(variableCost) || 0;
    const price = Number(sellingPrice) || 0;
    const qty = Number(quantity) || 0;

    const contribution = price - variable;

    if (contribution <= 0) {
      return {
        valid: false,
        breakEvenUnits: 0,
        breakEvenRevenue: 0,
        totalRevenue: 0,
        totalCost: 0,
        profitLoss: 0,
        margin: 0,
        contribution: contribution,
      };
    }

    const breakEvenUnits = Math.ceil(
      fixed / contribution
    );

    const breakEvenRevenue =
      breakEvenUnits * price;

    const totalRevenue = qty * price;

    const totalVariableCost =
      qty * variable;

    const totalCost =
      fixed + totalVariableCost;

    const profitLoss =
      totalRevenue - totalCost;

    const margin =
      totalRevenue > 0
        ? (profitLoss / totalRevenue) * 100
        : 0;

    return {
      valid: true,
      breakEvenUnits,
      breakEvenRevenue,
      totalRevenue,
      totalCost,
      profitLoss,
      margin,
      contribution,
    };
  }, [
    fixedCosts,
    variableCost,
    sellingPrice,
    quantity,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(
      Math.round(value)
    );
  };

  const resetCalculator = () => {
    setFixedCosts("50000");
    setVariableCost("100");
    setSellingPrice("250");
    setQuantity("500");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">
            📊
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Break-Even Calculator
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Calculate how many units you need to sell
            to cover your total business costs.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* INPUT SECTION */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Business Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your business costs and selling price.
              </p>
            </div>

            {/* Fixed Costs */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Fixed Costs
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={fixedCosts}
                  onChange={(e) =>
                    setFixedCosts(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="50000"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Rent, salaries, electricity and other
                fixed expenses.
              </p>
            </div>

            {/* Variable Cost */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Variable Cost per Unit
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={variableCost}
                  onChange={(e) =>
                    setVariableCost(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="100"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Cost required to produce one unit.
              </p>
            </div>

            {/* Selling Price */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Selling Price per Unit
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) =>
                    setSellingPrice(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="250"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Your selling price for one unit.
              </p>
            </div>

            {/* Expected Quantity */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expected Sales Quantity
              </label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Number of units you expect to sell.
              </p>
            </div>

            {/* Contribution */}
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Contribution per Unit
                </span>

                <span className="font-bold text-blue-700">
                  {formatCurrency(
                    result.contribution
                  )}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Selling Price − Variable Cost
              </p>
            </div>

            {/* Reset */}
            <button
              onClick={resetCalculator}
              className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              ↻ Reset Calculator
            </button>
          </div>

          {/* RESULT SECTION */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Break-Even Results
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your estimated business break-even point.
              </p>
            </div>

            {!result.valid ? (
              <div className="rounded-xl bg-red-50 p-6 text-center">
                <div className="text-4xl">
                  ⚠️
                </div>

                <h3 className="mt-3 font-semibold text-red-700">
                  Break-even cannot be calculated
                </h3>

                <p className="mt-2 text-sm text-red-600">
                  Selling price must be greater than
                  variable cost per unit.
                </p>
              </div>
            ) : (
              <>
                {/* Main Break Even */}
                <div className="rounded-xl bg-blue-600 p-6 text-center text-white">

                  <p className="text-sm font-medium text-blue-100">
                    Break-Even Point
                  </p>

                  <div className="mt-2 text-4xl font-bold">
                    {formatNumber(
                      result.breakEvenUnits
                    )}
                  </div>

                  <p className="mt-1 text-sm text-blue-100">
                    units
                  </p>

                  <div className="mt-4 border-t border-blue-400 pt-4">
                    <p className="text-sm text-blue-100">
                      Break-Even Revenue
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {formatCurrency(
                        result.breakEvenRevenue
                      )}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Total Revenue
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatCurrency(
                        result.totalRevenue
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Total Cost
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatCurrency(
                        result.totalCost
                      )}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-4 ${
                      result.profitLoss >= 0
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <p className="text-xs text-gray-500">
                      {result.profitLoss >= 0
                        ? "Estimated Profit"
                        : "Estimated Loss"}
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        result.profitLoss >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {formatCurrency(
                        Math.abs(
                          result.profitLoss
                        )
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4">
                    <p className="text-xs text-gray-500">
                      Profit Margin
                    </p>

                    <p className="mt-1 text-lg font-bold text-purple-700">
                      {result.margin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Sales Progress
                    </span>

                    <span className="font-semibold text-blue-600">
                      {result.breakEvenUnits > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (Number(quantity) /
                                result.breakEvenUnits) *
                                100
                            )
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${
                          result.breakEvenUnits > 0
                            ? Math.min(
                                100,
                                (Number(quantity) /
                                  result.breakEvenUnits) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Break-even requires approximately{" "}
                    {formatNumber(
                      result.breakEvenUnits
                    )}{" "}
                    units of sales.
                  </p>
                </div>

                {/* Status */}
                <div
                  className={`mt-6 rounded-xl p-4 ${
                    result.profitLoss >= 0
                      ? "bg-green-50"
                      : "bg-yellow-50"
                  }`}
                >
                  <div className="flex gap-3">

                    <span className="text-xl">
                      {result.profitLoss >= 0
                        ? "✅"
                        : "📌"}
                    </span>

                    <div>
                      <h3
                        className={`font-semibold ${
                          result.profitLoss >= 0
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {result.profitLoss >= 0
                          ? "You are above break-even"
                          : "You are below break-even"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {result.profitLoss >= 0
                          ? `Your expected sales are above the break-even point by ${formatNumber(
                              Math.max(
                                0,
                                Number(quantity) -
                                  result.breakEvenUnits
                              )
                            )} units.`
                          : `You need approximately ${formatNumber(
                              Math.max(
                                0,
                                result.breakEvenUnits -
                                  Number(quantity)
                              )
                            )} more units to reach break-even.`}
                      </p>
                    </div>

                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Formula */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Break-Even Formula
          </h2>

          <div className="mt-4 rounded-xl bg-gray-50 p-5 text-center">

            <p className="text-lg font-semibold text-gray-800">
              Break-Even Units =
            </p>

            <p className="mt-2 text-xl font-bold text-blue-600">
              Fixed Costs ÷
              (Selling Price − Variable Cost)
            </p>

          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            The break-even point is the number of units
            you need to sell where your total revenue
            equals your total costs. At this point,
            your business has neither a profit nor a loss.
          </p>
        </div>

        {/* How To */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            How to use the Break-Even Calculator
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">

            <li>
              Enter your total fixed business costs.
            </li>

            <li>
              Enter the variable cost required to
              produce one unit.
            </li>

            <li>
              Enter your selling price per unit.
            </li>

            <li>
              Enter the number of units you expect
              to sell.
            </li>

            <li>
              The calculator automatically shows your
              break-even units, revenue, profit/loss
              and margin.
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
                browser. No financial information is
                uploaded to a server.
              </p>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}