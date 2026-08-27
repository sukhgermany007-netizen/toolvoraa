"use client";

import { useEffect, useRef, useState } from "react";

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("watermarked-image");

  const [watermarkText, setWatermarkText] =
    useState("ToolHub AI");

  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(60);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bold, setBold] = useState(true);
  const [position, setPosition] =
    useState<Position>("bottom-right");
  const [rotation, setRotation] = useState(-20);
  const [outputFormat, setOutputFormat] =
    useState("image/png");

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const url = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {
      setImage(url);

      setFileName(
        file.name.replace(/\.[^/.]+$/, "")
      );

      setImageWidth(img.naturalWidth);
      setImageHeight(img.naturalHeight);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Could not load this image.");
    };

    img.src = url;

    e.target.value = "";
  };

  const getPosition = (
    width: number,
    height: number,
    textWidth: number,
    textHeight: number
  ) => {
    const padding = Math.max(
      30,
      Math.min(width, height) * 0.04
    );

    let x = width / 2;
    let y = height / 2;

    switch (position) {
      case "top-left":
        x = padding + textWidth / 2;
        y = padding + textHeight / 2;
        break;

      case "top-center":
        x = width / 2;
        y = padding + textHeight / 2;
        break;

      case "top-right":
        x =
          width -
          padding -
          textWidth / 2;
        y = padding + textHeight / 2;
        break;

      case "center-left":
        x = padding + textWidth / 2;
        y = height / 2;
        break;

      case "center":
        x = width / 2;
        y = height / 2;
        break;

      case "center-right":
        x =
          width -
          padding -
          textWidth / 2;
        y = height / 2;
        break;

      case "bottom-left":
        x = padding + textWidth / 2;
        y =
          height -
          padding -
          textHeight / 2;
        break;

      case "bottom-center":
        x = width / 2;
        y =
          height -
          padding -
          textHeight / 2;
        break;

      case "bottom-right":
        x =
          width -
          padding -
          textWidth / 2;
        y =
          height -
          padding -
          textHeight / 2;
        break;
    }

    return { x, y };
  };

  const drawWatermark = (
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw original image
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (!watermarkText.trim()) return;

    // Scale font according to original image size
    const scale =
      Math.max(
        img.naturalWidth,
        img.naturalHeight
      ) / 1200;

    const actualFontSize = Math.max(
      12,
      fontSize * scale
    );

    const fontWeight = bold
      ? "bold"
      : "normal";

    ctx.font = `${fontWeight} ${actualFontSize}px Arial`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics =
      ctx.measureText(watermarkText);

    const textWidth = metrics.width;
    const textHeight = actualFontSize;

    const { x, y } = getPosition(
      canvas.width,
      canvas.height,
      textWidth,
      textHeight
    );

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(
      (rotation * Math.PI) / 180
    );

    ctx.globalAlpha = opacity / 100;

    ctx.fillStyle = textColor;

    ctx.fillText(
      watermarkText,
      0,
      0
    );

    ctx.restore();
  };

  // Live preview
  useEffect(() => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      drawWatermark(canvas, img);
    };

    img.src = image;
  }, [
    image,
    watermarkText,
    fontSize,
    opacity,
    textColor,
    bold,
    position,
    rotation,
  ]);

  const downloadImage = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    if (!watermarkText.trim()) {
      alert("Please enter watermark text.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas =
        document.createElement("canvas");

      drawWatermark(canvas, img);

      const extension =
        outputFormat === "image/jpeg"
          ? "jpg"
          : outputFormat === "image/webp"
          ? "webp"
          : "png";

      const quality =
        outputFormat === "image/png"
          ? undefined
          : 0.92;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Could not create image.");
            return;
          }

          const url =
            URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = url;

          link.download = `${fileName}-watermarked.${extension}`;

          document.body.appendChild(link);

          link.click();

          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        },
        outputFormat,
        quality
      );
    };

    img.src = image;
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setImageWidth(0);
    setImageHeight(0);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image Watermark
          </h1>

          <p className="mt-2 text-gray-600">
            Add a custom text watermark to your images.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">

          {/* UPLOAD */}
          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-14 transition hover:border-blue-500 hover:bg-blue-50">

              <div className="mb-4 text-5xl">
                💧
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
              {/* TOP BAR */}
              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Watermark Preview
                  </h2>

                  <p className="text-sm text-gray-500">
                    Changes appear instantly.
                  </p>
                </div>

                <button
                  onClick={removeImage}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>

              </div>

              <div className="grid gap-8 lg:grid-cols-2">

                {/* PREVIEW */}
                <div>

                  <div className="flex min-h-[450px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-5">

                    <canvas
                      ref={canvasRef}
                      className="max-h-[500px] max-w-full object-contain"
                    />

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Image Width
                      </p>

                      <p className="mt-1 font-semibold">
                        {imageWidth}px
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Image Height
                      </p>

                      <p className="mt-1 font-semibold">
                        {imageHeight}px
                      </p>
                    </div>

                  </div>

                </div>

                {/* SETTINGS */}
                <div>

                  <h2 className="mb-5 font-semibold text-gray-800">
                    Watermark Settings
                  </h2>

                  {/* TEXT */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Watermark Text
                    </label>

                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) =>
                        setWatermarkText(
                          e.target.value
                        )
                      }
                      placeholder="Enter watermark text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* FONT SIZE */}
                  <div className="mt-5">

                    <div className="mb-2 flex justify-between">

                      <label className="text-sm font-medium text-gray-700">
                        Font Size
                      </label>

                      <span className="text-sm font-semibold text-blue-600">
                        {fontSize}px
                      </span>

                    </div>

                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) =>
                        setFontSize(
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />

                  </div>

                  {/* OPACITY */}
                  <div className="mt-5">

                    <div className="mb-2 flex justify-between">

                      <label className="text-sm font-medium text-gray-700">
                        Opacity
                      </label>

                      <span className="text-sm font-semibold text-blue-600">
                        {opacity}%
                      </span>

                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={opacity}
                      onChange={(e) =>
                        setOpacity(
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />

                  </div>

                  {/* COLOR + BOLD */}
                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Text Color
                      </label>

                      <div className="flex items-center gap-3">

                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) =>
                            setTextColor(
                              e.target.value
                            )
                          }
                          className="h-11 w-16 cursor-pointer rounded border"
                        />

                        <span className="text-sm text-gray-600">
                          {textColor}
                        </span>

                      </div>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Font Style
                      </label>

                      <button
                        onClick={() =>
                          setBold((prev) => !prev)
                        }
                        className={`w-full rounded-lg px-4 py-3 font-medium ${
                          bold
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {bold
                          ? "Bold"
                          : "Normal"}
                      </button>

                    </div>

                  </div>

                  {/* POSITION */}
                  <div className="mt-6">

                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      Position
                    </label>

                    <div className="mx-auto grid max-w-[300px] grid-cols-3 gap-2">

                      {[
                        [
                          "top-left",
                          "↖",
                        ],
                        [
                          "top-center",
                          "↑",
                        ],
                        [
                          "top-right",
                          "↗",
                        ],
                        [
                          "center-left",
                          "←",
                        ],
                        [
                          "center",
                          "●",
                        ],
                        [
                          "center-right",
                          "→",
                        ],
                        [
                          "bottom-left",
                          "↙",
                        ],
                        [
                          "bottom-center",
                          "↓",
                        ],
                        [
                          "bottom-right",
                          "↘",
                        ],
                      ].map(
                        ([value, icon]) => (
                          <button
                            key={value}
                            onClick={() =>
                              setPosition(
                                value as Position
                              )
                            }
                            className={`rounded-lg py-3 text-lg ${
                              position === value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            title={value}
                          >
                            {icon}
                          </button>
                        )
                      )}

                    </div>

                  </div>

                  {/* ROTATION */}
                  <div className="mt-6">

                    <div className="mb-2 flex justify-between">

                      <label className="text-sm font-medium text-gray-700">
                        Rotation
                      </label>

                      <span className="text-sm font-semibold text-blue-600">
                        {rotation}°
                      </span>

                    </div>

                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotation}
                      onChange={(e) =>
                        setRotation(
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />

                  </div>

                  {/* OUTPUT */}
                  <div className="mt-6">

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Output Format
                    </label>

                    <select
                      value={outputFormat}
                      onChange={(e) =>
                        setOutputFormat(
                          e.target.value
                        )
                      }
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

                  {/* DOWNLOAD */}
                  <button
                    onClick={downloadImage}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
                  >
                    💧 Add Watermark & Download
                  </button>

                </div>

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
                Private & Secure
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your image is processed directly in
                your browser. No upload to a server
                is required.
              </p>

            </div>

          </div>

        </div>

        {/* HOW TO */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            How to add a watermark?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">

            <li>
              1. Upload your image.
            </li>

            <li>
              2. Enter your watermark text.
            </li>

            <li>
              3. Adjust font size and opacity.
            </li>

            <li>
              4. Choose color and position.
            </li>

            <li>
              5. Adjust rotation if required.
            </li>

            <li>
              6. Select PNG, JPG or WEBP.
            </li>

            <li>
              7. Click “Add Watermark & Download”.
            </li>

          </ol>

        </div>

      </div>
    </main>
  );
}