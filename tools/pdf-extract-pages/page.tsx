"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setProgress(20);

      const arrayBuffer = await selectedFile.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const count = pdfDoc.getPageCount();

      setFile(selectedFile);
      setPageCount(count);

      // Select all pages by default
      setSelectedPages(
        Array.from({ length: count }, (_, index) => index)
      );

      setProgress(100);
    } catch (error) {
      console.error(error);
      alert("Unable to read this PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (pageIndex: number) => {
    setSelectedPages((current) => {
      if (current.includes(pageIndex)) {
        return current.filter((page) => page !== pageIndex);
      }

      return [...current, pageIndex].sort((a, b) => a - b);
    });
  };

  const selectAll = () => {
    setSelectedPages(
      Array.from({ length: pageCount }, (_, index) => index)
    );
  };

  const clearPages = () => {
    setSelectedPages([]);
  };

  const extractPages = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setProgress(10);

      const arrayBuffer = await file.arrayBuffer();

      const sourcePdf = await PDFDocument.load(arrayBuffer);

      setProgress(30);

      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(
        sourcePdf,
        selectedPages
      );

      setProgress(60);

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      setProgress(80);

      const pdfBytes = await newPdf.save();

      const blob = new Blob(
        [pdfBytes as unknown as BlobPart],
        {
          type: "application/pdf",
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "extracted-pages.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess(
        "PDF pages successfully extracted and downloaded."
      );

      alert("PDF pages successfully extracted!");
    } catch (error) {
      console.error(error);
      alert(
        "Something went wrong while extracting the PDF pages."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setProgress(0);
    setSuccess("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Extract Pages
          </h1>

          <p className="mt-2 text-gray-600">
            Extract selected pages from a PDF into a new PDF.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">

          {!file ? (
            <>
              {/* Upload Area */}
              <label
                htmlFor="pdf-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-16 text-center transition hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="mb-4 text-5xl">
                  📄
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Choose PDF File
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Click here to upload your PDF
                </p>

                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : (
            <>
              {/* File Information */}
              <div className="rounded-xl bg-gray-100 p-5">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {file.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {pageCount}{" "}
                      {pageCount === 1 ? "page" : "pages"}
                    </p>
                  </div>

                  <button
                    onClick={resetTool}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Change
                  </button>

                </div>
              </div>

              {/* Page Selection */}
              <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">

                  <h2 className="text-xl font-bold text-gray-900">
                    Select Pages
                  </h2>

                  <div className="flex gap-2">

                    <button
                      onClick={selectAll}
                      disabled={loading}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Select All
                    </button>

                    <button
                      onClick={clearPages}
                      disabled={loading}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Clear
                    </button>

                  </div>
                </div>

                {/* Page Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                  {Array.from(
                    { length: pageCount },
                    (_, index) => {
                      const selected =
                        selectedPages.includes(index);

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            togglePage(index)
                          }
                          disabled={loading}
                          className={`rounded-xl border-2 p-5 text-center transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          <div className="text-lg font-bold">
                            Page {index + 1}
                          </div>

                          <div
                            className={`mt-1 text-sm ${
                              selected
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {selected
                              ? "Selected"
                              : "Click to select"}
                          </div>
                        </button>
                      );
                    }
                  )}

                </div>

                {/* Selected Pages */}
                <div className="mt-5 rounded-xl bg-blue-50 p-5">

                  <h3 className="font-semibold text-gray-900">
                    Selected Pages
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {selectedPages.length > 0
                      ? selectedPages
                          .map((page) => page + 1)
                          .join(", ")
                      : "No pages selected"}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {selectedPages.length}{" "}
                    {selectedPages.length === 1
                      ? "page"
                      : "pages"}{" "}
                    selected
                  </p>

                </div>
              </div>

              {/* Progress */}
              {loading && (
                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm text-gray-600">

                    <span>
                      Extracting pages...
                    </span>

                    <span>
                      {progress}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && !loading && (
                <div className="mt-6 rounded-xl bg-green-50 p-4 text-center font-medium text-green-700">
                  ✅ {success}
                </div>
              )}

              {/* Extract Button */}
              <div className="mt-6">

                <button
                  onClick={extractPages}
                  disabled={
                    loading ||
                    selectedPages.length === 0
                  }
                  className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? `Extracting... ${progress}%`
                    : "📄 Extract & Download PDF"}
                </button>

                <button
                  onClick={resetTool}
                  disabled={loading}
                  className="mt-3 w-full rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  Extract Another PDF
                </button>

              </div>
            </>
          )}
        </div>

        {/* Privacy */}
        <p className="mt-6 text-center text-sm text-gray-500">
          🔒 Your PDF is processed directly in your browser.
          Your file is not uploaded to a server.
        </p>

      </div>
    </main>
  );
}