"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

export default function PdfRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotation, setRotation] = useState(90);
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
      const bytes = await selectedFile.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());

      // Select all pages by default
      setSelectedPages(
        Array.from(
          { length: pdf.getPageCount() },
          (_, index) => index + 1
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to read this PDF.");
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((previous) =>
      previous.includes(pageNumber)
        ? previous.filter((page) => page !== pageNumber)
        : [...previous, pageNumber].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedPages(
      Array.from(
        { length: pageCount },
        (_, index) => index + 1
      )
    );
  };

  const deselectAll = () => {
    setSelectedPages([]);
  };

  const rotatePdf = async () => {
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
      const bytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(bytes);

      selectedPages.forEach((pageNumber) => {
        const page = pdfDoc.getPage(pageNumber - 1);

        const currentRotation = page.getRotation().angle;

        page.setRotation(
          degrees((currentRotation + rotation) % 360)
        );
      });

      const pdfBytes = await pdfDoc.save();

      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);

      new Uint8Array(pdfBuffer).set(pdfBytes);

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "rotated-pdf.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      alert("PDF rotated successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while rotating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setRotation(90);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Rotator
          </h1>

          <p className="mt-3 text-gray-600">
            Rotate PDF pages and download the updated PDF.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12 transition hover:border-blue-500">

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
          ) : (
            <div>

              {/* File Info */}
              <div className="rounded-xl bg-gray-100 p-5">
                <p className="font-semibold text-gray-900">
                  {file.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {pageCount} page
                  {pageCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Page Selection */}
              <div className="mt-7">

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-bold text-gray-900">
                    Select Pages
                  </h2>

                  <div className="flex gap-2">

                    <button
                      onClick={selectAll}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Select All
                    </button>

                    <button
                      onClick={deselectAll}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Clear
                    </button>

                  </div>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  {Array.from(
                    { length: pageCount },
                    (_, index) => {
                      const pageNumber = index + 1;

                      const selected =
                        selectedPages.includes(pageNumber);

                      return (
                        <button
                          key={pageNumber}
                          onClick={() =>
                            togglePage(pageNumber)
                          }
                          className={`rounded-xl border px-4 py-5 font-semibold transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                          }`}
                        >
                          Page {pageNumber}
                        </button>
                      );
                    }
                  )}

                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Selected pages:{" "}
                  {selectedPages.length > 0
                    ? selectedPages.join(", ")
                    : "None"}
                </p>

              </div>

              {/* Rotation */}
              <div className="mt-7">

                <h2 className="mb-3 text-xl font-bold text-gray-900">
                  Rotation
                </h2>

                <select
                  value={rotation}
                  onChange={(event) =>
                    setRotation(Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                >
                  <option value={90}>
                    Rotate 90° Clockwise
                  </option>

                  <option value={180}>
                    Rotate 180°
                  </option>

                  <option value={270}>
                    Rotate 270° Clockwise
                  </option>
                </select>

              </div>

              {/* Rotate Button */}
              <button
                onClick={rotatePdf}
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Rotating PDF..."
                  : "Rotate & Download PDF"}
              </button>

              {/* Reset */}
              {!loading && (
                <button
                  onClick={resetTool}
                  className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Rotate Another PDF
                </button>
              )}

            </div>
          )}

        </div>

        {/* Privacy */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your PDF is processed directly in your browser.
          </p>
        </div>

      </div>
    </main>
  );
}