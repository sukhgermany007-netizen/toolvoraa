"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setSelectedPages([]);
    } catch {
      alert("Unable to read this PDF file.");
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) =>
      current.includes(pageNumber)
        ? current.filter((page) => page !== pageNumber)
        : [...current, pageNumber]
    );
  };

  const splitPdf = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndexes = [...selectedPages]
        .sort((a, b) => a - b)
        .map((page) => page - 1);

      const copiedPages = await newPdf.copyPages(
        originalPdf,
        pageIndexes
      );

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

     const pdfBytes = await newPdf.save();

const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
new Uint8Array(pdfBuffer).set(pdfBytes);

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.download = "split-pdf.pdf";

document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Splitter
          </h1>

          <p className="mt-3 text-gray-600">
            Split PDF files and extract the pages you need.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Upload */}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 transition hover:border-blue-500">

            <div className="mb-4 text-5xl">
              📄
            </div>

            <span className="text-lg font-semibold text-gray-800">
              Choose PDF File
            </span>

            <span className="mt-2 text-sm text-gray-500">
              Click here to upload your PDF
            </span>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* File Information */}
          {file && (
            <div className="mt-6">

              <div className="rounded-lg bg-gray-100 p-4">
                <p className="font-semibold text-gray-800">
                  {file.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {pageCount} page
                  {pageCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Page Selection */}
              <div className="mt-6">

                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Select Pages
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">

                  {Array.from(
                    { length: pageCount },
                    (_, index) => index + 1
                  ).map((pageNumber) => {

                    const selected =
                      selectedPages.includes(pageNumber);

                    return (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          togglePage(pageNumber)
                        }
                        className={`rounded-lg border px-4 py-3 font-semibold transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-500"
                        }`}
                      >
                        Page {pageNumber}
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* Selected Pages */}
              <div className="mt-6">

                <p className="text-sm text-gray-600">
                  Selected pages:

                  <span className="ml-2 font-semibold text-gray-900">
                    {selectedPages.length > 0
                      ? selectedPages.join(", ")
                      : "None"}
                  </span>
                </p>

              </div>

              {/* Split Button */}
              <button
                onClick={splitPdf}
                disabled={
                  loading ||
                  selectedPages.length === 0
                }
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Creating PDF..."
                  : "Split & Download PDF"}
              </button>

            </div>
          )}

        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Your PDF is processed directly in your browser.
        </div>

      </div>
    </main>
  );
}