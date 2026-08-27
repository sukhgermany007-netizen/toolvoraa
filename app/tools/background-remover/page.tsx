"use client";

import { useEffect, useRef, useState } from "react";
export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [fileName, setFileName] =
    useState("background-removed");

  const [processing, setProcessing] =
    useState(false);

  const [progress, setProgress] = useState(0);

  const [status, setStatus] =
    useState("");

  const [error, setError] =
    useState("");

  const [imageWidth, setImageWidth] =
    useState(0);

  const [imageHeight, setImageHeight] =
    useState(0);

  const originalUrlRef =
    useRef<string | null>(null);

  const resultUrlRef =
    useRef<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    // Clean previous URLs
    if (originalUrlRef.current) {
      URL.revokeObjectURL(
        originalUrlRef.current
      );
    }

    if (resultUrlRef.current) {
      URL.revokeObjectURL(
        resultUrlRef.current
      );
    }

    const url =
      URL.createObjectURL(file);

    originalUrlRef.current = url;

    const img = new Image();

    img.onload = () => {
      setImage(url);
      setResult(null);

      setImageWidth(
        img.naturalWidth
      );

      setImageHeight(
        img.naturalHeight
      );

      setFileName(
        file.name.replace(
          /\.[^/.]+$/,
          ""
        )
      );

      setProgress(0);
      setStatus("");
      setError("");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Could not load this image.");
    };

    img.src = url;

    e.target.value = "";
  };

  const removeBackground = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError("");
    setResult(null);

    setStatus(
      "Loading AI background removal model..."
    );

    try {
      /*
       * Dynamic import prevents the AI package
       * from being evaluated during server rendering.
       */
   const module = await import("@imgly/background-removal");

const removeBg: any =
  (module as any).removeBackground ||
  (module as any).default;

      setStatus(
        "Removing background..."
      );

      const resultBlob =
        await removeBg(image, {
           
          progress: (
            key: string,
            current: number,
            total: number
          ) => {
            if (total > 0) {
              const percent = Math.round(
                (current / total) * 100
              );

              setProgress(percent);
            }

            if (
              key
                .toLowerCase()
                .includes("fetch")
            ) {
              setStatus(
                "Downloading AI model..."
              );
            } else {
              setStatus(
                "Removing background..."
              );
            }
          },
        });

      if (!resultBlob) {
        throw new Error(
          "Background removal returned no result."
        );
      }

      const resultUrl =
        URL.createObjectURL(
          resultBlob
        );

      if (resultUrlRef.current) {
        URL.revokeObjectURL(
          resultUrlRef.current
        );
      }

      resultUrlRef.current =
        resultUrl;

      setResult(resultUrl);
      setProgress(100);
      setStatus(
        "Background removed successfully!"
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not remove the background. Please try again."
      );

      setStatus("");
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) {
      alert(
        "Please remove the background first."
      );

      return;
    }

    const link =
      document.createElement("a");

    link.href = result;

    link.download =
      `${fileName}-background-removed.png`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const removeImage = () => {
    if (originalUrlRef.current) {
      URL.revokeObjectURL(
        originalUrlRef.current
      );
    }

    if (resultUrlRef.current) {
      URL.revokeObjectURL(
        resultUrlRef.current
      );
    }

    originalUrlRef.current = null;
    resultUrlRef.current = null;

    setImage(null);
    setResult(null);

    setImageWidth(0);
    setImageHeight(0);

    setProgress(0);
    setStatus("");
    setError("");
  };

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) {
        URL.revokeObjectURL(
          originalUrlRef.current
        );
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(
          resultUrlRef.current
        );
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Background Remover
          </h1>

          <p className="mt-2 text-gray-600">
            Remove image backgrounds automatically
            with AI.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">

          {/* UPLOAD */}
          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-16 transition hover:border-blue-500 hover:bg-blue-50">

              <div className="mb-4 text-6xl">
                ✂️
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                Choose an Image
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or WEBP
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Best results with clear subjects
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
                    Background Removal
                  </h2>

                  <p className="text-sm text-gray-500">
                    {imageWidth} ×{" "}
                    {imageHeight} px
                  </p>
                </div>

                <button
                  onClick={removeImage}
                  disabled={processing}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Remove
                </button>

              </div>

              {/* PREVIEW */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* ORIGINAL */}
                <div>

                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Original Image
                    </h3>
                  </div>

                  <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-6">

                    <img
                      src={image}
                      alt="Original"
                      className="max-h-[500px] max-w-full object-contain"
                    />

                  </div>

                </div>

                {/* RESULT */}
                <div>

                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Background Removed
                    </h3>
                  </div>

                  <div
                    className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl p-6"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                      backgroundSize:
                        "24px 24px",
                      backgroundPosition:
                        "0 0, 0 12px, 12px -12px, -12px 0px",
                      backgroundColor:
                        "#ffffff",
                    }}
                  >

                    {result ? (
                      <img
                        src={result}
                        alt="Background removed"
                        className="max-h-[500px] max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">

                        <div className="mb-3 text-5xl">
                          ✨
                        </div>

                        <p className="font-medium text-gray-600">
                          Your result will appear here
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* PROGRESS */}
              {processing && (
                <div className="mt-8 rounded-xl bg-blue-50 p-5">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-sm font-medium text-gray-700">
                      {status}
                    </span>

                    <span className="text-sm font-bold text-blue-600">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-blue-100">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    The first run may take longer while
                    the AI model is downloaded and cached.
                  </p>

                </div>
              )}

              {/* SUCCESS */}
              {!processing &&
                result &&
                !error && (
                  <div className="mt-6 rounded-xl bg-green-50 p-4">

                    <p className="font-medium text-green-700">
                      ✓ Background removed successfully!
                    </p>

                    <p className="mt-1 text-sm text-green-600">
                      Your image has a transparent
                      background and is ready to download.
                    </p>

                  </div>
                )}

              {/* ERROR */}
              {error && (
                <div className="mt-6 rounded-xl bg-red-50 p-4">

                  <p className="font-medium text-red-700">
                    {error}
                  </p>

                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-6 grid gap-3 md:grid-cols-2">

                <button
                  onClick={removeBackground}
                  disabled={processing}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing
                    ? "Removing Background..."
                    : "✂️ Remove Background"}
                </button>

                <button
                  onClick={downloadResult}
                  disabled={!result || processing}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ⬇️ Download Transparent PNG
                </button>

              </div>

            </>
          )}

        </div>

        {/* PRIVACY */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex gap-3">

            <span className="text-xl">
              🔒
            </span>

            <div>

              <h2 className="font-semibold text-gray-900">
                Private Browser Processing
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Background removal runs directly in
                your browser using an AI model. Your
                selected image does not need to be
                uploaded to our server.
              </p>

            </div>

          </div>

        </div>

        {/* HOW TO */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            How to remove an image background?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">

            <li>
              1. Upload your JPG, PNG or WEBP image.
            </li>

            <li>
              2. Click “Remove Background”.
            </li>

            <li>
              3. Wait while the AI processes the image.
            </li>

            <li>
              4. Preview the transparent result.
            </li>

            <li>
              5. Click “Download Transparent PNG”.
            </li>

          </ol>

        </div>

        {/* FEATURES */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <div className="text-3xl">
              🤖
            </div>

            <h3 className="mt-3 font-semibold">
              AI Powered
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Automatically detects the foreground
              subject.
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <div className="text-3xl">
              🔒
            </div>

            <h3 className="mt-3 font-semibold">
              Private
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Processing happens locally in your
              browser.
            </p>

          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <div className="text-3xl">
              🖼️
            </div>

            <h3 className="mt-3 font-semibold">
              Transparent PNG
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Download your subject with a transparent
              background.
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}