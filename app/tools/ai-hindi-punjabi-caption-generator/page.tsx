"use client";

import { useState } from "react";

const languageStyles = [
  "Hindi",
  "Punjabi (Gurmukhi)",
  "Hinglish",
  "Punjabi-English Mix",
] as const;

const tones = [
  "Natural",
  "Professional",
  "Friendly",
  "Emotional",
  "Funny",
  "Promotional",
  "Devotional",
] as const;

export default function HindiPunjabiCaptionGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [cta, setCta] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [languageStyle, setLanguageStyle] = useState("Hindi");
  const [tone, setTone] = useState("Natural");
  const [length, setLength] = useState("Standard");
  const [count, setCount] = useState(5);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(false);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  async function generate() {
    setError("");
    setCopied(false);

    if (topic.trim().length < 3) {
      setError("Please enter your post or caption topic.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai/hindi-punjabi-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience,
          keywords,
          cta,
          platform,
          languageStyle,
          tone,
          length,
          count,
          includeEmoji,
          includeHashtags,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "AUTH_REQUIRED") {
          throw new Error("Please log in first to use this Pro tool.");
        }

        if (data.code === "PRO_REQUIRED") {
          throw new Error("ToolVoraa Pro is required for this tool. Open Pricing to upgrade.");
        }

        throw new Error(data.error || "Unable to generate captions.");
      }

      if (!data.text) {
        throw new Error("The AI did not return valid captions.");
      }

      setResult(data.text);
      setUsage({
        used: data.dailyUsed,
        limit: data.dailyLimit,
        remaining: data.dailyRemaining,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
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
      setError("Unable to copy automatically. Please copy the captions manually.");
    }
  }

  function clearAll() {
    setTopic("");
    setAudience("");
    setKeywords("");
    setCta("");
    setPlatform("Instagram");
    setLanguageStyle("Hindi");
    setTone("Natural");
    setLength("Standard");
    setCount(5);
    setIncludeEmoji(true);
    setIncludeHashtags(false);
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
            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
              PRO
            </span>

            <a
              href="/tools/all"
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
            >
              ← All Tools
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
            अ / ੳ
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-purple-600">
            ToolVoraa Pro
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Hindi & Punjabi Caption Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create natural Hindi, Punjabi, Hinglish and Punjabi-English social media captions without robotic translation.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Hindi", "Punjabi Gurmukhi", "Hinglish", "Punjabi-English Mix"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-6 px-5 py-8 lg:grid-cols-[1fr_0.95fr] sm:py-10">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Caption Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Describe the post, product, photo, Reel or message.
            </p>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
              Topic / Post Details *
            </label>

            <textarea
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError("");
              }}
              rows={5}
              maxLength={1600}
              placeholder="Example: New Punjabi clothing collection launch with traditional suits for festive season"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {topic.length}/1600
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label="Target Audience"
                value={audience}
                onChange={setAudience}
                placeholder="e.g. Punjabi women, local customers"
                maxLength={350}
              />

              <Input
                label="Keywords"
                value={keywords}
                onChange={setKeywords}
                placeholder="e.g. Punjabi suits, festive wear"
                maxLength={400}
              />
            </div>

            <div className="mt-5">
              <Input
                label="Call to Action"
                value={cta}
                onChange={setCta}
                placeholder="e.g. DM us to order / Visit our website"
                maxLength={300}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Caption Settings</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Select
                label="Platform"
                value={platform}
                onChange={setPlatform}
                options={["Instagram", "Facebook", "Instagram Reel", "Facebook Reel", "WhatsApp Status"]}
              />

              <Select
                label="Language Style"
                value={languageStyle}
                onChange={setLanguageStyle}
                options={[...languageStyles]}
              />

              <Select
                label="Tone"
                value={tone}
                onChange={setTone}
                options={[...tones]}
              />

              <Select
                label="Length"
                value={length}
                onChange={setLength}
                options={["Short", "Standard", "Detailed"]}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Caption Options
              </label>

              <div className="grid max-w-md grid-cols-3 gap-2">
                {[3, 5, 10].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setCount(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                      count === item
                        ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-purple-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Use emojis"
                checked={includeEmoji}
                onChange={setIncludeEmoji}
              />

              <Toggle
                label="Add hashtags"
                checked={includeHashtags}
                onChange={setIncludeHashtags}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p className="font-bold">Unable to generate captions</p>
              <p className="mt-1">{error}</p>

              {error.includes("log in") && (
                <a href="/login" className="mt-3 inline-block font-bold underline">
                  Log in
                </a>
              )}

              {error.includes("Pricing") && (
                <a href="/pricing" className="mt-3 inline-block font-bold underline">
                  Open Pricing
                </a>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="min-h-12 flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating Captions..." : "✦ Generate Captions"}
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
                <h2 className="font-bold text-slate-900">Generated Captions</h2>

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
                  {copied ? "Copied ✓" : "Copy All"}
                </button>
              )}
            </div>

            {result ? (
              <div className="min-h-[660px] whitespace-pre-wrap p-5 text-sm leading-7 text-slate-700 sm:p-6">
                {result}
              </div>
            ) : (
              <div className="flex min-h-[660px] items-center justify-center px-8 py-12 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-xl font-black text-purple-700">
                    अ / ੳ
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Your captions will appear here
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose a natural regional language style and generate multiple ready-to-post captions.
                  </p>

                  <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-left text-xs leading-5 text-purple-800">
                    <strong>Tip:</strong> For Punjabi, choose Gurmukhi when you want fully Punjabi-script captions and Punjabi-English Mix for a more conversational social style.
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
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
