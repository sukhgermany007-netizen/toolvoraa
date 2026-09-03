"use client";

import { useState } from "react";

type Tone =
  | "Professional"
  | "Friendly"
  | "Polite"
  | "Warm"
  | "Apologetic"
  | "Confident";

type Length = "Short" | "Medium" | "Detailed";

type Language = "English" | "Hindi" | "Punjabi";

type ReviewType =
  | "Positive"
  | "Neutral"
  | "Negative"
  | "Complaint"
  | "Praise"
  | "Mixed";

type BusinessType =
  | "General Business"
  | "Restaurant"
  | "Hotel"
  | "Ecommerce"
  | "Local Service"
  | "SaaS / Online Business";

export default function AIReviewReplyGeneratorPage() {
  const [review, setReview] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [extraContext, setExtraContext] = useState("");

  const [reviewType, setReviewType] =
    useState<ReviewType>("Positive");

  const [businessType, setBusinessType] =
    useState<BusinessType>("General Business");

  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [language, setLanguage] = useState<Language>("English");

  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const reviewTypes: ReviewType[] = [
    "Positive",
    "Neutral",
    "Negative",
    "Complaint",
    "Praise",
    "Mixed",
  ];

  const businessTypes: BusinessType[] = [
    "General Business",
    "Restaurant",
    "Hotel",
    "Ecommerce",
    "Local Service",
    "SaaS / Online Business",
  ];

  const tones: Tone[] = [
    "Professional",
    "Friendly",
    "Polite",
    "Warm",
    "Apologetic",
    "Confident",
  ];

  const lengths: Length[] = ["Short", "Medium", "Detailed"];

  const generateReply = async () => {
    setError("");
    setCopied(false);

    if (!review.trim()) {
      setError("Please enter the customer review.");
      return;
    }

    if (review.trim().length < 3) {
      setError("Please enter a valid customer review.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Write a professional business reply to the customer review below.

Customer Review:
${review.trim()}

Review Type:
${reviewType}

Business Type:
${businessType}

Customer Name:
${customerName.trim() || "Not provided"}

Business Name:
${businessName.trim() || "Not provided"}

Additional Context:
${extraContext.trim() || "No additional context provided"}

Tone:
${tone}

Length:
${length}

Language:
${language}

Requirements:
- Write a ready-to-post business response.
- Match the review sentiment and selected review type.
- Match the selected tone and length.
- Use the requested language.
- If the review is positive, thank the customer naturally.
- If the review is negative, stay calm, respectful and solution-oriented.
- If the review is mixed, acknowledge both positive and negative points.
- Never argue with or blame the customer.
- Do not invent refunds, compensation, discounts, policies or actions.
- Do not admit legal liability.
- Do not make promises that were not provided in the context.
- Use the customer name naturally only if provided.
- Use the business name naturally only if provided.
- Avoid robotic phrases and repetitive wording.
- Do not explain your reasoning.
- Do not write "Here is your reply".
- Return only the final ready-to-post review response.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "review-reply",
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
            "Unable to generate review reply. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return a valid review reply. Please try again."
        );
      }

      setGeneratedReply(data.text.trim());
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate review reply right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    if (!generatedReply) return;

    try {
      await navigator.clipboard.writeText(generatedReply);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the review reply. Please copy it manually."
      );
    }
  };

  const regenerateReply = () => {
    if (!loading) {
      generateReply();
    }
  };

  const clearAll = () => {
    setReview("");
    setCustomerName("");
    setBusinessName("");
    setExtraContext("");

    setReviewType("Positive");
    setBusinessType("General Business");
    setTone("Professional");
    setLength("Medium");
    setLanguage("English");

    setGeneratedReply("");
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
            ⭐
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-amber-600">
            AI Reputation Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Review Reply Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Generate thoughtful, professional and ready-to-post replies for
            positive, negative and mixed customer reviews.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Positive Reviews
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Negative Reviews
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Business Ready
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
            {/* Review Input */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Customer Review
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Paste the review you want to respond to.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Review
              </label>

              <textarea
                value={review}
                onChange={(event) => {
                  setReview(event.target.value);
                  setError("");
                }}
                maxLength={4000}
                rows={7}
                placeholder="Example: Great service and fast delivery. The product quality was excellent and the staff was very helpful."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Paste a Google review, ecommerce review or customer feedback.
                </p>

                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {review.length}/4000
                </span>
              </div>

              <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
                Review Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {reviewTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReviewType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      reviewType === item
                        ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Business Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add useful context for a more personalized response.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Business Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {businessTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBusinessType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                      businessType === item
                        ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Name
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    maxLength={100}
                    placeholder="e.g. Rahul"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Business Name
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(event.target.value)
                    }
                    maxLength={120}
                    placeholder="e.g. ToolVoraa"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Additional Context
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <textarea
                  value={extraContext}
                  onChange={(event) =>
                    setExtraContext(event.target.value)
                  }
                  maxLength={1500}
                  rows={4}
                  placeholder="Example: We contacted the customer and resolved the delivery issue."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                />

                <div className="mt-2 text-right text-xs font-medium text-slate-400">
                  {extraContext.length}/1500
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Reply Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how your customer response should sound.
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
                        ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/50"
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
                            ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-amber-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
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
                      Unable to generate reply
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
                onClick={generateReply}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Reply...
                  </span>
                ) : (
                  "✦ Generate Review Reply"
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-sm">
                      ⭐
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Review Reply Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated response before posting.
                  </p>
                </div>

                {generatedReply && (
                  <button
                    type="button"
                    onClick={copyReply}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-amber-300 hover:text-amber-700"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </div>

              {generatedReply ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {reviewType}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {businessType}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {tone}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {language}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-[470px] p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {generatedReply}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyReply}
                      className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                    >
                      {copied ? "Copied ✓" : "Copy Reply"}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateReply}
                      disabled={loading}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      ↻ Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[590px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-2xl">
                      ⭐
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your review reply will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Paste a customer review, choose your preferred tone and
                      generate a professional response.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        For negative reviews, add accurate context about any
                        action already taken so the AI can create a more useful
                        response.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex gap-3">
                <div>✓</div>

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Protect your brand reputation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Review every AI-generated response before publishing,
                    especially when handling complaints or sensitive customer
                    issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="border-t border-slate-200 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-600">
            Better Customer Communication
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Respond To Reviews, Faster
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Create thoughtful replies for Google reviews, ecommerce feedback,
            customer complaints and business ratings without starting from
            scratch.
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
              className="transition hover:text-amber-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-amber-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-amber-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}