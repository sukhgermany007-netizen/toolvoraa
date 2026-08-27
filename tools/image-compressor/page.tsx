"use client";

import { useState } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(70);
  const [compressedUrl, setCompressedUrl] = useState("");
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("image/jpeg");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedUrl("");
    setCompressedSize(0);

    if (selectedFile.type === "image/png") {
      setFormat("image/webp");
    } else {
      setFormat("image/jpeg");
    }
  };

  const compressImage = () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Could not create canvas.");
        }

        // White background helps when converting transparent PNG
        // to JPEG.
        if (format === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        context.drawImage(image, 0, 0);

        const outputQuality = quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              alert("Could not compress the image.");
              setLoading(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            setCompressedUrl(url);
            setCompressedSize(blob.size);
            setLoading(false);
          },
          format,
          outputQuality
        );
      } catch (error) {
        console.error(error);
        alert("Something went wrong while compressing the image.");
        setLoading(false);
      }
    };

    image.onerror = () => {
      alert("Could not load this image.");
      setLoading(false);
    };

    image.src = preview;
  };

  const downloadImage = () => {
    if (!compressedUrl) return;

    const link = document.createElement("a");

    link.href = compressedUrl;

    const extension =
      format === "image/webp" ? "webp" : "jpg";

    link.download = `compressed-image.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    setFile(null);
    setPreview("");
    setCompressedUrl("");
    setCompressedSize(0);
    setQuality(70);
    setLoading(false);
    setFormat("image/jpeg");
  };

  const originalSizeKB = file
    ? file.size / 1024
    : 0;

  const compressedSizeKB = compressedSize
    ? compressedSize / 1024
    : 0;

  const savings =
    file && compressedSize
      ? Math.max(
          0,
          Math.round(
            ((file.size - compressedSize) / file.size) * 100
          )
        )
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-gray-900">
            Image Compressor
          </h1>

          <p className="mt-2 text-gray-600">
            Compress JPG, PNG and other images quickly.
          </p>

        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">

          {!file ? (
            <label className="block cursor-pointer">

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-14 text-center transition hover:border-blue-500 hover:bg-blue-50">

                <div className="mb-4 text-5xl">
                  🖼️
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Choose Image
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG or WebP
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>

            </label>
          ) : (
            <>
              {/* File Information */}
              <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-100 p-4">

                <div>

                  <p className="break-all font-semibold text-gray-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Original size:{" "}
                    {originalSizeKB.toFixed(2)} KB
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

              {/* Preview */}
              <div className="mb-8 grid gap-6 md:grid-cols-2">

                <div>
                  <h3 className="mb-3 font-semibold text-gray-800">
                    Original
                  </h3>

                  <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-4">
                    <img
                      src={preview}
                      alt="Original"
                      className="max-h-72 max-w-full object-contain"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-gray-800">
                    Compressed
                  </h3>

                  <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-4">

                    {compressedUrl ? (
                      <img
                        src={compressedUrl}
                        alt="Compressed"
                        className="max-h-72 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        Compression preview
                      </span>
                    )}

                  </div>
                </div>

              </div>

              {/* Quality */}
              <div className="mb-6">

                <div className="mb-2 flex items-center justify-between">

                  <label className="font-semibold text-gray-800">
                    Compression Quality
                  </label>

                  <span className="font-semibold text-blue-600">
                    {quality}%
                  </span>

                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                  disabled={loading}
                  className="w-full"
                />

                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Smaller File</span>
                  <span>Better Quality</span>
                </div>

              </div>

              {/* Output Format */}
              <div className="mb-6">

                <label className="mb-2 block font-semibold text-gray-800">
                  Output Format
                </label>

                <select
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >

                  <option value="image/jpeg">
                    JPG
                  </option>

                  <option value="image/webp">
                    WebP
                  </option>

                </select>

              </div>

              {/* Privacy */}
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
                🔒 Your image is processed directly in your browser.
                Your file is not uploaded to a server.
              </div>

              {/* Compress Button */}
              <button
                onClick={compressImage}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Compressing Image..."
                  : "🗜️ Compress Image"}
              </button>

              {/* Result */}
              {compressedUrl && !loading && (
                <div className="mt-6">

                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-xl bg-gray-100 p-4 text-center">
                      <p className="text-sm text-gray-500">
                        Original
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {originalSizeKB.toFixed(2)} KB
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-4 text-center">
                      <p className="text-sm text-green-600">
                        Compressed
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-700">
                        {compressedSizeKB.toFixed(2)} KB
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 rounded-xl bg-blue-50 p-4 text-center">

                    <p className="text-sm text-gray-600">
                      File size reduction
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {savings}%
                    </p>

                  </div>

                  <button
                    onClick={downloadImage}
                    className="mt-5 w-full rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700"
                  >
                    ⬇️ Download Compressed Image
                  </button>

                  <button
                    onClick={resetTool}
                    className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Compress Another Image
                  </button>

                </div>
              )}

            </>
          )}

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          🔒 Your image is processed directly in your browser.
        </p>

      </div>
    </main>
  );
}