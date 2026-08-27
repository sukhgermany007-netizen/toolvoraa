"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageRotator() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("rotated-image");
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [format, setFormat] = useState("image/png");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    setFileName(
      file.name.replace(/\.[^/.]+$/, "") + "-rotated"
    );
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const rotate180 = () => {
    setRotation((prev) => (prev + 180) % 360);
  };

  const resetImage = () => {
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  const downloadImage = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const isSideways =
        rotation === 90 || rotation === 270;

      const outputWidth = isSideways
        ? img.naturalHeight
        : img.naturalWidth;

      const outputHeight = isSideways
        ? img.naturalWidth
        : img.naturalHeight;

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.clearRect(0, 0, outputWidth, outputHeight);

      ctx.save();

      ctx.translate(
        outputWidth / 2,
        outputHeight / 2
      );

      ctx.rotate((rotation * Math.PI) / 180);

      ctx.scale(
        flipX ? -1 : 1,
        flipY ? -1 : 1
      );

      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2
      );

      ctx.restore();

      const extension =
        format === "image/jpeg"
          ? "jpg"
          : format === "image/webp"
          ? "webp"
          : "png";

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");

          link.href = url;
          link.download = `${fileName}.${extension}`;

          document.body.appendChild(link);
          link.click();
          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        },
        format,
        0.92
      );
    };

    img.src = image;
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
            Image Rotator
          </h1>

          <p className="mt-2 text-gray-600">
            Rotate and flip your images online.
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
                JPG, PNG or WEBP
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
              {/* PREVIEW */}
              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Preview
                  </h2>

                  <p className="text-sm text-gray-500">
                    Rotate or flip your image.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setImage(null);
                    resetImage();
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>

              </div>

              <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-8">

                <div
                  className="transition-transform duration-300"
                  style={{
                    transform: `
                      rotate(${rotation}deg)
                      scaleX(${flipX ? -1 : 1})
                      scaleY(${flipY ? -1 : 1})
                    `,
                  }}
                >
                  <img
                    src={image}
                    alt="Rotated preview"
                    className="max-h-[500px] max-w-full object-contain"
                    draggable={false}
                  />
                </div>

              </div>

              {/* ROTATION BUTTONS */}
              <div className="mt-6">

                <h2 className="mb-3 font-semibold text-gray-800">
                  Rotate
                </h2>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={rotateCounterClockwise}
                    className="rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200"
                  >
                    ↺ 90° Left
                  </button>

                  <button
                    onClick={rotateClockwise}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    ↻ 90° Right
                  </button>

                  <button
                    onClick={rotate180}
                    className="rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200"
                  >
                    180°
                  </button>

                </div>

              </div>

              {/* FLIP BUTTONS */}
              <div className="mt-6">

                <h2 className="mb-3 font-semibold text-gray-800">
                  Flip
                </h2>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() => setFlipX((prev) => !prev)}
                    className={`rounded-lg px-5 py-3 font-medium ${
                      flipX
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ↔ Flip Horizontal
                  </button>

                  <button
                    onClick={() => setFlipY((prev) => !prev)}
                    className={`rounded-lg px-5 py-3 font-medium ${
                      flipY
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ↕ Flip Vertical
                  </button>

                  <button
                    onClick={resetImage}
                    className="rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Reset
                  </button>

                </div>

              </div>

              {/* SETTINGS */}
              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Output Format
                </label>

                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="image/png">
                    PNG
                  </option>

                  <option value="image/jpeg">
                    JPG
                  </option>

                  <option value="image/webp">
                    WEBP
                  </option>
                </select>

              </div>

              {/* STATUS */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Rotation
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {rotation}°
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Horizontal Flip
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {flipX ? "ON" : "OFF"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Vertical Flip
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {flipY ? "ON" : "OFF"}
                  </p>
                </div>

              </div>

              {/* DOWNLOAD */}
              <button
                onClick={downloadImage}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
              >
                🔄 Rotate & Download
              </button>
            </>
          )}
        </div>

        {/* HOW TO */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            How to rotate an image?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              1. Upload your image.
            </li>

            <li>
              2. Rotate the image left or right.
            </li>

            <li>
              3. Use flip options if needed.
            </li>

            <li>
              4. Select PNG, JPG or WEBP.
            </li>

            <li>
              5. Click “Rotate & Download”.
            </li>
          </ol>

        </div>

        <canvas
          ref={canvasRef}
          className="hidden"
        />

      </div>
    </main>
  );
}