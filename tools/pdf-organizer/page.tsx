"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfOrganizer() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      const bytes = new Uint8Array(
        await selectedFile.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(bytes);
      const pageCount = pdfDoc.getPageCount();

      setFile(selectedFile);
      setPages(
        Array.from({ length: pageCount }, (_, index) => index)
      );
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Could not read this PDF file.");
    }
  };

  const movePage = (
    currentIndex: number,
    direction: "up" | "down"
  ) => {
    const newPages = [...pages];

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= newPages.length
    ) {
      return;
    }

    [
      newPages[currentIndex],
      newPages[targetIndex],
    ] = [
      newPages[targetIndex],
      newPages[currentIndex],
    ];

    setPages(newPages);
  };

  const removePage = (index: number) => {
    if (pages.length <= 1) {
      alert("A PDF must contain at least one page.");
      return;
    }

    const newPages = pages.filter(
      (_, pageIndex) => pageIndex !== index
    );

    setPages(newPages);
  };

  const organizePdf = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (pages.length === 0) {
      alert("Please keep at least one page.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Organizing PDF...");

      const bytes = new Uint8Array(
        await file.arrayBuffer()
      );

      const sourcePdf = await PDFDocument.load(bytes);
      const outputPdf = await PDFDocument.create();

      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        pages
      );

      copiedPages.forEach((page) => {
        outputPdf.addPage(page);
      });

      const pdfBytes = await outputPdf.save();

      const outputBuffer = new Uint8Array(
        pdfBytes
      ).buffer as ArrayBuffer;

      const blob = new Blob([outputBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "organized-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setMessage(
        "PDF successfully organized and downloaded."
      );

      alert("PDF successfully organized!");
    } catch (error) {
      console.error(error);
      setMessage("");

      alert(
        "Could not organize this PDF. Please try another file."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Page Organizer
          </h1>

          <p className="text-gray-600 mt-2">
            Reorder, remove and organize PDF pages easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {!file ? (
            <>
              {/* Upload */}
              <label
                htmlFor="pdf-upload"
                className="block cursor-pointer"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition">

                  <div className="text-5xl mb-4">
                    📄
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Choose PDF File
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Click here to upload your PDF
                  </p>

                  <p className="text-sm text-gray-400 mt-3">
                    PDF files only
                  </p>

                </div>
              </label>

              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            <>
              {/* File Information */}
              <div className="bg-gray-100 rounded-xl p-5 mb-6">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-semibold text-gray-900 break-all">
                      {file.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {pages.length} pages remaining
                    </p>
                  </div>

                  <button
                    onClick={resetTool}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-white disabled:opacity-50"
                  >
                    Change
                  </button>

                </div>

              </div>

              {/* Page List */}
              <div className="mb-6">

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-xl font-bold text-gray-900">
                    Organize Pages
                  </h2>

                  <span className="text-sm text-gray-500">
                    {pages.length} pages
                  </span>

                </div>

                <div className="space-y-3">

                  {pages.map((originalPage, index) => (
                    <div
                      key={`${originalPage}-${index}`}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >

                      <div className="flex items-center gap-4">

                        {/* Page Number */}
                        <div className="w-14 h-14 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {index + 1}
                        </div>

                        {/* Page Info */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            Page {originalPage + 1}
                          </p>

                          <p className="text-sm text-gray-500">
                            Original page {originalPage + 1}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              movePage(index, "up")
                            }
                            disabled={
                              index === 0 || loading
                            }
                            className="w-10 h-10 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 disabled:opacity-40"
                            title="Move Up"
                          >
                            ↑
                          </button>

                          <button
                            onClick={() =>
                              movePage(index, "down")
                            }
                            disabled={
                              index === pages.length - 1 ||
                              loading
                            }
                            className="w-10 h-10 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 disabled:opacity-40"
                            title="Move Down"
                          >
                            ↓
                          </button>

                          <button
                            onClick={() =>
                              removePage(index)
                            }
                            disabled={loading}
                            className="px-4 h-10 border border-red-200 text-red-600 rounded-lg font-semibold bg-white hover:bg-red-50 disabled:opacity-40"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* Privacy */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔒 Your PDF is processed directly in your browser.
                  Your file is not uploaded to a server.
                </p>
              </div>

              {/* Download */}
              <button
                onClick={organizePdf}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading
                  ? "Organizing PDF..."
                  : "📄 Organize & Download PDF"}
              </button>

              {/* Reset */}
              <button
                onClick={resetTool}
                disabled={loading}
                className="w-full mt-3 border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Organize Another PDF
              </button>

              {/* Message */}
              {message && (
                <div className="mt-5 text-center text-sm text-green-600 font-medium">
                  {message}
                </div>
              )}

            </>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your PDF is processed directly in your browser.
        </p>

      </div>
    </main>
  );
}