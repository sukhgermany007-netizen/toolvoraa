"use client";

import { useState } from "react";

export default function ProfitCalculator() {
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("1");

  const cost = Number(costPrice) || 0;
  const selling = Number(sellingPrice) || 0;
  const qty = Number(quantity) || 0;

  const totalCost = cost * qty;
  const totalRevenue = selling * qty;
  const profit = totalRevenue - totalCost;

  const profitMargin =
    totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  const profitPercent =
    totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const money = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const reset = () => {
    setCostPrice("");
    setSellingPrice("");
    setQuantity("1");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block rounded-full border border-blue-500/50 bg-blue-500/10 px-5 py-2 text-blue-400 mb-4">
            📈 Business Profit Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Profit Calculator
          </h1>

          <p className="text-slate-400 text-lg">
            Calculate your profit, revenue and profit margin instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Calculator */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

            <h2 className="text-2xl font-bold mb-6">
              💰 Enter Product Details
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Cost Price per Unit
                </label>

                <input
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="Example: 500"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Selling Price per Unit
                </label>

                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Example: 750"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Example: 10"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={reset}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 font-semibold transition"
              >
                🔄 Reset
              </button>

            </div>
          </section>

          {/* Results */}
          <section className="bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-xl">

            <h2 className="text-2xl font-bold mb-6">
              📊 Profit Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-slate-600">
                  Total Cost
                </span>
                <strong>
                  {money(totalCost)}
                </strong>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-slate-600">
                  Total Revenue
                </span>
                <strong>
                  {money(totalRevenue)}
                </strong>
              </div>

              <div className="rounded-xl bg-blue-50 p-5">
                <div className="text-sm text-slate-600 mb-1">
                  Total Profit / Loss
                </div>

                <div
                  className={`text-3xl font-bold ${
                    profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {money(profit)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-100 p-4">
                  <div className="text-sm text-slate-500">
                    Profit Margin
                  </div>

                  <div className="text-2xl font-bold mt-1">
                    {profitMargin.toFixed(2)}%
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  <div className="text-sm text-slate-500">
                    Profit %
                  </div>

                  <div className="text-2xl font-bold mt-1">
                    {profitPercent.toFixed(2)}%
                  </div>
                </div>

              </div>

            </div>

            {/* Per Unit */}
            <div className="mt-8 border-t pt-6">

              <h3 className="font-bold text-lg mb-4">
                Per Unit
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <div className="text-sm text-slate-500">
                    Cost
                  </div>
                  <div className="font-bold">
                    {money(cost)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">
                    Selling Price
                  </div>
                  <div className="font-bold">
                    {money(selling)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">
                    Profit
                  </div>
                  <div
                    className={`font-bold ${
                      selling - cost >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {money(selling - cost)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">
                    Quantity
                  </div>
                  <div className="font-bold">
                    {qty}
                  </div>
                </div>

              </div>
            </div>

          </section>
        </div>

        {/* Formula */}
        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">
            📘 How Profit is Calculated
          </h2>

          <p className="text-slate-400">
            Profit = Total Revenue − Total Cost
          </p>

          <p className="text-slate-400 mt-2">
            Profit Margin = (Profit ÷ Total Revenue) × 100
          </p>

          <p className="text-slate-400 mt-2">
            Profit % = (Profit ÷ Total Cost) × 100
          </p>
        </section>

      </div>
    </main>
  );
}