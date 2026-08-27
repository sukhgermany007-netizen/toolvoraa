"use client";

import { useState } from "react";

export default function BusinessNameGenerator() {
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [names, setNames] = useState<string[]>([]);

  function generateNames() {
    if (!category || !keyword) {
      alert("Please enter category and keyword");
      return;
    }

    const cleanKeyword =
      keyword.charAt(0).toUpperCase() + keyword.slice(1);

    const generatedNames = [
      `${cleanKeyword} Hub`,
      `${cleanKeyword} World`,
      `${cleanKeyword} Pro`,
      `${cleanKeyword} Plus`,
      `${cleanKeyword} Point`,
      `${cleanKeyword} Studio`,
      `${cleanKeyword} House`,
      `${cleanKeyword} Works`,
      `${cleanKeyword} Express`,
      `${cleanKeyword} Solutions`,
    ];

    setNames(generatedNames);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-block rounded-full border border-blue-500/50 px-5 py-2 text-blue-400 mb-5">
            🤖 Free Business Tool
          </div>

          <h1 className="text-5xl font-bold">
            AI Business Name Generator
          </h1>

          <p className="mt-4 text-slate-400 text-lg">
            Generate creative business names in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <h2 className="text-2xl font-bold mb-6">
              Generate Business Names
            </h2>

            <label className="block mb-2">
              Business Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Example: Clothing Store"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 mb-5 outline-none focus:border-blue-500"
            />

            <label className="block mb-2">
              Keyword
            </label>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Example: Star"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 mb-6 outline-none focus:border-blue-500"
            />

            <button
              onClick={generateNames}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
            >
              Generate Names
            </button>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <h2 className="text-2xl font-bold mb-6">
              Your Business Names
            </h2>

            {names.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-center text-slate-400">
                Enter your details and click
                <br />
                Generate Names
              </div>
            ) : (
              <div className="space-y-3">
                {names.map((name, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        <div className="text-center mt-10">
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