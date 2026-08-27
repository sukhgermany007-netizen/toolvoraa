"use client";

import { useState } from "react";

export default function GstCalculator() {
  const [amount, setAmount] = useState("100000");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);

  function calculateGST() {
    const value = Number(amount);
    const rate = Number(gstRate);

    if (value <= 0 || rate < 0) {
      alert("कृपया सही Amount और GST Rate डालें।");
      return;
    }

    if (mode === "add") {
      const gst = (value * rate) / 100;
      const total = value + gst;

      setOriginalAmount(value);
      setGstAmount(gst);
      setFinalAmount(total);
    } else {
      const original = value / (1 + rate / 100);
      const gst = value - original;

      setOriginalAmount(original);
      setGstAmount(gst);
      setFinalAmount(value);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            🧾 Free Business Tool
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            GST Calculator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Quickly calculate GST, GST-inclusive price and GST-exclusive
            price.
          </p>
        </div>

        {/* Calculator */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* Input Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <h2 className="mb-6 text-2xl font-bold">
              GST Details
            </h2>

            {/* Amount */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-300">
                Amount (₹)
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="100000"
              />
            </div>

            {/* GST Rate */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-300">
                GST Rate
              </label>

              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

            {/* Mode */}
            <div className="mb-7">
              <label className="mb-3 block text-sm text-slate-300">
                Calculation Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("add")}
                  className={`rounded-lg px-4 py-3 font-semibold ${
                    mode === "add"
                      ? "bg-blue-600"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  Add GST
                </button>

                <button
                  onClick={() => setMode("remove")}
                  className={`rounded-lg px-4 py-3 font-semibold ${
                    mode === "remove"
                      ? "bg-blue-600"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  Remove GST
                </button>
              </div>
            </div>

            <button
              onClick={calculateGST}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
            >
              Calculate GST
            </button>
          </div>

          {/* Result Card */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-7">

            <h2 className="mb-6 text-2xl font-bold">
              Your Result
            </h2>

            {gstAmount !== null ? (
              <div className="space-y-5">

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Original Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(originalAmount!)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    GST Amount
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-400">
                    {formatCurrency(gstAmount)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">
                    Final Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(finalAmount!)}
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-center text-slate-400">
                <div>
                  <div className="text-5xl">🧾</div>

                  <p className="mt-4">
                    Enter amount and GST rate
                    <br />
                    then click Calculate GST
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <h2 className="text-xl font-bold">
            GST Calculator
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            Use Add GST when you want to calculate the GST amount on a
            price before GST. Use Remove GST when the entered amount
            already includes GST and you want to find the original
            price and GST portion.
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