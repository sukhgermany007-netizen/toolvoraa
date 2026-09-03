"use client";

import { useState } from "react";

type Tone =
  | "Professional"
  | "Formal"
  | "Firm"
  | "Polite"
  | "Assertive"
  | "Calm";

type Length = "Short" | "Medium" | "Detailed";

type Language = "English" | "Hindi" | "Punjabi";

type ComplaintType =
  | "Product"
  | "Service"
  | "Billing"
  | "Delivery"
  | "Workplace"
  | "Other";

export default function AIComplaintLetterGeneratorPage() {
  const [recipient, setRecipient] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [desiredResolution, setDesiredResolution] = useState("");
  const [referenceDetails, setReferenceDetails] = useState("");
  const [senderName, setSenderName] = useState("");

  const [complaintType, setComplaintType] =
    useState<ComplaintType>("Service");

  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [language, setLanguage] = useState<Language>("English");

  const [generatedLetter, setGeneratedLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const complaintTypes: ComplaintType[] = [
    "Product",
    "Service",
    "Billing",
    "Delivery",
    "Workplace",
    "Other",
  ];

  const tones: Tone[] = [
    "Professional",
    "Formal",
    "Firm",
    "Polite",
    "Assertive",
    "Calm",
  ];

  const lengths: Length[] = ["Short", "Medium", "Detailed"];

  const generateLetter = async () => {
    setError("");
    setCopied(false);

    if (!complaintSubject.trim()) {
      setError("Please enter the complaint subject.");
      return;
    }

    if (!issueDetails.trim()) {
      setError("Please describe the complaint issue.");
      return;
    }

    if (!desiredResolution.trim()) {
      setError("Please enter the resolution you are requesting.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Write a professional complaint letter using the following information.

Complaint Type:
${complaintType}

Recipient:
${recipient.trim() || "Not specified"}

Company / Organization:
${companyName.trim() || "Not specified"}

Complaint Subject:
${complaintSubject.trim()}

Issue Details:
${issueDetails.trim()}

Requested Resolution:
${desiredResolution.trim()}

Reference / Order / Account Details:
${referenceDetails.trim() || "Not provided"}

Sender Name:
${senderName.trim() || "Not provided"}

Tone:
${tone}

Length:
${length}

Language:
${language}

Requirements:
- Write a complete ready-to-send complaint letter.
- Clearly explain the problem.
- State the requested resolution clearly.
- Keep the tone respectful, professional and appropriate.
- Match the selected tone and length.
- Use the requested language.
- Use only facts supplied by the user.
- Do not invent dates, order numbers, account numbers, prices, conversations or events.
- Do not invent legal rights, laws, regulations or legal threats.
- Do not make abusive, insulting or threatening statements.
- Do not falsely accuse any person or company of wrongdoing.
- If reference details are provided, include them naturally.
- If a sender name is provided, sign the letter naturally.
- Do not explain your reasoning.
- Do not write "Here is your complaint letter".
- Return only the final complaint letter.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "complaint-letter",
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
            "Unable to generate complaint letter. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return a valid complaint letter. Please try again."
        );
      }

      setGeneratedLetter(data.text.trim());
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate complaint letter right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = async () => {
    if (!generatedLetter) return;

    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the complaint letter. Please copy it manually."
      );
    }
  };

  const regenerateLetter = () => {
    if (!loading) {
      generateLetter();
    }
  };

  const clearAll = () => {
    setRecipient("");
    setCompanyName("");
    setComplaintSubject("");
    setIssueDetails("");
    setDesiredResolution("");
    setReferenceDetails("");
    setSenderName("");

    setComplaintType("Service");
    setTone("Professional");
    setLength("Medium");
    setLanguage("English");

    setGeneratedLetter("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
            📝
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-rose-600">
            AI Writing Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Complaint Letter Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create clear, professional and respectful complaint letters for
            products, services, billing, delivery and more.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Professional Writing
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Multiple Complaint Types
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Clear Resolution Request
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              English, Hindi & Punjabi
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Complaint Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell the AI what happened.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {complaintTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setComplaintType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      complaintType === item
                        ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Recipient
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    maxLength={120}
                    placeholder="e.g. Customer Service Manager"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company / Organization
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(event.target.value)
                    }
                    maxLength={150}
                    placeholder="e.g. ABC Electronics"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Complaint Subject
                </label>

                <input
                  type="text"
                  value={complaintSubject}
                  onChange={(event) => {
                    setComplaintSubject(event.target.value);
                    setError("");
                  }}
                  maxLength={200}
                  placeholder="e.g. Complaint regarding delayed product delivery"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Describe the Issue
                </label>

                <textarea
                  value={issueDetails}
                  onChange={(event) => {
                    setIssueDetails(event.target.value);
                    setError("");
                  }}
                  maxLength={4000}
                  rows={8}
                  placeholder="Explain what happened, when it happened and any relevant details."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                />

                <div className="mt-2 text-right text-xs font-medium text-slate-400">
                  {issueDetails.length}/4000
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Resolution & Reference
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell the recipient what outcome you are requesting.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Desired Resolution
              </label>

              <textarea
                value={desiredResolution}
                onChange={(event) => {
                  setDesiredResolution(event.target.value);
                  setError("");
                }}
                maxLength={2000}
                rows={5}
                placeholder="Example: I would like the order to be delivered within two working days or receive a full refund."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
              />

              <div className="mt-2 text-right text-xs font-medium text-slate-400">
                {desiredResolution.length}/2000
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Reference Details
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={referenceDetails}
                    onChange={(event) =>
                      setReferenceDetails(event.target.value)
                    }
                    maxLength={300}
                    placeholder="e.g. Order #12345"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Your Name
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={senderName}
                    onChange={(event) =>
                      setSenderName(event.target.value)
                    }
                    maxLength={120}
                    placeholder="e.g. Sukhwinder Singh"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Letter Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how your complaint letter should sound.
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
                        ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/50"
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
                            ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-rose-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-red-600">⚠</div>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to generate complaint letter
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateLetter}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Letter...
                  </span>
                ) : (
                  "✦ Generate Complaint Letter"
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

          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-sm">
                      📝
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Complaint Letter Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated letter before sending.
                  </p>
                </div>

                {generatedLetter && (
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </div>

              {generatedLetter ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {complaintType}
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

                  <div className="min-h-[600px] p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {generatedLetter}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyLetter}
                      className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
                    >
                      {copied ? "Copied ✓" : "Copy Letter"}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateLetter}
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
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-2xl">
                      📝
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your complaint letter will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add the complaint details and requested resolution, then
                      generate a professional ready-to-send letter.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Include accurate dates, order numbers and specific facts
                        when available. Avoid adding information you cannot
                        verify.
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
                    Check important facts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Review names, dates, order details, claims and requested
                    remedies before sending an AI-generated complaint letter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="border-t border-slate-200 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-600">
            Clear & Professional
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Write Better Complaint Letters
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Turn your complaint details into a structured letter without
            struggling with wording or formatting.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 ToolVoraa. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="/privacy"
              className="transition hover:text-rose-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-rose-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-rose-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}