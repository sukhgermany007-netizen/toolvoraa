"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState(0.9);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

    try {
      const pdfjsLib = await loadPdfJs();

      const arrayBuffer = await selectedFile.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      setFile(selectedFile);
      setPageCount(pdf.numPages);
      setProgress(0);
    } catch (error) {
      console.error(error);
      alert("Unable to read this PDF file.");
      setFile(null);
      setPageCount(0);
    }
  };

  const convertToJpg = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const pdfjsLib = await loadPdfJs();

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      const zip = new JSZip();

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);

        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (result) => resolve(result),
            "image/jpeg",
            quality
          );
        });

        if (!blob) {
          throw new Error("Unable to create JPG.");
        }

        zip.file(`page-${pageNumber}.jpg`, blob);

        const currentProgress = Math.round(
          (pageNumber / pdf.numPages) * 90
        );

        setProgress(currentProgress);
      }

      setProgress(95);

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "pdf-to-jpg-images.zip";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setProgress(100);

      alert("PDF successfully converted to JPG images.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while converting the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setProgress(0);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            🖼️ Free PDF Tool
          </div>

          <h1 className="text-4xl font-bold">
            PDF to JPG
          </h1>

          <p className="mt-3 text-slate-400">
            Convert PDF pages into high-quality JPG images.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-purple-950/10">
          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-12 text-center transition hover:border-purple-500 hover:bg-purple-500/5">
              <div className="mb-4 text-5xl">
                📄
              </div>

              <span className="text-lg font-semibold">
                Choose PDF File
              </span>

              <span className="mt-2 text-sm text-slate-400">
                Click here to upload your PDF
              </span>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div>
              {/* File Information */}
              <div className="rounded-xl bg-slate-800 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="break-all font-semibold">
                      {file.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {pageCount} page
                      {pageCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-4xl">
                    🖼️
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="mt-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-center text-sm text-purple-300">
                🔒 Your PDF is processed directly in your browser.
                Your file is not uploaded to a server.
              </div>

              {/* Quality */}
              <div className="mt-6">
                <h2 className="mb-3 text-lg font-bold">
                  JPG Quality
                </h2>

                <select
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value={0.7}>
                    Standard Quality
                  </option>

                  <option value={0.9}>
                    High Quality
                  </option>

                  <option value={1}>
                    Maximum Quality
                  </option>
                </select>
              </div>

              {/* Convert Button */}
              <button
                onClick={convertToJpg}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-4 font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {loading
                  ? `Converting... ${progress}%`
                  : "Convert PDF to JPG"}
              </button>

              {/* Progress */}
              {loading && (
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm text-slate-400">
                    <span>Creating JPG images...</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Reset */}
              {!loading && (
                <button
                  onClick={resetTool}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-6 py-4 font-semibold text-slate-300 transition hover:border-purple-500 hover:text-white"
                >
                  Convert Another PDF
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
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