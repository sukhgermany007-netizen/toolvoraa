"use client";

import { useState } from "react";

type Tone =
  | "Professional"
  | "Curiosity"
  | "Exciting"
  | "Educational"
  | "Bold"
  | "Minimal";

type Style =
  | "General"
  | "How-To"
  | "List"
  | "Comparison"
  | "Tutorial"
  | "Story";

type Language = "English" | "Hindi" | "Punjabi";

export default function AIYouTubeTitleGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("");
  const [channelName, setChannelName] = useState("");

  const [style, setStyle] = useState<Style>("General");
  const [tone, setTone] = useState<Tone>("Curiosity");
  const [language, setLanguage] = useState<Language>("English");
  const [count, setCount] = useState(10);

  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const styles: Style[] = [
    "General",
    "How-To",
    "List",
    "Comparison",
    "Tutorial",
    "Story",
  ];

  const tones: Tone[] = [
    "Professional",
    "Curiosity",
    "Exciting",
    "Educational",
    "Bold",
    "Minimal",
  ];

  const generateTitles = async () => {
    setError("");
    setCopiedIndex(null);

    if (!topic.trim()) {
      setError("Please enter your YouTube video topic.");
      return;
    }

    if (topic.trim().length < 3) {
      setError("Please enter a valid video topic.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Generate ${count} YouTube title ideas using the following details.

Video Topic:
${topic.trim()}

Keywords:
${keywords.trim() || "No specific keywords provided"}

Target Audience:
${audience.trim() || "General YouTube audience"}

Channel Name:
${channelName.trim() || "Not provided"}

Title Style:
${style}

Tone:
${tone}

Language:
${language}

Requirements:
- Generate exactly ${count} unique YouTube titles.
- Make each title clear, relevant and clickable.
- Match the selected style and tone.
- Use the requested language.
- Use supplied keywords naturally when relevant.
- Avoid misleading clickbait.
- Avoid fake claims and exaggerated promises.
- Avoid repeating the same title structure.
- Keep titles concise and readable.
- Do not add explanations.
- Do not add numbering.
- Return only one title per line.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "youtube-title",
          prompt,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The AI server returned an invalid response. Please try again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to generate YouTube titles. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return valid YouTube titles. Please try again."
        );
      }

      const titles = data.text
        .split("\n")
        .map((item: string) =>
          item
            .replace(/^\s*[-•]\s*/, "")
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .trim()
        )
        .filter(Boolean)
        .slice(0, count);

      if (!titles.length) {
        throw new Error(
          "The AI did not return any usable titles. Please try again."
        );
      }

      setGeneratedTitles(titles);
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate YouTube titles right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      setError("Unable to copy the title. Please copy it manually.");
    }
  };

  const copyAllTitles = async () => {
    if (!generatedTitles.length) return;

    try {
      await navigator.clipboard.writeText(generatedTitles.join("\n"));
      setCopiedIndex(-1);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      setError("Unable to copy the titles. Please copy them manually.");
    }
  };

  const clearAll = () => {
    setTopic("");
    setKeywords("");
    setAudience("");
    setChannelName("");

    setStyle("General");
    setTone("Curiosity");
    setLanguage("English");
    setCount(10);

    setGeneratedTitles([]);
    setError("");
    setCopiedIndex(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool<span className="text-purple-600">Voraa</span>
          </a>

          <a
            href="/tools/all"
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ▶️
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-red-600">
            AI YouTube Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI YouTube Title Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Generate clickable, relevant and professional YouTube title ideas
            for your next video in seconds.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Clickable Titles
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Multiple Styles
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              SEO Friendly
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              English, Hindi & Punjabi
            </span>
          </div>
        </div>
      </section>

      {/* Tool Area */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.92fr]">
          {/* Left Side */}
          <div className="space-y-5">
            {/* Topic */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Video Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell the AI what your YouTube video is about.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Video Topic
              </label>

              <textarea
                value={topic}
                onChange={(event) => {
                  setTopic(event.target.value);
                  setError("");
                }}
                maxLength={1200}
                rows={5}
                placeholder="Example: How to start a successful online business in India with a small budget"
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />

              <div className="mt-2 text-right text-xs font-medium text-slate-400">
                {topic.length}/1200
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Keywords
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={keywords}
                    onChange={(event) => setKeywords(event.target.value)}
                    maxLength={250}
                    placeholder="e.g. online business, India, startup"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target Audience
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                    maxLength={200}
                    placeholder="e.g. Beginners and entrepreneurs"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Channel Name
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  type="text"
                  value={channelName}
                  onChange={(event) => setChannelName(event.target.value)}
                  maxLength={120}
                  placeholder="e.g. ToolVoraa"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Title Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the format and feel of the generated titles.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Style
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {styles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      style === item
                        ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
                Tone
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {tones.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      tone === item
                        ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Settings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Output Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose how many titles you want and the language.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Number of Titles
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCount(item)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                          count === item
                            ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-red-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Language
                  </label>

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as Language)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-red-600">⚠</div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to generate titles
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateTitles}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Titles...
                  </span>
                ) : (
                  "✦ Generate Titles"
                )}
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

          {/* Right Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-sm">
                      ▶
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Title Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated YouTube title ideas.
                  </p>
                </div>

                {generatedTitles.length > 0 && (
                  <button
                    type="button"
                    onClick={copyAllTitles}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-300 hover:text-red-700"
                  >
                    {copiedIndex === -1 ? "Copied ✓" : "Copy All"}
                  </button>
                )}
              </div>

              {generatedTitles.length > 0 ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {style}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {tone}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {language}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {generatedTitles.length} Titles
                      </span>
                    </div>
                  </div>

                  <div className="min-h-[530px] space-y-3 p-5">
                    {generatedTitles.map((title, index) => (
                      <div
                        key={`${title}-${index}`}
                        className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-black text-red-600">
                          {index + 1}
                        </div>

                        <p className="flex-1 text-sm font-semibold leading-6 text-slate-800">
                          {title}
                        </p>

                        <button
                          type="button"
                          onClick={() => copyTitle(title, index)}
                          className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:border-red-300 hover:text-red-600"
                        >
                          {copiedIndex === index ? "Copied ✓" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyAllTitles}
                      className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      {copiedIndex === -1 ? "Copied ✓" : "Copy All Titles"}
                    </button>

                    <button
                      type="button"
                      onClick={generateTitles}
                      disabled={loading}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      ↻ Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[610px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-2xl">
                      ▶️
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your titles will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Enter your video topic and choose your preferred style to
                      generate YouTube title ideas.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Include your main topic and important keywords for more
                        relevant and searchable title suggestions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="flex gap-3">
                <div>✓</div>

                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Avoid misleading clickbait
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Choose a title that accurately represents your video while
                    still being clear and interesting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="border-t border-slate-200 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-600">
            Create Better Titles
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            More Ideas, Less Guesswork
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Generate YouTube title ideas for tutorials, business videos,
            reviews, educational content, stories and more.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 ToolVoraa. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="/privacy"
              className="transition hover:text-red-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-red-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-red-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}