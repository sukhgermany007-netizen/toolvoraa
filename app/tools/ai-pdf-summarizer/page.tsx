"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";

type SummaryLength =
  | "short"
  | "medium"
  | "detailed";

type PdfSummaryResult = {
  title: string;
  summary: string;
  keyPoints: string[];
  importantDetails: string[];
  actionItems: string[];
  topics: string[];
};

export default function AIPdfSummarizerPage() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [
    summaryLength,
    setSummaryLength,
  ] =
    useState<SummaryLength>(
      "medium"
    );

  const [
    customInstructions,
    setCustomInstructions,
  ] = useState("");

  const [
    result,
    setResult,
  ] =
    useState<PdfSummaryResult | null>(
      null
    );

  const [
    analyzedFileName,
    setAnalyzedFileName,
  ] = useState("");

  const [
    extractedCharacters,
    setExtractedCharacters,
  ] = useState(0);

  const [
    processedCharacters,
    setProcessedCharacters,
  ] = useState(0);

  const [truncated, setTruncated] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setResult(null);

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName =
      selectedFile.name.toLowerCase();

    const isPdf =
      fileName.endsWith(".pdf") ||
      selectedFile.type ===
        "application/pdf";

    if (!isPdf) {
      setFile(null);

      setError(
        "Only PDF files are supported."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setFile(null);

      setError(
        "PDF file must be 10 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setAnalyzedFileName("");
    setExtractedCharacters(0);
    setProcessedCharacters(0);
    setTruncated(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const summarizePdf =
    async () => {
      setError("");
      setCopied(false);

      if (!file) {
        setError(
          "Please upload a PDF file first."
        );
        return;
      }

      setLoading(true);
      setResult(null);

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "summaryLength",
          summaryLength
        );

        formData.append(
          "customInstructions",
          customInstructions.trim()
        );

        const response =
          await fetch(
            "/api/ai/pdf-summarize",
            {
              method: "POST",
              body: formData,
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "Unable to summarize this PDF."
          );
        }

        const summaryResult =
          data.result ||
          data.summary;

        if (
          !summaryResult ||
          typeof summaryResult !==
            "object"
        ) {
          throw new Error(
            "The AI did not return a valid PDF summary."
          );
        }

        setResult(summaryResult);

        setAnalyzedFileName(
          data.fileName ||
            file.name
        );

        setExtractedCharacters(
          typeof data.extractedCharacters ===
            "number"
            ? data.extractedCharacters
            : 0
        );

        setProcessedCharacters(
          typeof data.processedCharacters ===
            "number"
            ? data.processedCharacters
            : 0
        );

        setTruncated(
          Boolean(data.truncated)
        );
      } catch (error: unknown) {
        let message =
          "Unable to summarize the PDF right now. Please try again.";

        if (
          error instanceof Error &&
          error.message
        ) {
          message =
            error.message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

  const fullReportText = () => {
    if (!result) return "";

    const lines = [
      "TOOLVORAA AI PDF SUMMARY",
      "",
      result.title,
      "",
      "SUMMARY",
      result.summary,
      "",
    ];

    if (
      result.keyPoints.length > 0
    ) {
      lines.push(
        "KEY POINTS",
        ...result.keyPoints.map(
          (item, index) =>
            `${index + 1}. ${item}`
        ),
        ""
      );
    }

    if (
      result.importantDetails
        .length > 0
    ) {
      lines.push(
        "IMPORTANT DETAILS",
        ...result.importantDetails.map(
          (item) =>
            `• ${item}`
        ),
        ""
      );
    }

    if (
      result.actionItems.length > 0
    ) {
      lines.push(
        "ACTION ITEMS",
        ...result.actionItems.map(
          (item, index) =>
            `${index + 1}. ${item}`
        ),
        ""
      );
    }

    if (
      result.topics.length > 0
    ) {
      lines.push(
        "TOPICS",
        result.topics.join(", ")
      );
    }

    return lines.join("\n").trim();
  };

  const copySummary = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        fullReportText()
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the summary."
      );
    }
  };

  const clearAll = () => {
    setFile(null);
    setSummaryLength("medium");
    setCustomInstructions("");
    setResult(null);
    setAnalyzedFileName("");
    setExtractedCharacters(0);
    setProcessedCharacters(0);
    setTruncated(false);
    setError("");
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Tool
            <span className="text-purple-600">
              Voraa
            </span>
          </a>

          <a
            href="/tools/all"
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            ← Back to All Tools
          </a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
            📘
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-violet-600">
            AI Document Tool
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            AI PDF Summarizer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Upload a PDF and turn long documents into clear summaries, key points, important details and action items.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Real PDF Reading",
              "Short or Detailed Summary",
              "Key Points",
              "Action Items",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Upload PDF
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a readable text-based PDF file.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

              {!file ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="w-full rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-5 py-10 text-center transition hover:border-violet-400 hover:bg-violet-50"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    ↑
                  </div>

                  <p className="mt-4 font-bold text-slate-900">
                    Drop your PDF here
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    or click to browse your computer
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-violet-500">
                    PDF · Maximum 10 MB
                  </p>
                </button>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-5 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">
                    ✓
                  </div>

                  <p className="mt-4 break-all text-sm font-bold text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB · Ready to summarize
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-4 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Change PDF
                  </button>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="mt-4 block w-full text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Remove uploaded PDF
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Summary Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose how detailed you want the summary to be.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Summary Length
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "short",
                      label: "Short",
                      sub: "Quick",
                    },
                    {
                      value: "medium",
                      label: "Medium",
                      sub: "Balanced",
                    },
                    {
                      value: "detailed",
                      label: "Detailed",
                      sub: "Deep",
                    },
                  ].map((item) => {
                    const active =
                      summaryLength ===
                      item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setSummaryLength(
                            item.value as SummaryLength
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-center transition ${
                          active
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                        }`}
                      >
                        <span className="block text-sm font-bold">
                          {item.label}
                        </span>

                        <span className="mt-1 block text-[11px]">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Custom Instructions
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional
                  </span>
                </div>

                <textarea
                  value={
                    customInstructions
                  }
                  onChange={(event) =>
                    setCustomInstructions(
                      event.target.value
                    )
                  }
                  maxLength={1200}
                  rows={6}
                  placeholder="Example: Focus on financial figures, important dates and decisions..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {
                    customInstructions.length
                  }
                  /1200
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm font-bold text-red-700">
                  ⚠ Unable to summarize PDF
                </p>

                <p className="mt-1 text-sm leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={summarizePdf}
                disabled={loading}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Reading & Summarizing PDF...
                  </span>
                ) : (
                  "✦ Summarize PDF"
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
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                    📚
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      PDF Summary
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      AI-generated document overview.
                    </p>
                  </div>
                </div>

                {result && (
                  <button
                    type="button"
                    onClick={copySummary}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                  >
                    {copied
                      ? "Copied ✓"
                      : "Copy"}
                  </button>
                )}
              </div>

              {!result ? (
                <div className="flex min-h-[650px] items-center justify-center px-8 py-12 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
                      📘
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your PDF summary will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Upload a readable PDF and click Summarize PDF.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="max-h-[760px] space-y-5 overflow-y-auto p-5">
                    <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                        Document Summary
                      </p>

                      <h3 className="mt-2 text-xl font-black text-slate-950">
                        {result.title}
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                        {result.summary}
                      </p>
                    </div>

                    <ResultList
                      title="Key Points"
                      icon="✓"
                      items={
                        result.keyPoints
                      }
                    />

                    <ResultList
                      title="Important Details"
                      icon="★"
                      items={
                        result.importantDetails
                      }
                    />

                    {result.actionItems.length >
                      0 && (
                      <ResultList
                        title="Action Items"
                        icon="→"
                        items={
                          result.actionItems
                        }
                      />
                    )}

                    {result.topics.length >
                      0 && (
                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 className="font-bold text-slate-900">
                          Topics
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.topics.map(
                            (
                              item,
                              index
                            ) => (
                              <span
                                key={`${item}-${index}`}
                                className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-400">
                      Analyzed:{" "}
                      {analyzedFileName}

                      {extractedCharacters >
                        0 &&
                        ` · ${extractedCharacters.toLocaleString()} readable characters extracted`}

                      {processedCharacters >
                        0 &&
                        ` · ${processedCharacters.toLocaleString()} characters processed`}
                    </div>

                    {truncated && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                        This PDF was longer than the current AI processing limit, so the summary was generated from the first processed portion of the document.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={copySummary}
                      className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                    >
                      {copied
                        ? "Copied ✓"
                        : "Copy Full Summary"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-bold text-amber-800">
                ⚠ Check important information
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                AI summaries can miss context or make mistakes. Verify important facts, figures and decisions against the original PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm text-slate-500 sm:flex-row">
          <p>
            © 2026 ToolVoraa. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="hover:text-violet-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-violet-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-violet-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ResultList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-black text-violet-700">
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map(
            (item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No specific items were identified.
        </p>
      )}
    </div>
  );
}