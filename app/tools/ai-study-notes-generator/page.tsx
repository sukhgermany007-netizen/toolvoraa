"use client";

import { useState } from "react";

type Tone =
  | "Simple"
  | "Academic"
  | "Exam Focused"
  | "Beginner Friendly"
  | "Detailed"
  | "Concise";

type Length = "Short" | "Medium" | "Detailed";

type Language = "English" | "Hindi" | "Punjabi";

type NotesType =
  | "General Notes"
  | "Exam Revision"
  | "Key Points"
  | "Definitions"
  | "Question Answers"
  | "Quick Summary";

export default function AIStudyNotesGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [studyMaterial, setStudyMaterial] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const [notesType, setNotesType] =
    useState<NotesType>("General Notes");

  const [tone, setTone] = useState<Tone>("Simple");
  const [length, setLength] = useState<Length>("Medium");
  const [language, setLanguage] = useState<Language>("English");

  const [generatedNotes, setGeneratedNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const notesTypes: NotesType[] = [
    "General Notes",
    "Exam Revision",
    "Key Points",
    "Definitions",
    "Question Answers",
    "Quick Summary",
  ];

  const tones: Tone[] = [
    "Simple",
    "Academic",
    "Exam Focused",
    "Beginner Friendly",
    "Detailed",
    "Concise",
  ];

  const lengths: Length[] = ["Short", "Medium", "Detailed"];

  const generateNotes = async () => {
    setError("");
    setCopied(false);

    if (!topic.trim() && !studyMaterial.trim()) {
      setError(
        "Please enter a topic or paste study material."
      );
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Create useful study notes using the information below.

Topic:
${topic.trim() || "Not specified"}

Subject:
${subject.trim() || "Not specified"}

Class / Level:
${classLevel.trim() || "Not specified"}

Study Material:
${studyMaterial.trim() || "No study material provided"}

Notes Type:
${notesType}

Writing Style:
${tone}

Length:
${length}

Language:
${language}

Requirements:
- Create clear, structured and useful study notes.
- Respect the selected notes type.
- Match the selected writing style and length.
- Use the requested language.
- If study material is provided, base the notes primarily on that material.
- Do not invent facts that are not supported by the supplied content.
- If only a topic is provided, explain it using general educational knowledge.
- Use clear headings.
- Use bullet points where useful.
- Highlight key definitions and important concepts.
- Make difficult ideas easy to understand.
- Avoid unnecessary repetition.
- For Exam Revision, focus on high-value revision points.
- For Definitions, provide concise definitions of important terms.
- For Question Answers, create useful study questions followed by answers.
- For Quick Summary, keep the notes compact and focused.
- Do not explain your reasoning.
- Do not write "Here are your notes".
- Return only the final study notes.
`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "study-notes",
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
            "Unable to generate study notes. Please try again."
        );
      }

      if (!data.text || typeof data.text !== "string") {
        throw new Error(
          "The AI did not return valid study notes. Please try again."
        );
      }

      setGeneratedNotes(data.text.trim());
    } catch (error: unknown) {
      let errorMessage =
        "Unable to generate study notes right now. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyNotes = async () => {
    if (!generatedNotes) return;

    try {
      await navigator.clipboard.writeText(generatedNotes);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the study notes. Please copy them manually."
      );
    }
  };

  const regenerateNotes = () => {
    if (!loading) {
      generateNotes();
    }
  };

  const clearAll = () => {
    setTopic("");
    setStudyMaterial("");
    setSubject("");
    setClassLevel("");

    setNotesType("General Notes");
    setTone("Simple");
    setLength("Medium");
    setLanguage("English");

    setGeneratedNotes("");
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
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
            📘
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-600">
            AI Study Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI Study Notes Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Turn topics or study material into clear, structured and
            revision-friendly notes in seconds.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Exam Revision
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Key Points
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Question Answers
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
            {/* Study Input */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Study Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter a topic or paste your study material.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Topic
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={topic}
                    onChange={(event) => {
                      setTopic(event.target.value);
                      setError("");
                    }}
                    maxLength={200}
                    placeholder="e.g. Photosynthesis"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subject
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    maxLength={120}
                    placeholder="e.g. Biology"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Class / Study Level
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  type="text"
                  value={classLevel}
                  onChange={(event) =>
                    setClassLevel(event.target.value)
                  }
                  maxLength={100}
                  placeholder="e.g. Class 10, College, Beginner"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Study Material
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional if topic is provided
                  </span>
                </label>

                <textarea
                  value={studyMaterial}
                  onChange={(event) => {
                    setStudyMaterial(event.target.value);
                    setError("");
                  }}
                  maxLength={10000}
                  rows={10}
                  placeholder="Paste your chapter, lecture notes, article or study text here..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    For best results, paste accurate study material.
                  </p>

                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {studyMaterial.length}/10000
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Notes Format
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the type of study notes you want.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {notesTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setNotesType(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      notesType === item
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Notes Style
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how the notes should be written.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Writing Style
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {tones.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      tone === item
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50/50"
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
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
                      Unable to generate notes
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
                onClick={generateNotes}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Notes...
                  </span>
                ) : (
                  "✦ Generate Study Notes"
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-sm">
                      📘
                    </div>

                    <h2 className="font-bold text-slate-900">
                      AI Study Notes Preview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your generated notes before using them.
                  </p>
                </div>

                {generatedNotes && (
                  <button
                    type="button"
                    onClick={copyNotes}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </div>

              {generatedNotes ? (
                <>
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {notesType}
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

                  <div className="min-h-[650px] p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {generatedNotes}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copyNotes}
                      className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                    >
                      {copied ? "Copied ✓" : "Copy Notes"}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateNotes}
                      disabled={loading}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      ↻ Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[740px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-2xl">
                      📘
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your study notes will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Enter a topic or paste study material, then choose your
                      preferred notes format.
                    </p>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Quick Tip
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Pasting your own study material helps keep the generated
                        notes focused on the content you are actually studying.
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
                    Verify important facts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    AI-generated notes can contain mistakes. Check important
                    facts, formulas and definitions against your textbook or
                    trusted study material.
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
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-600">
            Learn More Efficiently
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Turn Study Material Into Clear Notes
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Create revision notes, definitions, key points and question-answer
            sets without manually rewriting every chapter.
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
              className="transition hover:text-cyan-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-cyan-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="transition hover:text-cyan-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}