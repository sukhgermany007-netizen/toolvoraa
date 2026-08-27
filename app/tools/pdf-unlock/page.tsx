"use client";

import { useState } from "react";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";

export default function PdfUnlock() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setPassword("");
    setMessage("");
  };

  const unlockPdf = async () => {
    if (!file) {
      alert("Please select a locked PDF.");
      return;
    }

    if (!password) {
      alert("Please enter the PDF password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Unlocking PDF...");

      const pdfBytes = new Uint8Array(
        await file.arrayBuffer()
      );

      // Decrypt AES-256 / RC4 PDF
      const decrypted = await decryptPDF(
        pdfBytes,
        password
      );

      // Make a clean ArrayBuffer for Blob
      const output = new Uint8Array(decrypted);
      const outputBuffer = output.buffer.slice(
        output.byteOffset,
        output.byteOffset + output.byteLength
      ) as ArrayBuffer;

      const blob = new Blob([outputBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "unlocked-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setMessage(
        "PDF successfully unlocked and downloaded."
      );

      alert("PDF successfully unlocked!");
    } catch (error) {
      console.error(error);

      setMessage("");

      const errorMessage =
        error instanceof Error
          ? error.message
          : "";

      if (
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("password")
      ) {
        alert("Wrong password. Please try again.");
      } else if (
        errorMessage.toLowerCase().includes("unsupported")
      ) {
        alert(
          "This PDF uses an unsupported encryption format."
        );
      } else if (
        errorMessage.toLowerCase().includes("not encrypted")
      ) {
        alert(
          "This PDF is not password protected."
        );
      } else {
        alert(
          "Could not unlock this PDF. Please check the password and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPassword("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            PDF Unlock
          </h1>

          <p className="text-gray-600 mt-2">
            Remove password protection from your PDF.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {!file ? (
            <>
              {/* Upload Area */}
              <label
                htmlFor="pdf-upload"
                className="block cursor-pointer"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition">

                  <div className="text-5xl mb-4">
                    🔓
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Choose Locked PDF
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Upload your password protected PDF
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
              {/* Selected File */}
              <div className="bg-gray-100 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-semibold text-gray-900 break-all">
                      {file.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  <button
                    onClick={resetTool}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-white disabled:opacity-50"
                  >
                    Change
                  </button>

                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-800 mb-2">
                  PDF Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter PDF password"
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Privacy */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔒 Your PDF never leaves your browser.
                  The password and PDF are processed locally.
                </p>
              </div>

              {/* Unlock */}
              <button
                onClick={unlockPdf}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading
                  ? "Unlocking PDF..."
                  : "🔓 Unlock & Download PDF"}
              </button>

              {/* Reset */}
              <button
                onClick={resetTool}
                disabled={loading}
                className="w-full mt-3 border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Unlock Another PDF
              </button>

              {/* Success */}
              {message && (
                <div className="mt-5 text-center text-sm text-green-600 font-medium">
                  {message}
                </div>
              )}
            </>
          )}
        </div>

        {/* Privacy Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your PDF is processed directly in your browser.
        </p>

      </div>
    </main>
  );
}