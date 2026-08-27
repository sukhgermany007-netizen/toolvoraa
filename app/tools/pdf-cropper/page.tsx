"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

type PageInfo = {
  index: number;
  width: number;
  height: number;
};

export default function PdfCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [top, setTop] = useState(20);
  const [bottom, setBottom] = useState(20);
  const [left, setLeft] = useState(20);
  const [right, setRight] = useState(20);
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

      setProgress(60);

      const pdfPages = pdfDoc.getPages();

      const pageData: PageInfo[] = pdfPages.map((page, index) => {
        const { width, height } = page.getSize();

        return {
          index,
          width,
          height,
        };
      });

      setFile(selectedFile);
      setPages(pageData);
      setSelectedPages(pageData.map((page) => page.index));

      setProgress(100);
    } catch (error) {
      console.error(error);
      alert("Unable to read this PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (index: number) => {
    setSelectedPages((current) =>
      current.includes(index)
        ? current.filter((page) => page !== index)
        : [...current, index].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedPages(pages.map((page) => page.index));
  };

  const clearPages = () => {
    setSelectedPages([]);
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setSelectedPages([]);
    setTop(20);
    setBottom(20);
    setLeft(20);
    setRight(20);
    setProgress(0);
    setSuccess("");
  };

  const cropPdf = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }

    if (
      top < 0 ||
      bottom < 0 ||
      left < 0 ||
      right < 0
    ) {
      alert("Crop margins cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setProgress(10);

      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pdfPages = pdfDoc.getPages();

      setProgress(30);

      for (let i = 0; i < pdfPages.length; i++) {
        if (!selectedPages.includes(i)) continue;

        const page = pdfPages[i];

        const { width, height } = page.getSize();

        const cropWidth = width - left - right;
        const cropHeight = height - top - bottom;

        if (cropWidth <= 0 || cropHeight <= 0) {
          alert(
            `Crop margins are too large for page ${i + 1}.`
          );
          setLoading(false);
          return;
        }

        page.setCropBox(
          left,
          bottom,
          cropWidth,
          cropHeight
        );

        const currentProgress =
          30 +
          Math.round(
            ((i + 1) / pdfPages.length) * 50
          );

        setProgress(Math.min(currentProgress, 80));
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes as BlobPart], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "cropped-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess("PDF successfully cropped and downloaded.");
      alert("PDF successfully cropped!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while cropping the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Cropper
          </h1>

          <p className="mt-2 text-gray-600">
            Crop PDF pages by adjusting the margins easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {!file ? (
            <>
              {/* Upload */}
              <label
                htmlFor="pdf-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-16 text-center transition hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="mb-4 text-5xl">📄</div>

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
                      {pages.length}{" "}
                      {pages.length === 1 ? "page" : "pages"}
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

              {/* Crop Margins */}
              <div className="mt-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Crop Margins
                </h2>

                <p className="mb-5 text-sm text-gray-500">
                  Enter crop margins in PDF points. 72 points = 1 inch.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Top */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Top
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={top}
                      onChange={(e) =>
                        setTop(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Bottom */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Bottom
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={bottom}
                      onChange={(e) =>
                        setBottom(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Left */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Left
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={left}
                      onChange={(e) =>
                        setLeft(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Right */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-700">
                      Right
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={right}
                      onChange={(e) =>
                        setRight(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {pages.map((page) => {
                    const selected = selectedPages.includes(
                      page.index
                    );

                    return (
                      <button
                        key={page.index}
                        onClick={() =>
                          togglePage(page.index)
                        }
                        disabled={loading}
                        className={`rounded-xl border-2 p-4 text-center transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-lg font-bold">
                          Page {page.index + 1}
                        </div>

                        <div
                          className={`mt-1 text-xs ${
                            selected
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {Math.round(page.width)} ×{" "}
                          {Math.round(page.height)} pt
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Selected pages:{" "}
                  {selectedPages.length > 0
                    ? selectedPages
                        .map((page) => page + 1)
                        .join(", ")
                    : "None"}
                </p>
              </div>

              {/* Crop Summary */}
              <div className="mt-6 rounded-xl bg-blue-50 p-5">
                <h3 className="font-semibold text-gray-900">
                  Crop Settings
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <span className="text-gray-500">
                      Top
                    </span>
                    <p className="font-semibold">
                      {top} pt
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Bottom
                    </span>
                    <p className="font-semibold">
                      {bottom} pt
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Left
                    </span>
                    <p className="font-semibold">
                      {left} pt
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Right
                    </span>
                    <p className="font-semibold">
                      {right} pt
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {loading && (
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm text-gray-600">
                    <span>Cropping PDF...</span>
                    <span>{progress}%</span>
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

              {/* Success */}
              {success && !loading && (
                <div className="mt-6 rounded-xl bg-green-50 p-4 text-center font-medium text-green-700">
                  ✅ {success}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6">
                <button
                  onClick={cropPdf}
                  disabled={loading || selectedPages.length === 0}
                  className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? `Cropping... ${progress}%`
                    : "✂️ Crop & Download PDF"}
                </button>

                <button
                  onClick={resetTool}
                  disabled={loading}
                  className="mt-3 w-full rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  Crop Another PDF
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