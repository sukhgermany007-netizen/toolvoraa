"use client";

import { useState } from "react";

const tones = ["Professional", "Friendly", "Exciting", "Educational", "Minimal"] as const;
const videoTypes = ["General Video", "Tutorial", "Review", "Business", "Vlog", "YouTube Short"] as const;

export default function YouTubeDescriptionGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("");
  const [channelName, setChannelName] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [links, setLinks] = useState("");
  const [videoType, setVideoType] = useState("General Video");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("Standard");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeChapters, setIncludeChapters] = useState(false);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  async function generate() {
    setError("");
    setCopied(false);

    if (topic.trim().length < 3) {
      setError("Please enter your YouTube video topic.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/youtube-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          keywords,
          audience,
          channelName,
          callToAction,
          links,
          videoType,
          tone,
          language,
          length,
          includeHashtags,
          includeChapters,
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
        throw new Error(data.error || "Unable to generate the description.");
      }

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
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy automatically. Please copy the description manually.");
    }
  }

  function clearAll() {
    setTopic("");
    setKeywords("");
    setAudience("");
    setChannelName("");
    setCallToAction("");
    setLinks("");
    setVideoType("General Video");
    setTone("Professional");
    setLanguage("English");
    setLength("Standard");
    setIncludeHashtags(true);
    setIncludeChapters(false);
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">▶️</div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-purple-600">
            ToolVoraa Pro
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI YouTube Description Generator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create polished, SEO-friendly YouTube descriptions with keywords, calls to action,
            optional chapter placeholders and relevant hashtags.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_0.95fr] sm:py-10">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Video Details</h2>
            <p className="mt-1 text-sm text-slate-500">Tell the AI what your video is about.</p>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Video Topic *</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={1600}
              rows={5}
              placeholder="Example: How to start an online business in India with a small budget"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
            <div className="mt-2 text-right text-xs text-slate-400">{topic.length}/1600</div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Keywords" value={keywords} onChange={setKeywords} placeholder="online business, startup, India" maxLength={400} />
              <Input label="Target Audience" value={audience} onChange={setAudience} placeholder="Beginners, creators, entrepreneurs" maxLength={250} />
              <Input label="Channel Name" value={channelName} onChange={setChannelName} placeholder="Your channel name" maxLength={120} />
              <Input label="Call to Action" value={callToAction} onChange={setCallToAction} placeholder="Subscribe, visit website, comment..." maxLength={300} />
            </div>

            <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Links to Include</label>
            <textarea
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              maxLength={800}
              rows={3}
              placeholder={"Paste only the exact links you want included\nhttps://example.com"}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Content Settings</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Select label="Video Type" value={videoType} onChange={setVideoType} options={[...videoTypes]} />
              <Select label="Tone" value={tone} onChange={setTone} options={[...tones]} />
              <Select label="Language" value={language} onChange={setLanguage} options={["English", "Hindi", "Punjabi"]} />
              <Select label="Length" value={length} onChange={setLength} options={["Short", "Standard", "Detailed"]} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Toggle label="Add relevant hashtags" checked={includeHashtags} onChange={setIncludeHashtags} />
              <Toggle label="Add chapter placeholders" checked={includeChapters} onChange={setIncludeChapters} />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p className="font-bold">Unable to generate description</p>
              <p className="mt-1">{error}</p>
              {error.includes("log in") && (
                <a href="/login" className="mt-3 inline-block font-bold underline">Log in</a>
              )}
              {error.includes("Pricing") && (
                <a href="/pricing" className="mt-3 inline-block font-bold underline">Open Pricing</a>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="min-h-12 flex-1 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating Description..." : "✦ Generate Description"}
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

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Generated Description</h2>
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
              <div className="min-h-[620px] whitespace-pre-wrap p-5 text-sm leading-7 text-slate-700 sm:p-6">
                {result}
              </div>
            ) : (
              <div className="flex min-h-[620px] items-center justify-center px-8 py-12 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">✦</div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">Your description will appear here</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add your video details and choose your settings. ToolVoraa Pro will create a
                    ready-to-paste YouTube description.
                  </p>
                  <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-left text-xs leading-5 text-purple-800">
                    <strong>Pro tip:</strong> Add your main keyword and exact links for the most useful output.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
          {[
            ["SEO-friendly", "Uses your keywords naturally without keyword stuffing."],
            ["Safe output", "Never invents links, sponsors, claims or contact details."],
            ["Multilingual", "Generate descriptions in English, Hindi or Punjabi."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
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
