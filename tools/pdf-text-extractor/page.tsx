"use client";

import { useState } from "react";

export default function PdfTextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // PDF.js को केवल browser में load करें
  const loadPdfJs = async () => {
    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    return pdfjsLib;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setText("");
    setCopied(false);
    setProgress(0);
    setPageCount(0);

    try {
      const pdfjsLib = await loadPdfJs();

      const arrayBuffer = await selectedFile.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      setPageCount(pdf.numPages);
    } catch (error) {
      console.error(error);

      alert("Could not read this PDF file.");

      setFile(null);
      setPageCount(0);
    }
  };

  const extractText = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setText("");
    setCopied(false);
    setProgress(5);

    try {
      const pdfjsLib = await loadPdfJs();

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      let completeText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const pageText = content.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ");

        completeText += `\n\n--- Page ${pageNumber} ---\n\n`;
        completeText += pageText;

        const currentProgress = Math.round(
          5 + (pageNumber / pdf.numPages) * 90
        );

        setProgress(currentProgress);
      }

      setText(completeText.trim());
      setProgress(100);

      alert("PDF text successfully extracted!");
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while extracting PDF text."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      alert("Could not copy the text.");
    }
  };

  const downloadText = () => {
    if (!text) {
      alert("Please extract the PDF text first.");
      return;
    }

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "extracted-text.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setText("");
    setProgress(0);
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            📄 Free PDF Tool
          </div>

          <h1 className="text-4xl font-bold">
            PDF Text Extractor
          </h1>

          <p className="mt-3 text-slate-400">
            Extract text from PDF files quickly and easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-purple-950/10 md:p-8">
          {!file ? (
            <label className="block cursor-pointer">
              <div className="rounded-xl border-2 border-dashed border-slate-700 p-12 text-center transition hover:border-purple-500 hover:bg-purple-500/5">
                <div className="mb-4 text-5xl">
                  📄
                </div>

                <h2 className="text-xl font-semibold">
                  Choose PDF File
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Click here to upload your PDF
                </p>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>
          ) : (
            <>
              {/* File Information */}
              <div className="mb-6 flex flex-col gap-4 rounded-xl bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="break-all font-semibold">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {pageCount}{" "}
                    {pageCount === 1 ? "page" : "pages"}
                  </p>
                </div>

                <button
                  onClick={resetTool}
                  disabled={loading}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-semibold transition hover:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Change
                </button>
              </div>

              {/* Privacy */}
              <div className="mb-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-center text-sm text-purple-300">
                🔒 Your PDF is processed directly in your
                browser. Your file is not uploaded to a server.
              </div>

              {/* Extract Button */}
              <button
                onClick={extractText}
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 py-4 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {loading
                  ? `Extracting Text... ${progress}%`
                  : "📄 Extract Text from PDF"}
              </button>

              {/* Progress */}
              {loading && (
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm text-slate-400">
                    <span>
                      Extracting PDF text...
                    </span>

                    <span>{progress}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all duration-200"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Extracted Text */}
              {text && !loading && (
                <div className="mt-8">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold">
                      Extracted Text
                    </h2>

                    <span className="text-sm text-slate-400">
                      {text.length.toLocaleString()} characters
                    </span>
                  </div>

                  <textarea
                    value={text}
                    onChange={(e) =>
                      setText(e.target.value)
                    }
                    className="h-96 w-full resize-y rounded-xl border border-slate-700 bg-slate-800 p-4 font-mono text-sm leading-6 text-white outline-none transition focus:border-purple-500"
                  />

                  {/* Action Buttons */}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <button
                      onClick={copyText}
                      className="rounded-xl border border-slate-700 bg-slate-800 py-3 font-semibold transition hover:border-purple-500"
                    >
                      {copied
                        ? "✅ Text Copied!"
                        : "📋 Copy Text"}
                    </button>

                    <button
                      onClick={downloadText}
                      className="rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-500"
                    >
                      ⬇️ Download TXT
                    </button>
                  </div>

                  <button
                    onClick={resetTool}
                    className="mt-4 w-full rounded-xl border border-slate-700 py-3 font-semibold text-slate-300 transition hover:border-purple-500 hover:text-white"
                  >
                    Extract Another PDF
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span>
            🔒 Files are processed in your browser.
          </span>

          <a
            href="/tools/all"
            className="text-purple-400 transition hover:text-purple-300"
          >
            ← Back to All Tools
          </a>
        </div>
      </div>
    </main>
  );
}