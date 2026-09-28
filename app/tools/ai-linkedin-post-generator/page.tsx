"use client";

import { useState } from "react";

const goals = [
  "Thought Leadership",
  "Educational",
  "Personal Story",
  "Product / Service",
  "Company Update",
  "Hiring / Recruitment",
  "Event Promotion",
] as const;

const tones = [
  "Professional",
  "Conversational",
  "Authoritative",
  "Friendly",
  "Inspirational",
  "Concise",
] as const;

export default function LinkedInPostGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [personalContext, setPersonalContext] = useState("");
  const [cta, setCta] = useState("");
  const [goal, setGoal] = useState("Thought Leadership");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("Standard");
  const [variants, setVariants] = useState(1);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(false);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  async function generate() {
    setError("");
    setCopied(false);

    if (topic.trim().length < 3) {
      setError("Please enter your LinkedIn post topic.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience,
          keyPoints,
          personalContext,
          cta,
          goal,
          tone,
          language,
          length,
          variants,
          includeHashtags,
          includeEmoji,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "AUTH_REQUIRED") throw new Error("Please log in first to use this Pro tool.");
        if (data.code === "PRO_REQUIRED") throw new Error("ToolVoraa Pro is required for this tool. Open Pricing to upgrade.");
        throw new Error(data.error || "Unable to generate the LinkedIn post.");
      }

      if (!data.text) throw new Error("The AI did not return a valid LinkedIn post.");

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
      setError("Unable to copy automatically. Please copy the post manually.");
    }
  }

  function clearAll() {
    setTopic("");
    setAudience("");
    setKeyPoints("");
    setPersonalContext("");
    setCta("");
    setGoal("Thought Leadership");
    setTone("Professional");
    setLanguage("English");
    setLength("Standard");
    setVariants(1);
    setIncludeHashtags(true);
    setIncludeEmoji(false);
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
            in
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-purple-600">
            ToolVoraa Pro
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI LinkedIn Post Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create polished LinkedIn posts for thought leadership, education,
            announcements, hiring, promotions and professional storytelling.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Strong Hooks", "Professional Structure", "1 or 3 Versions", "English, Hindi & Punjabi"].map((item) => (
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
            <h2 className="text-lg font-bold text-slate-950">Post Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add the facts and ideas you want the post to use.
            </p>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
              Topic / Main Idea *
            </label>

            <textarea
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError("");
              }}
              rows={5}
              maxLength={1800}
              placeholder="Example: Lessons I learned while building a simple online tools website for small businesses"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {topic.length}/1800
            </div>

            <div className="mt-5">
              <Input
                label="Target Audience"
                value={audience}
                onChange={setAudience}
                placeholder="e.g. Founders, marketers, developers"
                maxLength={350}
              />
            </div>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
              Key Points
            </label>

            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={4}
              maxLength={1200}
              placeholder="Add the real facts, lessons, features or points that must appear in the post."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
              Personal Context / Experience
            </label>

            <textarea
              value={personalContext}
              onChange={(e) => setPersonalContext(e.target.value)}
              rows={3}
              maxLength={900}
              placeholder="Optional: Add only real personal experience you want the AI to mention."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <div className="mt-5">
              <Input
                label="Call to Action"
                value={cta}
                onChange={setCta}
                placeholder="e.g. What has your experience been? Share in the comments."
                maxLength={300}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Post Settings</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Select label="Post Goal" value={goal} onChange={setGoal} options={[...goals]} />
              <Select label="Tone" value={tone} onChange={setTone} options={[...tones]} />
              <Select label="Language" value={language} onChange={setLanguage} options={["English", "Hindi", "Punjabi"]} />
              <Select label="Length" value={length} onChange={setLength} options={["Short", "Standard", "Detailed"]} />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Versions
              </label>

              <div className="grid max-w-xs grid-cols-2 gap-2">
                {[1, 3].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setVariants(item)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      variants === item
                        ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-purple-300"
                    }`}
                  >
                    {item} {item === 1 ? "Version" : "Versions"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Toggle label="Add hashtags" checked={includeHashtags} onChange={setIncludeHashtags} />
              <Toggle label="Use emojis" checked={includeEmoji} onChange={setIncludeEmoji} />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p className="font-bold">Unable to generate LinkedIn post</p>
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
              {loading ? "Generating Post..." : "✦ Generate LinkedIn Post"}
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
                <h2 className="font-bold text-slate-900">Generated LinkedIn Post</h2>

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
              <div className="min-h-[680px] whitespace-pre-wrap p-5 text-sm leading-7 text-slate-700 sm:p-6">
                {result}
              </div>
            ) : (
              <div className="flex min-h-[680px] items-center justify-center px-8 py-12 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-xl font-black text-sky-700">
                    in
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Your LinkedIn post will appear here
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add your topic and real key points, then choose the tone and goal to create a polished post.
                  </p>

                  <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-left text-xs leading-5 text-purple-800">
                    <strong>Tip:</strong> Add real personal context only when you want the post to sound personal. The tool is instructed not to invent achievements or experience.
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
