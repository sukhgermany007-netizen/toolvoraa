"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("resized-image.png");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState("image/png");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImage(url);
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      setFileName(
        file.name.replace(/\.[^/.]+$/, "") + "-resized"
      );
    };

    img.src = url;
  };

  const handleWidthChange = (value: number) => {
    setWidth(value);

    if (keepRatio && originalWidth > 0) {
      const newHeight = Math.round(
        (value / originalWidth) * originalHeight
      );
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);

    if (keepRatio && originalHeight > 0) {
      const newWidth = Math.round(
        (value / originalHeight) * originalWidth
      );
      setWidth(newWidth);
    }
  };

  const resizeImage = () => {
    if (!image || width <= 0 || height <= 0) return;

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      const extension =
        format === "image/jpeg"
          ? "jpg"
          : format === "image/webp"
          ? "webp"
          : "png";

      const downloadName = `${fileName}.${extension}`;

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = downloadUrl;
          link.download = downloadName;
          link.click();

          URL.revokeObjectURL(downloadUrl);
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image Resizer
          </h1>

          <p className="mt-2 text-gray-600">
            Resize your images quickly and easily in your browser.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12 transition hover:border-blue-500 hover:bg-blue-50">
              <div className="mb-4 text-5xl">🖼️</div>

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
            <div>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">
                      Preview
                    </h2>

                    <button
                      onClick={() => {
                        setImage(null);
                        setOriginalWidth(0);
                        setOriginalHeight(0);
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-gray-100 p-4">
                    <img
                      src={image}
                      alt="Preview"
                      className="max-h-[400px] max-w-full rounded-lg object-contain"
                    />
                  </div>

                  <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
                    <p className="text-gray-600">
                      Original Size
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {originalWidth} × {originalHeight} px
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-5 font-semibold text-gray-800">
                    Resize Settings
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Width (px)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={width}
                        onChange={(e) =>
                          handleWidthChange(Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Height (px)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={height}
                        onChange={(e) =>
                          handleHeightChange(Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={keepRatio}
                        onChange={(e) =>
                          setKeepRatio(e.target.checked)
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm text-gray-700">
                        Maintain aspect ratio
                      </span>
                    </label>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Output Format
                      </label>

                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                      >
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPG</option>
                        <option value="image/webp">WEBP</option>
                      </select>
                    </div>

                    <button
                      onClick={resizeImage}
                      className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Resize & Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            How to resize an image?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">
            <li>1. Upload your image.</li>
            <li>2. Enter the required width and height.</li>
            <li>3. Keep aspect ratio enabled if needed.</li>
            <li>4. Select your output format.</li>
            <li>5. Click “Resize & Download”.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}