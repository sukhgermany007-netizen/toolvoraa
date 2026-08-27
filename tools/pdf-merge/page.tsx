"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );

    setFiles(selectedFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files.");
      return;
    }

    try {
      setMerging(true);

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes as BlobPart], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged-document.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to merge PDF files.");
    } finally {
      setMerging(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-blue-400 mb-4">
            📄 PDF Utility Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PDF Merge
          </h1>

          <p className="text-slate-400 text-lg">
            Merge multiple PDF files into one PDF quickly and easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

          {/* Upload */}
          <label className="block border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition">
            <div className="text-5xl mb-4">📄</div>

            <h2 className="text-xl font-semibold mb-2">
              Select PDF Files
            </h2>

            <p className="text-slate-400 mb-5">
              Choose two or more PDF files to merge
            </p>

            <span className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
              Choose PDF Files
            </span>

            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-8">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Selected Files
                </h2>

                <span className="text-slate-400">
                  {files.length} PDF
                  {files.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl">📄</span>

                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {index + 1}. {file.name}
                        </p>

                        <p className="text-sm text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 px-3 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Merge Button */}
              <button
                onClick={mergePDFs}
                disabled={files.length < 2 || merging}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 py-4 rounded-xl font-bold text-lg transition"
              >
                {merging
                  ? "Merging PDFs..."
                  : "Merge PDFs & Download"}
              </button>

              {files.length < 2 && (
                <p className="text-center text-yellow-400 text-sm mt-3">
                  Select at least 2 PDF files.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Fast</h3>
            <p className="text-sm text-slate-400">
              Merge PDFs quickly in your browser.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Private</h3>
            <p className="text-sm text-slate-400">
              Files are processed locally in your browser.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-2xl mb-2">📥</div>
            <h3 className="font-semibold mb-1">Easy Download</h3>
            <p className="text-sm text-slate-400">
              Download your merged PDF instantly.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}