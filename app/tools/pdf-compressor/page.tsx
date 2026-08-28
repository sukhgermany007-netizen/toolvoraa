"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
      units[index]
    }`;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(0);
  };

  const compressPdf = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(arrayBuffer);

      // Remove PDF metadata
      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("ToolVoraa");
      pdf.setCreator("ToolVoraa");

      // Save with object streams enabled
      const compressedPdf = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const pdfBuffer = new ArrayBuffer(
        compressedPdf.byteLength
      );

      new Uint8Array(pdfBuffer).set(compressedPdf);

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      setDownloadUrl(url);
      setCompressedSize(blob.size);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to compress this PDF. Please try another PDF file."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "compressed-pdf.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetTool = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setDownloadUrl(null);
  };

  const reduction =
    originalSize > 0 && compressedSize > 0
      ? ((originalSize - compressedSize) / originalSize) * 100
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Compressor
          </h1>

          <p className="mt-3 text-gray-600">
            Reduce PDF file size quickly and easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Upload Area */}
          {!file && (
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
          )}

          {/* File Information */}
          {file && (
            <div>

              <div className="rounded-xl bg-gray-100 p-5">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-semibold text-gray-900">
                      {file.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Original size:{" "}
                      {formatFileSize(originalSize)}
                    </p>
                  </div>

                  <div className="text-4xl">
                    📄
                  </div>

                </div>
              </div>

              {/* Compress Button */}
              {!compressedSize && (
                <button
                  onClick={compressPdf}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? "Compressing PDF..."
                    : "Compress PDF"}
                </button>
              )}

              {/* Result */}
              {compressedSize > 0 && (
                <div className="mt-6">

                  <div className="rounded-xl border border-gray-200 bg-white p-6">

                    <h2 className="text-xl font-bold text-gray-900">
                      Compression Complete
                    </h2>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                      <div className="rounded-lg bg-gray-100 p-4">
                        <p className="text-sm text-gray-500">
                          Original Size
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatFileSize(originalSize)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-100 p-4">
                        <p className="text-sm text-gray-500">
                          New Size
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatFileSize(compressedSize)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-100 p-4">
                        <p className="text-sm text-gray-500">
                          Size Change
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {reduction > 0
                            ? `${reduction.toFixed(1)}% smaller`
                            : "No reduction"}
                        </p>
                      </div>

                    </div>

                    {/* Download */}
                    <button
                      onClick={downloadPdf}
                      className="mt-6 w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700"
                    >
                      Download Compressed PDF
                    </button>

                    {/* Start Again */}
                    <button
                      onClick={resetTool}
                      className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Compress Another PDF
                    </button>

                  </div>

                </div>
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