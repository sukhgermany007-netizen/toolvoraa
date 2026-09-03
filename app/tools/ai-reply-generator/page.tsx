"use client";

import { useState } from "react";

type Tone =
  | "Professional"
  | "Friendly"
  | "Polite"
  | "Confident"
  | "Formal"
  | "Casual";

type Length = "Short" | "Medium" | "Detailed";

type Language = "English" | "Hindi" | "Punjabi";

type ReplyType =
  | "General"
  | "Business"
  | "Customer Support"
  | "Job"
  | "Sales"
  | "Personal";

export default function AIReplyGeneratorPage() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");

  const [replyType, setReplyType] = useState<ReplyType>("General");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [language, setLanguage] = useState<Language>("English");

  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const replyTypes: ReplyType[] = [
    "General",
    "Business",
    "Customer Support",
    "Job",
    "Sales",
    "Personal",
  ];

  const tones: Tone[] = [
    "Professional",
    "Friendly",
    "Polite",
    "Confident",
    "Formal",
    "Casual",
  ];

  const lengths: Length[] = ["Short", "Medium", "Detailed"];

  const generateReply = async () => {
    setError("");
    setCopied(false);

    if (!message.trim()) {
      setError("Please enter the message you want to reply to.");
      return;
    }

    if (message.trim().length < 3) {
      setError("Please enter a valid message.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Create a professional ready-to-send reply using the following details.

Reply Type:
${replyType}

Original Message:
${message.trim()}

Additional Context:
${context.trim() || "No additional context provided."}

Tone:
${tone}

Length:
${length}

Language:
${language}

Requirements:
- Reply directly to the original message.
- Respect the selected reply type.
- Match the requested tone.
- Match the requested length.
- Use the requested language.
- Do not invent facts, dates, prices, promises, refunds, commitments, or personal details.
- Keep the response natural and human.
- Avoid robotic wording.
- Do not explain the response.
- Return only the ready-to-send reply.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "reply-generator",
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
          data.error || "Unable to generate reply. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return a valid reply. Please try again."
        );
      }

      setGeneratedReply(data.text.trim());
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate reply right now. Please try again.";

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
      setError("Unable to copy the reply. Please copy it manually.");
    }
  };

  const clearAll = () => {
    setMessage("");
    setContext("");
    setReplyType("General");
    setTone("Professional");
    setLength("Medium");
    setLanguage("English");
    setGeneratedReply("");
    setError("");
    setCopied(false);
  };

  const regenerateReply = () => {
    if (!loading) {
      generateReply();
    }
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            💬
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-indigo-600">
            AI Communication Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Reply Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Turn any message into a clear, professional and ready-to-send reply
            in seconds.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Fast Replies
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Multiple Tones
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
            {/* Message */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Original Message
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Paste the message you received.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message to Reply To
              </label>

              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
                maxLength={4000}
                rows={7}
                placeholder="Example: Hi, I wanted to check if the project will be ready by Friday. Please confirm."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Paste an email, WhatsApp message, customer message or any text.
                </p>

                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {message.length}/4000
                </span>
              </div>
            </div>

            {/* Context */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Reply Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Give the AI useful context for a better reply.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reply Type
              </label>

              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {replyTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReplyType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      replyType === item
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Additional Context
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <textarea
                value={context}
                onChange={(event) => setContext(event.target.value)}
                maxLength={1500}
                rows={4}
                placeholder="Example: The project will be ready Thursday evening. Ask the client to review it on Friday morning."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <div className="mt-2 text-right text-xs font-medium text-slate-400">
                {context.length}/1500
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Reply Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how your reply should sound.
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
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
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
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Reply...
                  </span>
                ) : (
                  "✦ Generate Reply"
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-sm">
                      ✦
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Reply Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated reply before sending.
                  </p>
                </div>

                {generatedReply && (
                  <button
                    type="button"
                    onClick={copyReply}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
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
                        {replyType}
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

                  <div className="min-h-[430px] p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {generatedReply}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyReply}
                      className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
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
                <div className="flex min-h-[540px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-2xl">
                      💬
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your reply will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Paste a message, choose your preferred tone and click
                      Generate Reply.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Add useful context such as deadlines, decisions or
                        desired actions for a more accurate reply.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex gap-3">
                <div>🔒</div>

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Review before sending
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Always verify generated replies before sending important
                    business or personal messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="border-t border-slate-200 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-indigo-600">
            Fast & Professional
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Reply Better, In Seconds
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Use ToolVoraa AI Reply Generator for customer messages, work
            conversations, emails, sales enquiries and everyday communication.
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
              className="transition hover:text-indigo-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-indigo-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-indigo-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}