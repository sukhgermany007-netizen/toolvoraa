"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function PdfPageNumber() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [startNumber, setStartNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
    setProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      setPageCount(pdfDoc.getPageCount());
    } catch {
      alert("Could not read this PDF file.");
      setFile(null);
      setPageCount(0);
    }
  };

  const addPageNumbers = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    if (startNumber < 1) {
      alert("Starting page number must be 1 or greater.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        const number = String(startNumber + i);

        const { width, height } = page.getSize();

        const textWidth = font.widthOfTextAtSize(number, fontSize);

        let x = 0;
        let y = 0;

        const margin = 24;

        // Horizontal position
        if (
          position === "top-left" ||
          position === "bottom-left"
        ) {
          x = margin;
        } else if (
          position === "top-center" ||
          position === "bottom-center"
        ) {
          x = (width - textWidth) / 2;
        } else {
          x = width - textWidth - margin;
        }

        // Vertical position
        if (
          position === "top-left" ||
          position === "top-center" ||
          position === "top-right"
        ) {
          y = height - margin - fontSize;
        } else {
          y = margin;
        }

        page.drawText(number, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });

        const currentProgress = Math.round(
          10 + ((i + 1) / pages.length) * 80
        );

        setProgress(currentProgress);

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      setProgress(95);

      const pdfBytes = await pdfDoc.save();

      const pdfBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer;

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "numbered-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess(true);

      alert("Page numbers successfully added!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding page numbers.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setProgress(0);
    setSuccess(false);
    setPosition("bottom-center");
    setFontSize(12);
    setStartNumber(1);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Page Number
          </h1>

          <p className="mt-2 text-gray-600">
            Add page numbers to your PDF documents easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          {!file ? (
            <label className="block cursor-pointer">
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition hover:border-blue-500 hover:bg-blue-50">
                <div className="mb-4 text-5xl">📄</div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Choose PDF File
                </h2>

                <p className="mt-2 text-sm text-gray-500">
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
              {/* File Info */}
              <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-100 p-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {pageCount}{" "}
                    {pageCount === 1 ? "page" : "pages"}
                  </p>
                </div>

                <button
                  onClick={resetTool}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold hover:bg-gray-50"
                >
                  Change
                </button>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                {/* Position */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Page Number Position
                  </label>

                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="bottom-left">
                      Bottom Left
                    </option>

                    <option value="bottom-center">
                      Bottom Center
                    </option>

                    <option value="bottom-right">
                      Bottom Right
                    </option>

                    <option value="top-left">
                      Top Left
                    </option>

                    <option value="top-center">
                      Top Center
                    </option>

                    <option value="top-right">
                      Top Right
                    </option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Font Size: {fontSize}px
                  </label>

                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(Number(e.target.value))
                    }
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                {/* Starting Number */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Starting Page Number
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) =>
                      setStartNumber(Number(e.target.value))
                    }
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <p className="mt-1 text-sm text-gray-500">
                    Example: Start with 1, 10, 100, etc.
                  </p>
                </div>

                {/* Preview */}
                <div className="rounded-xl bg-blue-50 p-5">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Preview
                  </h3>

                  <div className="relative mx-auto h-56 max-w-md rounded-lg border-2 border-gray-300 bg-white shadow-sm">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300">
                      PDF PAGE
                    </div>

                    <div
                      className={`absolute text-gray-700 ${
                        position.includes("top")
                          ? "top-3"
                          : "bottom-3"
                      } ${
                        position.includes("left")
                          ? "left-4"
                          : position.includes("right")
                          ? "right-4"
                          : "left-1/2 -translate-x-1/2"
                      }`}
                      style={{
                        fontSize: `${fontSize}px`,
                      }}
                    >
                      {startNumber}
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
                  🔒 Your PDF is processed directly in your browser.
                  Your file is not uploaded to a server.
                </div>

                {/* Progress */}
                {loading && (
                  <div>
                    <div className="mb-2 flex justify-between text-sm text-gray-600">
                      <span>
                        Adding page numbers...
                      </span>

                      <span>{progress}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-200"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={addPageNumbers}
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? `Adding Page Numbers... ${progress}%`
                    : "🔢 Add Page Numbers & Download PDF"}
                </button>

                {/* Reset */}
                {success && !loading && (
                  <>
                    <p className="text-center font-medium text-green-600">
                      PDF successfully numbered and downloaded.
                    </p>

                    <button
                      onClick={resetTool}
                      className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Add Numbers to Another PDF
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          🔒 Your PDF is processed directly in your browser.
        </p>
      </div>
    </main>
  );
}