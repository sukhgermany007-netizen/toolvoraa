"use client";

import { useState } from "react";

const platformOptions = ["Instagram", "Facebook", "LinkedIn", "YouTube", "X / Twitter", "Pinterest"];

export default function ContentCalendarGeneratorPage() {
  const [business, setBusiness] = useState("");
  const [audience, setAudience] = useState("");
  const [pillars, setPillars] = useState("");
  const [campaign, setCampaign] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Instagram", "Facebook"]);
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("14 Days");
  const [frequency, setFrequency] = useState("5 posts per week");
  const [includeVideoIdeas, setIncludeVideoIdeas] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  function togglePlatform(platform: string) {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );
  }

  async function generate() {
    setError("");
    setCopied(false);

    if (business.trim().length < 3) {
      setError("Please enter your business, brand or content niche.");
      return;
    }

    if (!platforms.length) {
      setError("Please select at least one platform.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai/content-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business,
          audience,
          pillars,
          campaign,
          platforms,
          language,
          duration,
          frequency,
          includeVideoIdeas,
          includeCta,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "AUTH_REQUIRED") throw new Error("Please log in first to use this Pro tool.");
        if (data.code === "PRO_REQUIRED") throw new Error("ToolVoraa Pro is required for this tool. Open Pricing to upgrade.");
        throw new Error(data.error || "Unable to generate the content calendar.");
      }

      if (!data.text) throw new Error("The AI did not return a valid content calendar.");

      setResult(data.text);
      setUsage({
        used: data.dailyUsed,
        limit: data.dailyLimit,
        remaining: data.dailyRemaining,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy automatically. Please copy the calendar manually.");
    }
  }

  function clearAll() {
    setBusiness("");
    setAudience("");
    setPillars("");
    setCampaign("");
    setPlatforms(["Instagram", "Facebook"]);
    setLanguage("English");
    setDuration("14 Days");
    setFrequency("5 posts per week");
    setIncludeVideoIdeas(true);
    setIncludeCta(true);
    setResult("");
    setError("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Tool<span className="text-purple-600">Voraa</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">PRO</span>
            <a href="/tools/all" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-700">
              ← All Tools
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">🗓️</div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-purple-600">ToolVoraa Pro</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">AI Content Calendar Generator</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Plan 7, 14 or 30 days of social content across multiple platforms with structured topics, hooks, CTAs and notes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-6 px-5 py-8 lg:grid-cols-[1fr_0.95fr] sm:py-10">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Brand & Content Details</h2>
            <p className="mt-1 text-sm text-slate-500">Tell the AI what you create content for.</p>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Business / Brand / Niche *</label>
            <textarea
              value={business}
              onChange={(e) => {
                setBusiness(e.target.value);
                setError("");
              }}
              rows={5}
              maxLength={1600}
              placeholder="Example: ToolVoraa provides online calculators, AI tools, PDF tools and image utilities for small businesses and everyday users."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. Small business owners, creators, freelancers" maxLength={400} />
              <Input label="Content Pillars" value={pillars} onChange={setPillars} placeholder="e.g. Education, tips, product demos, success stories" maxLength={1000} />
            </div>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Campaign / Offer / Priority</label>
            <textarea
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              rows={3}
              maxLength={700}
              placeholder="Optional: Add a current launch, offer, product focus or campaign priority."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Calendar Settings</h2>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Platforms</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {platformOptions.map((platform) => {
                const active = platforms.includes(platform);
                return (
                  <button
                    type="button"
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-purple-300"
                    }`}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Select label="Duration" value={duration} onChange={setDuration} options={["7 Days", "14 Days", "30 Days"]} />
              <Select label="Posting Frequency" value={frequency} onChange={setFrequency} options={["3 posts per week", "5 posts per week", "Daily", "2 posts per day"]} />
              <Select label="Language" value={language} onChange={setLanguage} options={["English", "Hindi", "Punjabi"]} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Toggle label="Include Reel / video ideas" checked={includeVideoIdeas} onChange={setIncludeVideoIdeas} />
              <Toggle label="Include CTA suggestions" checked={includeCta} onChange={setIncludeCta} />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p className="font-bold">Unable to generate content calendar</p>
              <p className="mt-1">{error}</p>
              {error.includes("log in") && <a href="/login" className="mt-3 inline-block font-bold underline">Log in</a>}
              {error.includes("Pricing") && <a href="/pricing" className="mt-3 inline-block font-bold underline">Open Pricing</a>}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="min-h-12 flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating Calendar..." : "✦ Generate Content Calendar"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Generated Calendar</h2>
                {usage && (
                  <p className="mt-1 text-xs text-slate-500">
                    Pro usage today: {usage.used}/{usage.limit} · {usage.remaining} remaining
                  </p>
                )}
              </div>

              {result && (
                <button
                  type="button"
                  onClick={copyResult}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              )}
            </div>

            {result ? (
              <div className="min-h-[700px] overflow-auto p-5 sm:p-6">
                <pre className="min-w-[760px] whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">{result}</pre>
              </div>
            ) : (
              <div className="flex min-h-[700px] items-center justify-center px-8 py-12 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">🗓️</div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">Your content plan will appear here</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose your platforms and schedule, then generate a structured multi-day calendar.
                  </p>
                  <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-left text-xs leading-5 text-purple-800">
                    <strong>Tip:</strong> Add 3–5 clear content pillars to get a more balanced calendar.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-purple-600"
      />
    </label>
  );
}
