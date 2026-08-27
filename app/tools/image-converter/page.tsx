"use client";

import { useEffect, useState } from "react";

type OutputFormat = {
  label: string;
  mime: string;
  extension: string;
};

const OUTPUT_FORMATS: OutputFormat[] = [
  {
    label: "PNG",
    mime: "image/png",
    extension: "png",
  },
  {
    label: "JPG / JPEG",
    mime: "image/jpeg",
    extension: "jpg",
  },
  {
    label: "WEBP",
    mime: "image/webp",
    extension: "webp",
  },
  {
    label: "AVIF",
    mime: "image/avif",
    extension: "avif",
  },
];

export default function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("converted-image");

  const [originalFormat, setOriginalFormat] = useState("");
  const [originalSize, setOriginalSize] = useState(0);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [outputFormat, setOutputFormat] =
    useState("image/webp");

  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const url = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {
      setImage(url);

      setFileName(
        file.name.replace(/\.[^/.]+$/, "")
      );

      setOriginalFormat(file.type);
      setOriginalSize(file.size);

      setImageWidth(img.naturalWidth);
      setImageHeight(img.naturalHeight);

      setMessage("");

      // Choose a different format from the original.
      if (file.type === "image/jpeg") {
        setOutputFormat("image/webp");
      } else if (file.type === "image/png") {
        setOutputFormat("image/webp");
      } else if (file.type === "image/webp") {
        setOutputFormat("image/png");
      } else {
        setOutputFormat("image/webp");
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Could not load this image.");
    };

    img.src = url;
  };

  const getFormatName = (mime: string) => {
    if (mime === "image/jpeg") return "JPG";
    if (mime === "image/png") return "PNG";
    if (mime === "image/webp") return "WEBP";
    if (mime === "image/avif") return "AVIF";

    if (mime === "image/jpg") return "JPG";

    return mime
      .replace("image/", "")
      .toUpperCase();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const convertImage = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setConverting(true);
    setMessage("");

    const img = new Image();

    img.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setConverting(false);
        setMessage("Could not create canvas.");
        return;
      }

      /*
       * JPG does not support transparency.
       * Fill background with white before exporting.
       */
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      /*
       * Test whether the browser actually supports
       * the selected output format.
       */
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setConverting(false);

            setMessage(
              `${getFormatName(
                outputFormat
              )} conversion is not supported by this browser.`
            );

            return;
          }

          /*
           * Some browsers may return PNG when they
           * don't support the requested MIME type.
           */
          if (
            outputFormat !== "image/png" &&
            blob.type !== outputFormat
          ) {
            setConverting(false);

            setMessage(
              `${getFormatName(
                outputFormat
              )} is not supported by this browser.`
            );

            return;
          }

          const selectedFormat =
            OUTPUT_FORMATS.find(
              (item) =>
                item.mime === outputFormat
            );

          if (!selectedFormat) {
            setConverting(false);
            return;
          }

          const downloadUrl =
            URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = downloadUrl;

          link.download = `${fileName}-converted.${selectedFormat.extension}`;

          document.body.appendChild(link);

          link.click();

          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
          }, 1000);

          setConverting(false);

          setMessage(
            `Successfully converted to ${selectedFormat.label}.`
          );
        },
        outputFormat,
        outputFormat === "image/png"
          ? undefined
          : quality / 100
      );
    };

    img.onerror = () => {
      setConverting(false);

      setMessage(
        "Could not load the image for conversion."
      );
    };

    img.src = image;
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setFileName("converted-image");
    setOriginalFormat("");
    setOriginalSize(0);
    setImageWidth(0);
    setImageHeight(0);
    setMessage("");
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image Converter
          </h1>

          <p className="mt-2 text-gray-600">
            Convert images between JPG, PNG, WEBP and
            AVIF formats.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">

          {/* UPLOAD */}
          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-14 transition hover:border-blue-500 hover:bg-blue-50">

              <div className="mb-4 text-5xl">
                🔄
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                Choose an Image
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG, WEBP, GIF and other browser-supported
                image files
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>
          ) : (
            <>
              {/* TOP BAR */}
              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Image Preview
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose an output format below.
                  </p>
                </div>

                <button
                  onClick={removeImage}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>

              </div>

              {/* MAIN GRID */}
              <div className="grid gap-8 md:grid-cols-2">

                {/* PREVIEW */}
                <div>

                  <div className="flex min-h-[380px] items-center justify-center rounded-xl bg-gray-100 p-6">

                    <img
                      src={image}
                      alt="Image preview"
                      className="max-h-[420px] max-w-full rounded-lg object-contain"
                    />

                  </div>

                  {/* IMAGE INFO */}
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Original Format
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {getFormatName(originalFormat)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        File Size
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatFileSize(originalSize)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Width
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {imageWidth}px
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Height
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {imageHeight}px
                      </p>
                    </div>

                  </div>

                </div>

                {/* SETTINGS */}
                <div>

                  <h2 className="mb-5 font-semibold text-gray-800">
                    Conversion Settings
                  </h2>

                  {/* FORMAT */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Convert To
                    </label>

                    <select
                      value={outputFormat}
                      onChange={(e) => {
                        setOutputFormat(
                          e.target.value
                        );

                        setMessage("");
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {OUTPUT_FORMATS.map(
                        (format) => (
                          <option
                            key={format.mime}
                            value={format.mime}
                          >
                            {format.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* QUICK OPTIONS */}
                  <div className="mt-5">

                    <p className="mb-3 text-sm font-medium text-gray-700">
                      Quick Convert
                    </p>

                    <div className="grid grid-cols-2 gap-2">

                      {OUTPUT_FORMATS.map(
                        (format) => (
                          <button
                            key={format.mime}
                            onClick={() => {
                              setOutputFormat(
                                format.mime
                              );

                              setMessage("");
                            }}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                              outputFormat ===
                              format.mime
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            → {format.label}
                          </button>
                        )
                      )}

                    </div>
                  </div>

                  {/* QUALITY */}
                  {outputFormat !== "image/png" && (
                    <div className="mt-6">

                      <div className="mb-2 flex justify-between">

                        <label className="text-sm font-medium text-gray-700">
                          Quality
                        </label>

                        <span className="text-sm font-semibold text-blue-600">
                          {quality}%
                        </span>

                      </div>

                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) =>
                          setQuality(
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />

                      <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>Smaller File</span>
                        <span>Higher Quality</span>
                      </div>

                    </div>
                  )}

                  {/* CONVERSION CARD */}
                  <div className="mt-6 rounded-xl bg-blue-50 p-5">

                    <p className="text-sm text-gray-600">
                      Conversion
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-4 text-xl font-bold">

                      <span>
                        {getFormatName(
                          originalFormat
                        )}
                      </span>

                      <span className="text-blue-600">
                        →
                      </span>

                      <span className="text-blue-600">
                        {getFormatName(
                          outputFormat
                        )}
                      </span>

                    </div>

                  </div>

                  {/* PRIVACY */}
                  <div className="mt-5 rounded-lg border border-gray-200 p-4">

                    <div className="flex gap-3">

                      <span className="text-lg">
                        🔒
                      </span>

                      <div>
                        <p className="font-medium text-gray-800">
                          Private & Secure
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Your image is processed directly
                          in your browser. No upload to a
                          server is required.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* MESSAGE */}
                  {message && (
                    <div
                      className={`mt-5 rounded-lg p-4 text-sm ${
                        message.startsWith(
                          "Successfully"
                        )
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  {/* DOWNLOAD */}
                  <button
                    onClick={convertImage}
                    disabled={converting}
                    className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {converting
                      ? "Converting..."
                      : "🔄 Convert & Download"}
                  </button>

                </div>

              </div>
            </>
          )}

        </div>

        {/* HOW TO */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            How to convert an image?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">

            <li>
              1. Upload your image.
            </li>

            <li>
              2. Choose PNG, JPG, WEBP or AVIF.
            </li>

            <li>
              3. Adjust quality if required.
            </li>

            <li>
              4. Click “Convert & Download”.
            </li>

            <li>
              5. Your converted image downloads
              automatically.
            </li>

          </ol>

        </div>

        {/* SUPPORTED FORMATS */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Supported Output Formats
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">

            {OUTPUT_FORMATS.map(
              (format) => (
                <div
                  key={format.mime}
                  className="rounded-lg border border-gray-200 p-4 text-center"
                >
                  <p className="font-bold text-gray-900">
                    {format.label}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    .{format.extension}
                  </p>
                </div>
              )
            )}

          </div>

        </div>

      </div>
    </main>
  );
}