"use client";

import { useState } from "react";

type PageType =
  | "General Page"
  | "Blog Post"
  | "Product Page"
  | "Service Page"
  | "Homepage"
  | "Landing Page";

type Tone =
  | "Professional"
  | "Persuasive"
  | "Informative"
  | "Friendly"
  | "Direct"
  | "Premium";

type Language = "English" | "Hindi" | "Punjabi";

export default function AISeoMetaGeneratorPage() {
  const [pageTopic, setPageTopic] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [brandName, setBrandName] = useState("");
  const [pageDescription, setPageDescription] = useState("");

  const [pageType, setPageType] =
    useState<PageType>("General Page");

  const [tone, setTone] = useState<Tone>("Professional");
  const [language, setLanguage] =
    useState<Language>("English");

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);

  const pageTypes: PageType[] = [
    "General Page",
    "Blog Post",
    "Product Page",
    "Service Page",
    "Homepage",
    "Landing Page",
  ];

  const tones: Tone[] = [
    "Professional",
    "Persuasive",
    "Informative",
    "Friendly",
    "Direct",
    "Premium",
  ];

  const generateMeta = async () => {
    setError("");
    setCopiedTitle(false);
    setCopiedDescription(false);

    if (!pageTopic.trim()) {
      setError("Please enter the page topic.");
      return;
    }

    if (!primaryKeyword.trim()) {
      setError("Please enter the primary SEO keyword.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Generate professional SEO metadata using the information below.

Page Type:
${pageType}

Page Topic:
${pageTopic.trim()}

Primary Keyword:
${primaryKeyword.trim()}

Secondary Keywords:
${secondaryKeywords.trim() || "None provided"}

Brand Name:
${brandName.trim() || "Not provided"}

Page Description / Context:
${pageDescription.trim() || "No additional page context provided"}

Tone:
${tone}

Language:
${language}

Requirements:
- Create one SEO title and one meta description.
- Use the primary keyword naturally.
- Use secondary keywords only when they fit naturally.
- Match the selected page type.
- Match the selected tone.
- Use the requested language.
- Keep the SEO title concise and suitable for search results.
- Aim for roughly 50 to 60 characters when practical.
- Keep the meta description concise and compelling.
- Aim for roughly 140 to 160 characters when practical.
- Do not keyword stuff.
- Do not invent claims, prices, guarantees or awards.
- Do not add quotation marks around the title or description.
- Do not explain your reasoning.
- Return the result in exactly this format:

SEO Title:
Your title here

Meta Description:
Your meta description here
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "seo-meta",
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
          data.error ||
            "Unable to generate SEO metadata. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return valid SEO metadata. Please try again."
        );
      }

      const text = data.text.trim();

      const titleMatch = text.match(
        /SEO Title:\s*([\s\S]*?)(?=\n\s*Meta Description:|$)/i
      );

      const descriptionMatch = text.match(
        /Meta Description:\s*([\s\S]*)/i
      );

      const parsedTitle = titleMatch?.[1]?.trim() || "";
      const parsedDescription =
        descriptionMatch?.[1]?.trim() || "";

      if (!parsedTitle || !parsedDescription) {
        throw new Error(
          "The AI response could not be formatted correctly. Please try again."
        );
      }

      setSeoTitle(parsedTitle);
      setMetaDescription(parsedDescription);
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate SEO metadata right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = async () => {
    if (!seoTitle) return;

    try {
      await navigator.clipboard.writeText(seoTitle);
      setCopiedTitle(true);

      window.setTimeout(() => {
        setCopiedTitle(false);
      }, 2000);
    } catch {
      setError("Unable to copy the SEO title.");
    }
  };

  const copyDescription = async () => {
    if (!metaDescription) return;

    try {
      await navigator.clipboard.writeText(metaDescription);
      setCopiedDescription(true);

      window.setTimeout(() => {
        setCopiedDescription(false);
      }, 2000);
    } catch {
      setError("Unable to copy the meta description.");
    }
  };

  const regenerateMeta = () => {
    if (!loading) {
      generateMeta();
    }
  };

  const clearAll = () => {
    setPageTopic("");
    setPrimaryKeyword("");
    setSecondaryKeywords("");
    setBrandName("");
    setPageDescription("");

    setPageType("General Page");
    setTone("Professional");
    setLanguage("English");

    setSeoTitle("");
    setMetaDescription("");

    setError("");
    setCopiedTitle(false);
    setCopiedDescription(false);
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
            🔍
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-violet-600">
            AI SEO Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI SEO Meta Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Generate SEO-friendly titles and meta descriptions for pages,
            products, services and blog posts.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              SEO Titles
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Meta Descriptions
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Keyword Focused
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              English, Hindi & Punjabi
            </span>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.92fr]">
          {/* Left */}
          <div className="space-y-5">
            {/* Page Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Page Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell the AI what your webpage is about.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Page Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {pageTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPageType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      pageType === item
                        ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Page Topic
                </label>

                <input
                  type="text"
                  value={pageTopic}
                  onChange={(event) => {
                    setPageTopic(event.target.value);
                    setError("");
                  }}
                  maxLength={250}
                  placeholder="e.g. Free Online Invoice Generator"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Page Description / Context
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <textarea
                  value={pageDescription}
                  onChange={(event) =>
                    setPageDescription(event.target.value)
                  }
                  maxLength={2500}
                  rows={6}
                  placeholder="Explain what the page offers, who it is for and its main benefits."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <div className="mt-2 text-right text-xs font-medium text-slate-400">
                  {pageDescription.length}/2500
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    SEO Keywords
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the keywords you want the metadata to focus on.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Primary Keyword
              </label>

              <input
                type="text"
                value={primaryKeyword}
                onChange={(event) => {
                  setPrimaryKeyword(event.target.value);
                  setError("");
                }}
                maxLength={150}
                placeholder="e.g. free invoice generator"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Secondary Keywords
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={secondaryKeywords}
                    onChange={(event) =>
                      setSecondaryKeywords(event.target.value)
                    }
                    maxLength={300}
                    placeholder="e.g. GST invoice maker, online invoice"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Brand Name
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={brandName}
                    onChange={(event) =>
                      setBrandName(event.target.value)
                    }
                    maxLength={120}
                    placeholder="e.g. ToolVoraa"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Metadata Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control the tone and language of the SEO metadata.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Language
                </label>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as Language)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-red-600">⚠</div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to generate SEO metadata
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
                onClick={generateMeta}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating SEO Metadata...
                  </span>
                ) : (
                  "✦ Generate SEO Meta"
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
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">
                    🔍
                  </div>

                  <h2 className="font-bold text-slate-900">
                    AI SEO Meta Preview
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Review your generated metadata before publishing.
                </p>
              </div>

              {seoTitle && metaDescription ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {pageType}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {tone}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {language}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-[590px] space-y-5 p-5 sm:p-6">
                    {/* SEO Title */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                            SEO Title
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {seoTitle.length} characters
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={copyTitle}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                        >
                          {copiedTitle ? "Copied ✓" : "Copy"}
                        </button>
                      </div>

                      <p className="text-lg font-bold leading-7 text-slate-950">
                        {seoTitle}
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            seoTitle.length <= 60
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (seoTitle.length / 60) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Recommended target: roughly 50–60 characters.
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                            Meta Description
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {metaDescription.length} characters
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={copyDescription}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                        >
                          {copiedDescription ? "Copied ✓" : "Copy"}
                        </button>
                      </div>

                      <p className="text-sm leading-7 text-slate-700">
                        {metaDescription}
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            metaDescription.length <= 160
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (metaDescription.length / 160) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Recommended target: roughly 140–160 characters.
                      </p>
                    </div>

                    {/* Search Result Preview */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Search Preview
                      </p>

                      <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-xs text-slate-500">
                          example.com › page
                        </p>

                        <p className="mt-1 text-lg font-medium leading-6 text-blue-700">
                          {seoTitle}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {metaDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyTitle}
                      className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                    >
                      {copiedTitle ? "Copied ✓" : "Copy SEO Title"}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateMeta}
                      disabled={loading}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      ↻ Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[700px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-2xl">
                      🔍
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your SEO metadata will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add your page topic and target keyword, then generate an
                      SEO title and meta description.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Use one clear primary keyword and describe the page
                        accurately. Avoid stuffing too many keywords into the
                        metadata.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="flex gap-3">
                <div>⚠</div>

                <div>
                  <p className="text-sm font-bold text-amber-800">
                    SEO results are not guaranteed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Search engines may rewrite titles and descriptions. Always
                    review AI-generated metadata for accuracy and relevance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="border-t border-slate-200 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600">
            Better Search Presentation
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Create SEO Metadata Faster
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Generate page titles and meta descriptions for websites, blogs,
            products, services and landing pages without starting from scratch.
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
              className="transition hover:text-violet-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-violet-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-violet-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}