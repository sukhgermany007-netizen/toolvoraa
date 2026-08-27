"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(40);
  const [opacity, setOpacity] = useState(0.25);
  const [position, setPosition] = useState("center");
  const [rotation, setRotation] = useState(45);
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

      const count = pdf.getPageCount();

      setFile(selectedFile);
      setPageCount(count);

      // Select all pages by default
      setSelectedPages(
        Array.from({ length: count }, (_, index) => index)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to read this PDF file.");
    }
  };

  const togglePage = (pageIndex: number) => {
    setSelectedPages((current) =>
      current.includes(pageIndex)
        ? current.filter((page) => page !== pageIndex)
        : [...current, pageIndex]
    );
  };

  const selectAll = () => {
    setSelectedPages(
      Array.from({ length: pageCount }, (_, index) => index)
    );
  };

  const clearPages = () => {
    setSelectedPages([]);
  };

  const getPosition = (
    pageWidth: number,
    pageHeight: number,
    textWidth: number,
    textHeight: number
  ) => {
    const margin = 40;

    switch (position) {
      case "top-left":
        return {
          x: margin,
          y: pageHeight - margin - textHeight,
        };

      case "top-center":
        return {
          x: (pageWidth - textWidth) / 2,
          y: pageHeight - margin - textHeight,
        };

      case "top-right":
        return {
          x: pageWidth - margin - textWidth,
          y: pageHeight - margin - textHeight,
        };

      case "bottom-left":
        return {
          x: margin,
          y: margin,
        };

      case "bottom-center":
        return {
          x: (pageWidth - textWidth) / 2,
          y: margin,
        };

      case "bottom-right":
        return {
          x: pageWidth - margin - textWidth,
          y: margin,
        };

      case "center":
      default:
        return {
          x: (pageWidth - textWidth) / 2,
          y: (pageHeight - textHeight) / 2,
        };
    }
  };

  const addWatermark = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (!watermark.trim()) {
      alert("Please enter watermark text.");
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

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pages = pdfDoc.getPages();

      selectedPages.forEach((pageIndex) => {
        const page = pages[pageIndex];

        if (!page) return;

        const { width, height } = page.getSize();

        const text = watermark.trim();

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        const { x, y } = getPosition(
          width,
          height,
          textWidth,
          textHeight
        );

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(rotation),
        });
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
      link.download = "watermarked-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      alert("Watermark successfully added to the PDF.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding the watermark.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setWatermark("CONFIDENTIAL");
    setFontSize(40);
    setOpacity(0.25);
    setPosition("center");
    setRotation(45);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Watermark
          </h1>

          <p className="text-gray-600 mt-2">
            Add a text watermark to your PDF quickly and easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {!file ? (
            /* Upload Area */
            <label
              htmlFor="pdf-upload"
              className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition"
            >
              <div className="text-5xl mb-4">📄</div>

              <h2 className="text-xl font-semibold text-gray-800">
                Choose PDF File
              </h2>

              <p className="text-gray-500 mt-2">
                Click here to upload your PDF
              </p>

              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <>
              {/* File Information */}
              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <p className="font-semibold text-gray-800 break-all">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {pageCount} pages
                </p>
              </div>

              {/* Watermark Text */}
              <div className="mb-5">
                <label className="block font-semibold text-gray-800 mb-2">
                  Watermark Text
                </label>

                <input
                  type="text"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  placeholder="Enter watermark text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Font Size */}
              <div className="mb-5">
                <label className="block font-semibold text-gray-800 mb-2">
                  Font Size: {fontSize}px
                </label>

                <input
                  type="range"
                  min="15"
                  max="100"
                  value={fontSize}
                  onChange={(e) =>
                    setFontSize(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div className="mb-5">
                <label className="block font-semibold text-gray-800 mb-2">
                  Opacity: {Math.round(opacity * 100)}%
                </label>

                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) =>
                    setOpacity(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Position */}
              <div className="mb-5">
                <label className="block font-semibold text-gray-800 mb-2">
                  Position
                </label>

                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>

                  <option value="center">Center</option>

                  <option value="bottom-left">
                    Bottom Left
                  </option>

                  <option value="bottom-center">
                    Bottom Center
                  </option>

                  <option value="bottom-right">
                    Bottom Right
                  </option>
                </select>
              </div>

              {/* Rotation */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-800 mb-2">
                  Rotation
                </label>

                <select
                  value={rotation}
                  onChange={(e) =>
                    setRotation(Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                >
                  <option value="0">0° - Horizontal</option>
                  <option value="45">45° - Diagonal</option>
                  <option value="90">90° - Vertical</option>
                  <option value="-45">-45° - Diagonal</option>
                </select>
              </div>

              {/* Page Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-800">
                    Select Pages
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
                    >
                      Select All
                    </button>

                    <button
                      onClick={clearPages}
                      className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from(
                    { length: pageCount },
                    (_, index) => {
                      const selected =
                        selectedPages.includes(index);

                      return (
                        <button
                          key={index}
                          onClick={() => togglePage(index)}
                          className={`py-3 rounded-lg border font-semibold transition ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                          }`}
                        >
                          Page {index + 1}
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Selected pages:{" "}
                  {selectedPages.length > 0
                    ? selectedPages
                        .sort((a, b) => a - b)
                        .map((page) => page + 1)
                        .join(", ")
                    : "None"}
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 border rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Watermark Preview
                </h3>

                <div className="bg-white border rounded-lg h-40 flex items-center justify-center overflow-hidden">
                  <span
                    style={{
                      fontSize: `${Math.min(fontSize, 50)}px`,
                      opacity,
                      transform: `rotate(${rotation}deg)`,
                      fontWeight: "bold",
                      color: "gray",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {watermark || "CONFIDENTIAL"}
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={addWatermark}
                disabled={loading}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading
                  ? "Adding Watermark..."
                  : "Add Watermark & Download PDF"}
              </button>

              {/* Reset */}
              <button
                onClick={resetTool}
                disabled={loading}
                className="w-full mt-3 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Add Another PDF
              </button>
            </>
          )}
        </div>

        {/* Privacy */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your PDF is processed directly in your browser.
        </p>
      </div>
    </main>
  );
}