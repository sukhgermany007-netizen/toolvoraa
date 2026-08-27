"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createWorker } from "tesseract.js";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";

type Language = "eng" | "hin" | "eng+hin";

export default function ImageToText() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [text, setText] = useState("");

  const [language, setLanguage] =
    useState<Language>("eng");

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------
  // Upload Image
  // ---------------------------------------

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError(
        "Please select a JPG, PNG or WEBP image."
      );
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const previewUrl =
      URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setImage(previewUrl);

    setText("");
    setProgress(0);
    setStatus("");
    setError("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // ---------------------------------------
  // Extract Text using Tesseract OCR
  // ---------------------------------------

  const extractText = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setText("");
    setError("");
    setStatus("Starting OCR...");

    let worker:
      | Awaited<ReturnType<typeof createWorker>>
      | null = null;

    try {
      worker = await createWorker(
        language,
        1,
        {
          logger: (message) => {
            if (message.status) {
              setStatus(message.status);
            }

            if (
              typeof message.progress === "number"
            ) {
              setProgress(
                Math.round(
                  message.progress * 100
                )
              );
            }
          },
        }
      );

      setStatus("Reading text from image...");

      const result = await worker.recognize(file);

      const extractedText =
        result.data.text.trim();

      setText(extractedText);

      setProgress(100);

      if (extractedText) {
        setStatus(
          "Text extracted successfully."
        );
      } else {
        setStatus(
          "No readable text was found."
        );
      }
    } catch (err) {
      console.error(
        "OCR Error:",
        err
      );

      setError(
        "Could not extract text. Please try another image or try again."
      );

      setStatus("");
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (terminateError) {
          console.error(
            "Worker termination error:",
            terminateError
          );
        }
      }

      setProcessing(false);
    }
  };

  // ---------------------------------------
  // Copy Text
  // ---------------------------------------

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setStatus(
        "Text copied to clipboard."
      );
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Could not copy the text."
      );
    }
  };

  // ---------------------------------------
  // Download TXT
  // ---------------------------------------

  const downloadText = () => {
    if (!text) return;

    const blob = new Blob(
      [text],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      window.document.createElement("a");

    link.href = url;
    link.download =
      "extracted-text.txt";

    window.document.body.appendChild(
      link
    );

    link.click();

    window.document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);

    setStatus(
      "TXT file downloaded successfully."
    );
  };

  // ---------------------------------------
  // Download PDF
  // ---------------------------------------

  const downloadPDF = () => {
    if (!text) return;

    try {
      const pdf = new jsPDF();

      pdf.setFontSize(12);

      const lines =
        pdf.splitTextToSize(
          text,
          180
        );

      let y = 20;

      for (const line of lines) {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(
          line,
          15,
          y
        );

        y += 7;
      }

      pdf.save(
        "extracted-text.pdf"
      );

      setStatus(
        "PDF downloaded successfully."
      );
    } catch (err) {
      console.error(
        "PDF Error:",
        err
      );

      setError(
        "Could not create the PDF."
      );
    }
  };

  // ---------------------------------------
  // Download DOCX
  // ---------------------------------------

  const downloadDOCX = async () => {
    if (!text) return;

    try {
      const paragraphs =
        text.split("\n").map(
          (line) =>
            new Paragraph({
              text: line || " ",
            })
        );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob =
        await Packer.toBlob(doc);

      const url =
        URL.createObjectURL(blob);

      const link =
        window.document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        "extracted-text.docx";

      window.document.body.appendChild(
        link
      );

      link.click();

      window.document.body.removeChild(
        link
      );

      URL.revokeObjectURL(url);

      setStatus(
        "DOCX downloaded successfully."
      );
    } catch (err) {
      console.error(
        "DOCX Error:",
        err
      );

      setError(
        "Could not create the DOCX file."
      );
    }
  };

  // ---------------------------------------
  // Clear Text
  // ---------------------------------------

  const clearText = () => {
    setText("");
    setStatus("");
    setError("");
  };

  // ---------------------------------------
  // Remove Image
  // ---------------------------------------

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setFile(null);
    setText("");
    setProgress(0);
    setStatus("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Image to Text
          </h1>

          <p className="mt-3 text-gray-600">
            Extract text from JPG, PNG and
            WEBP images using OCR.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">

          {/* Upload Area */}
          {!image && (
            <div
              onClick={() =>
                inputRef.current?.click()
              }
              className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-12 text-center transition hover:bg-blue-100"
            >
              <div className="text-5xl">
                🖼️
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                Upload an Image
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or WEBP
              </p>

              <button
                type="button"
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Choose Image
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          )}

          {/* Uploaded Image */}
          {image && (
            <>
              <div className="grid gap-6 md:grid-cols-2">

                {/* Original Image */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">
                      Original Image
                    </h2>

                    <button
                      onClick={removeImage}
                      disabled={processing}
                      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex min-h-[350px] items-center justify-center rounded-xl bg-gray-100 p-4">
                    <img
                      src={image}
                      alt="Uploaded image"
                      className="max-h-[450px] max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>

                {/* Extracted Text */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">
                      Extracted Text
                    </h2>

                    <span className="text-xs text-gray-500">
                      {text.length} characters
                    </span>
                  </div>

                  <textarea
                    value={text}
                    onChange={(e) =>
                      setText(
                        e.target.value
                      )
                    }
                    placeholder="Your extracted text will appear here..."
                    className="h-[350px] w-full resize-none rounded-xl border border-gray-300 p-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="mt-6 rounded-xl bg-gray-50 p-5">

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Language */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      OCR Language
                    </label>

                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target
                            .value as Language
                        )
                      }
                      disabled={processing}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="eng">
                        English
                      </option>

                      <option value="hin">
                        Hindi
                      </option>

                      <option value="eng+hin">
                        English + Hindi
                      </option>
                    </select>
                  </div>

                  {/* File */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Selected File
                    </label>

                    <div className="truncate rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      {file?.name}
                    </div>
                  </div>

                </div>
              </div>

              {/* Progress */}
              {processing && (
                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">
                      {status ||
                        "Processing..."}
                    </span>

                    <span className="font-semibold text-blue-600">
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

              {/* Success */}
              {status &&
                !processing &&
                !error && (
                  <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    ✓ {status}
                  </div>
                )}

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Main Buttons */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                <button
                  onClick={extractText}
                  disabled={processing}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Extracting..."
                    : "🔍 Extract Text"}
                </button>

                <button
                  onClick={copyText}
                  disabled={
                    !text ||
                    processing
                  }
                  className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  📋 Copy Text
                </button>

                <button
                  onClick={downloadText}
                  disabled={
                    !text ||
                    processing
                  }
                  className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  💾 TXT
                </button>

                <button
                  onClick={downloadDOCX}
                  disabled={
                    !text ||
                    processing
                  }
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  📄 DOCX
                </button>

                <button
                  onClick={downloadPDF}
                  disabled={
                    !text ||
                    processing
                  }
                  className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  📕 PDF
                </button>

              </div>

              {/* Clear Button */}
              <div className="mt-3">
                <button
                  onClick={clearText}
                  disabled={
                    !text ||
                    processing
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🗑️ Clear Text
                </button>
              </div>

            </>
          )}
        </div>

        {/* Privacy */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow">

          <h2 className="font-semibold text-gray-800">
            🔒 Private & Secure
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Your image is processed directly
            in your browser. Your image does
            not need to be uploaded to our
            server.
          </p>

        </div>

        {/* How To */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            How to extract text from an image?
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
            <li>
              Upload your JPG, PNG or WEBP
              image.
            </li>

            <li>
              Select English, Hindi or
              English + Hindi.
            </li>

            <li>
              Click "Extract Text".
            </li>

            <li>
              Wait for OCR processing to
              finish.
            </li>

            <li>
              Copy the text or download it
              as TXT, DOCX or PDF.
            </li>
          </ol>

        </div>

        {/* Features */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 text-center shadow">
            <div className="text-3xl">
              🔍
            </div>

            <h3 className="mt-2 font-semibold">
              OCR Technology
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Extract text automatically.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow">
            <div className="text-3xl">
              🌐
            </div>

            <h3 className="mt-2 font-semibold">
              Multiple Languages
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              English and Hindi support.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow">
            <div className="text-3xl">
              🔒
            </div>

            <h3 className="mt-2 font-semibold">
              Browser Processing
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No image upload required.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}