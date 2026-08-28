"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [percentage, setPercentage] = useState("");
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentage = () => {
    const p = parseFloat(percentage);
    const n = parseFloat(number);

    if (isNaN(p) || isNaN(n)) {
      setResult(null);
      return;
    }

    setResult((p / 100) * n);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-blue-300 mb-5">
            📊 Free Math Tool
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Percentage Calculator
          </h1>

          <p className="text-slate-400 text-lg">
            Calculate percentages quickly and easily.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calculator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold mb-6">
              Calculate Percentage
            </h2>

            <label className="block text-slate-300 mb-2">
              Percentage (%)
            </label>

            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Example: 20"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 mb-5 outline-none focus:border-blue-500"
            />

            <label className="block text-slate-300 mb-2">
              Number
            </label>

            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Example: 500"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 mb-6 outline-none focus:border-blue-500"
            />

            <button
              onClick={calculatePercentage}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500 transition"
            >
              Calculate
            </button>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-8 flex items-center justify-center">
            {result !== null ? (
              <div className="text-center">
                <p className="text-slate-400 mb-3">
                  Your Result
                </p>

                <div className="text-5xl font-bold text-blue-400">
                  {result.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>

                <p className="text-slate-400 mt-4">
                  {percentage}% of {number}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🧮</div>

                <p className="text-slate-400">
                  Enter values and click
                  <br />
                  Calculate
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to ToolVoraa
          </a>
        </div>
      </div>
    </main>
  );
}