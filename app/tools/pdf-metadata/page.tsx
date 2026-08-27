"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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
    setSuccess("");
  };

  const updateMetadata = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      if (title.trim()) {
        pdfDoc.setTitle(title.trim());
      }

      if (author.trim()) {
        pdfDoc.setAuthor(author.trim());
      }

      if (subject.trim()) {
        pdfDoc.setSubject(subject.trim());
      }

      if (keywords.trim()) {
        const keywordList = keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean);

        pdfDoc.setKeywords(keywordList);
      }

      const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes as unknown as BlobPart], {
  type: "application/pdf",
});

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "updated-metadata.pdf";
      link.click();

      URL.revokeObjectURL(url);

      setSuccess("PDF metadata updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not update PDF metadata.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setTitle("");
    setAuthor("");
    setSubject("");
    setKeywords("");
    setSuccess("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          PDF Metadata Editor
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Edit PDF title, author, subject and keywords easily.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg">
          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-16 text-center hover:bg-gray-50">
              <div className="text-5xl">📄</div>

              <h2 className="mt-4 text-xl font-semibold">
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
            </label>
          ) : (
            <>
              <div className="rounded-xl bg-gray-100 p-4">
                <p className="font-semibold text-gray-900">
                  {file.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block font-semibold">
                    Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter PDF title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Author
                  </label>

                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Subject
                  </label>

                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter PDF subject"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Keywords
                  </label>

                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Example: invoice, business, finance"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Separate keywords with commas.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                🔒 Your PDF is processed directly in your browser.
                Your file is not uploaded to a server.
              </div>

              <button
                onClick={updateMetadata}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Updating Metadata..."
                  : "📝 Update & Download PDF"}
              </button>

              {success && (
                <p className="mt-4 text-center font-semibold text-green-600">
                  {success}
                </p>
              )}

              <button
                onClick={resetTool}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Edit Another PDF
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          🔒 Your PDF is processed directly in your browser.
        </p>
      </div>
    </main>
  );
}
