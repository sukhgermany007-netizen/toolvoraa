"use client";

import { useState } from "react";

type Tone =
  | "Professional"
  | "Persuasive"
  | "Luxury"
  | "Friendly"
  | "Minimal"
  | "Energetic";

type Length = "Short" | "Medium" | "Detailed";

type Language = "English" | "Hindi" | "Punjabi";

type Platform =
  | "General"
  | "Amazon"
  | "Flipkart"
  | "Shopify"
  | "Website"
  | "Social Media";

export default function AIProductDescriptionGeneratorPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywords, setKeywords] = useState("");

  const [platform, setPlatform] = useState<Platform>("General");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [language, setLanguage] = useState<Language>("English");

  const [generatedDescription, setGeneratedDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const platforms: Platform[] = [
    "General",
    "Amazon",
    "Flipkart",
    "Shopify",
    "Website",
    "Social Media",
  ];

  const tones: Tone[] = [
    "Professional",
    "Persuasive",
    "Luxury",
    "Friendly",
    "Minimal",
    "Energetic",
  ];

  const lengths: Length[] = ["Short", "Medium", "Detailed"];

  const generateDescription = async () => {
    setError("");
    setCopied(false);

    if (!productName.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!features.trim()) {
      setError("Please enter the product features or key details.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Create a professional ecommerce product description using the following information.

Product Name:
${productName.trim()}

Product Category:
${category.trim() || "Not specified"}

Key Features / Product Details:
${features.trim()}

Target Audience:
${targetAudience.trim() || "General customers"}

SEO Keywords:
${keywords.trim() || "No specific keywords provided"}

Platform:
${platform}

Tone:
${tone}

Length:
${length}

Language:
${language}

Requirements:
- Write a polished and ready-to-use product description.
- Focus on genuine product benefits as well as supplied features.
- Make the description suitable for the selected platform.
- Match the selected tone and length.
- Write in the selected language.
- Use SEO keywords naturally when provided.
- Do not keyword stuff.
- Do not invent specifications, certifications, warranties, discounts,
  materials, dimensions or claims that were not supplied.
- Do not make unsupported medical, safety or performance claims.
- Keep the wording natural and persuasive.
- Use short paragraphs and bullet points when they improve readability.
- Do not explain how you created the description.
- Do not write "Here is your product description".
- Return only the final ready-to-use product description.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "product-description",
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
            "Unable to generate product description. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return a valid product description. Please try again."
        );
      }

      setGeneratedDescription(data.text.trim());
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate product description right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyDescription = async () => {
    if (!generatedDescription) return;

    try {
      await navigator.clipboard.writeText(generatedDescription);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the product description. Please copy it manually."
      );
    }
  };

  const regenerateDescription = () => {
    if (!loading) {
      generateDescription();
    }
  };

  const clearAll = () => {
    setProductName("");
    setCategory("");
    setFeatures("");
    setTargetAudience("");
    setKeywords("");

    setPlatform("General");
    setTone("Professional");
    setLength("Medium");
    setLanguage("English");

    setGeneratedDescription("");
    setError("");
    setCopied(false);
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
            🛍️
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">
            AI Ecommerce Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Product Description Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create polished, persuasive and ecommerce-ready product
            descriptions from your product details in seconds.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Ecommerce Ready
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              SEO Friendly
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Multiple Platforms
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
          {/* Left Column */}
          <div className="space-y-5">
            {/* Product Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Product Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell the AI what you are selling.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={productName}
                    onChange={(event) => {
                      setProductName(event.target.value);
                      setError("");
                    }}
                    maxLength={120}
                    placeholder="e.g. UrbanFlex Travel Backpack"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {productName.length}/120
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Category
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    maxLength={100}
                    placeholder="e.g. Bags & Travel"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {category.length}/100
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Key Features / Product Details
                </label>

                <textarea
                  value={features}
                  onChange={(event) => {
                    setFeatures(event.target.value);
                    setError("");
                  }}
                  maxLength={3000}
                  rows={7}
                  placeholder={`Example:
Water-resistant fabric
15.6-inch laptop compartment
USB charging port
Padded shoulder straps
30L capacity`}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Add one feature per line for more accurate results.
                  </p>

                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {features.length}/3000
                  </span>
                </div>
              </div>
            </div>

            {/* Audience & Platform */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Audience & Platform
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tailor the description for the right customers and store.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selling Platform
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {platforms.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlatform(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      platform === item
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target Audience
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(event) =>
                      setTargetAudience(event.target.value)
                    }
                    maxLength={200}
                    placeholder="e.g. Students and professionals"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    SEO Keywords
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={keywords}
                    onChange={(event) => setKeywords(event.target.value)}
                    maxLength={250}
                    placeholder="e.g. travel backpack, laptop bag"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Writing Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Description Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how the final product description should sound.
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
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Length
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {lengths.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setLength(item)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                          length === item
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
                      Unable to generate description
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
                onClick={generateDescription}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Description...
                  </span>
                ) : (
                  "✦ Generate Description"
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

          {/* Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">
                      ✦
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Product Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated description before publishing.
                  </p>
                </div>

                {generatedDescription && (
                  <button
                    type="button"
                    onClick={copyDescription}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </div>

              {generatedDescription ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {platform}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {tone}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {length}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {language}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-[500px] p-6">
                    {productName && (
                      <h3 className="mb-5 text-xl font-black text-slate-950">
                        {productName}
                      </h3>
                    )}

                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {generatedDescription}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyDescription}
                      className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      {copied ? "Copied ✓" : "Copy Description"}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateDescription}
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
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-2xl">
                      🛍️
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your description will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add your product information and click Generate
                      Description to create professional ecommerce content.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Add accurate features, materials, dimensions and
                        benefits for a more useful product description.
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
                    Verify product information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Check specifications, claims, pricing and other important
                    product information before publishing AI-generated content.
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
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">
            Sell With Better Content
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Product Descriptions, Made Faster
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Create product copy for ecommerce stores, marketplaces, websites
            and social media without starting from a blank page.
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
              className="transition hover:text-emerald-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-emerald-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-emerald-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}