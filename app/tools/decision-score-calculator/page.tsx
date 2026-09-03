"use client";

import { useMemo, useState } from "react";

type Factor = {
  name: string;
  weight: number;
  optionA: number;
  optionB: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function DecisionScoreCalculatorPage() {
  const [optionAName, setOptionAName] = useState("Option A");
  const [optionBName, setOptionBName] = useState("Option B");

  const [factors, setFactors] = useState<Factor[]>([
    {
      name: "Cost",
      weight: 25,
      optionA: 7,
      optionB: 8,
    },
    {
      name: "Benefit",
      weight: 25,
      optionA: 8,
      optionB: 7,
    },
    {
      name: "Risk",
      weight: 20,
      optionA: 6,
      optionB: 8,
    },
    {
      name: "Convenience",
      weight: 15,
      optionA: 9,
      optionB: 7,
    },
    {
      name: "Long-Term Value",
      weight: 15,
      optionA: 8,
      optionB: 9,
    },
  ]);

  const result = useMemo(() => {
    const totalWeight = factors.reduce(
      (sum, factor) => sum + factor.weight,
      0
    );

    if (totalWeight <= 0) {
      return {
        optionAScore: 0,
        optionBScore: 0,
        winner: "Tie",
        difference: 0,
        confidence: "Low",
      };
    }

    const optionATotal = factors.reduce(
      (sum, factor) =>
        sum + factor.optionA * factor.weight,
      0
    );

    const optionBTotal = factors.reduce(
      (sum, factor) =>
        sum + factor.optionB * factor.weight,
      0
    );

    const optionAScore =
      (optionATotal / totalWeight) * 10;

    const optionBScore =
      (optionBTotal / totalWeight) * 10;

    const difference = Math.abs(
      optionAScore - optionBScore
    );

    let winner = "Tie";

    if (optionAScore > optionBScore) {
      winner = optionAName || "Option A";
    } else if (optionBScore > optionAScore) {
      winner = optionBName || "Option B";
    }

    let confidence = "Low";

    if (difference >= 15) {
      confidence = "High";
    } else if (difference >= 7) {
      confidence = "Medium";
    }

    return {
      optionAScore: Math.round(optionAScore),
      optionBScore: Math.round(optionBScore),
      winner,
      difference: Math.round(difference),
      confidence,
    };
  }, [factors, optionAName, optionBName]);

  const updateFactor = (
    index: number,
    field: keyof Factor,
    value: string | number
  ) => {
    setFactors((current) =>
      current.map((factor, i) =>
        i === index
          ? {
              ...factor,
              [field]:
                field === "name"
                  ? value
                  : clamp(Number(value) || 0, 0, field === "weight" ? 100 : 10),
            }
          : factor
      )
    );
  };

  const addFactor = () => {
    setFactors((current) => [
      ...current,
      {
        name: `Factor ${current.length + 1}`,
        weight: 10,
        optionA: 5,
        optionB: 5,
      },
    ]);
  };

  const removeFactor = (index: number) => {
    if (factors.length <= 2) return;

    setFactors((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const reset = () => {
    setOptionAName("Option A");
    setOptionBName("Option B");

    setFactors([
      {
        name: "Cost",
        weight: 25,
        optionA: 7,
        optionB: 8,
      },
      {
        name: "Benefit",
        weight: 25,
        optionA: 8,
        optionB: 7,
      },
      {
        name: "Risk",
        weight: 20,
        optionA: 6,
        optionB: 8,
      },
      {
        name: "Convenience",
        weight: 15,
        optionA: 9,
        optionB: 7,
      },
      {
        name: "Long-Term Value",
        weight: 15,
        optionA: 8,
        optionB: 9,
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool
            <span className="text-purple-600">
              Voraa
            </span>
          </a>

          <a
            href="/tools/all"
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-12">
          <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
            Smart Decision Tool
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Decision Score
            <span className="text-blue-600">
              {" "}Calculator
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Compare two choices using weighted factors such as
            cost, risk, benefit, convenience and long-term value.
            Get a clear score to help make a more structured decision.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Option Names */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-2xl font-bold">
                Compare Your Options
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Give each option a name, then score each factor from 0 to 10.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Option A">
                  <input
                    type="text"
                    value={optionAName}
                    onChange={(e) =>
                      setOptionAName(e.target.value)
                    }
                    placeholder="Example: Buy"
                    className={inputClass}
                  />
                </Field>

                <Field label="Option B">
                  <input
                    type="text"
                    value={optionBName}
                    onChange={(e) =>
                      setOptionBName(e.target.value)
                    }
                    placeholder="Example: Rent"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Factors */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Decision Factors
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Set importance and score both options.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFactor}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  + Add Factor
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {factors.map((factor, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={factor.name}
                        onChange={(e) =>
                          updateFactor(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeFactor(index)
                        }
                        disabled={factors.length <= 2}
                        className="rounded-md px-2 py-1 text-sm text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <MiniInput
                        label="Importance %"
                        value={factor.weight}
                        max={100}
                        onChange={(value) =>
                          updateFactor(
                            index,
                            "weight",
                            value
                          )
                        }
                      />

                      <MiniInput
                        label={
                          optionAName || "Option A"
                        }
                        value={factor.optionA}
                        max={10}
                        onChange={(value) =>
                          updateFactor(
                            index,
                            "optionA",
                            value
                          )
                        }
                      />

                      <MiniInput
                        label={
                          optionBName || "Option B"
                        }
                        value={factor.optionB}
                        max={10}
                        onChange={(value) =>
                          updateFactor(
                            index,
                            "optionB",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-6 w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              >
                Reset Example
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Winner */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Recommended Choice
              </p>

              <div className="mt-5">
                <div className="text-4xl">
                  🏆
                </div>

                <h2 className="mt-3 text-4xl font-black text-slate-900">
                  {result.winner}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This option currently has the
                  stronger weighted decision score.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <ScoreCard
                  title={
                    optionAName || "Option A"
                  }
                  score={result.optionAScore}
                />

                <ScoreCard
                  title={
                    optionBName || "Option B"
                  }
                  score={result.optionBScore}
                />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>
                    {optionAName || "Option A"}
                  </span>

                  <span>
                    {optionBName || "Option B"}
                  </span>
                </div>

                <div className="flex h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bg-blue-500 transition-all"
                    style={{
                      width: `${
                        result.optionAScore /
                        (result.optionAScore +
                          result.optionBScore || 1) *
                        100
                      }%`,
                    }}
                  />

                  <div
                    className="bg-indigo-500 transition-all"
                    style={{
                      width: `${
                        result.optionBScore /
                        (result.optionAScore +
                          result.optionBScore || 1) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Decision Strength */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Decision Strength
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <InfoBox
                  title="Score Difference"
                  value={`${result.difference} pts`}
                  description="Difference between the two weighted scores."
                />

                <InfoBox
                  title="Confidence"
                  value={result.confidence}
                  description="Larger score gaps generally indicate a clearer decision."
                />
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  A close score means both options
                  may be reasonable. Review the
                  factors that matter most before
                  making the final decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Breakdown */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Factor Comparison
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            See where each option performs better.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-4 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Factor</span>
              <span className="text-center">
                Weight
              </span>
              <span className="text-center">
                {optionAName || "Option A"}
              </span>
              <span className="text-center">
                {optionBName || "Option B"}
              </span>
            </div>

            {factors.map((factor, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-t border-slate-200 px-4 py-4 text-sm"
              >
                <span className="font-semibold text-slate-700">
                  {factor.name}
                </span>

                <span className="text-center text-slate-500">
                  {factor.weight}%
                </span>

                <span
                  className={`text-center font-bold ${
                    factor.optionA >
                    factor.optionB
                      ? "text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  {factor.optionA}/10
                </span>

                <span
                  className={`text-center font-bold ${
                    factor.optionB >
                    factor.optionA
                      ? "text-indigo-600"
                      : "text-slate-700"
                  }`}
                >
                  {factor.optionB}/10
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="⚖️"
            title="Compare Two Choices"
            description="Evaluate two options side-by-side instead of relying only on instinct."
          />

          <FeatureCard
            icon="🎯"
            title="Weighted Priorities"
            description="Give more importance to the factors that matter most to your decision."
          />

          <FeatureCard
            icon="📊"
            title="Clear Score"
            description="Get a simple score out of 100 for each option and see the stronger choice."
          />
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-amber-700">
              Note:
            </strong>{" "}
            This calculator is a decision-support
            tool. Scores depend entirely on the
            importance and ratings you enter.
            Important personal, legal, medical or
            financial decisions may require
            professional advice.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ToolVoraa.
            Free online tools for smarter decisions.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="hover:text-blue-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-blue-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-blue-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function MiniInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      <input
        type="number"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(e) =>
          onChange(
            clamp(
              Number(e.target.value) || 0,
              0,
              max
            )
          )
        }
        className={inputClass}
      />
    </div>
  );
}

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="truncate text-xs font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {score}
        <span className="text-sm font-medium text-slate-400">
          /100
        </span>
      </p>
    </div>
  );
}

function InfoBox({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-blue-600">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}