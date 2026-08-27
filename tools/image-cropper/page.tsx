"use client";

import { useEffect, useRef, useState } from "react";

type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [ratio, setRatio] = useState("free");
  const [dragging, setDragging] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startPoint = useRef({
    x: 0,
    y: 0,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {
      setImage(url);
      setRatio("free");

      setTimeout(() => {
        if (!imageRef.current) return;

        const width = imageRef.current.clientWidth;
        const height = imageRef.current.clientHeight;

        setImageWidth(width);
        setImageHeight(height);

        const cropWidth = width * 0.8;
        const cropHeight = height * 0.8;

        setCrop({
          x: (width - cropWidth) / 2,
          y: (height - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
        });
      }, 100);
    };

    img.src = url;
  };

  const getPointerPosition = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!imageRef.current) {
      return { x: 0, y: 0 };
    }

    const rect = imageRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    return { x, y };
  };

  const getAspectRatio = () => {
    if (ratio === "1:1") return 1;
    if (ratio === "4:3") return 4 / 3;
    if (ratio === "16:9") return 16 / 9;

    return null;
  };

  const startSelection = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!image) return;

    e.preventDefault();

    e.currentTarget.setPointerCapture(e.pointerId);

    const point = getPointerPosition(e);

    startPoint.current = point;

    setCrop({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    });

    setDragging(true);
  };

  const updateSelection = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragging || !imageRef.current) return;

    const point = getPointerPosition(e);
    const start = startPoint.current;

    let x = Math.min(start.x, point.x);
    let y = Math.min(start.y, point.y);

    let width = Math.abs(point.x - start.x);
    let height = Math.abs(point.y - start.y);

    const aspect = getAspectRatio();

    if (aspect) {
      if (width > 0) {
        height = width / aspect;
      }

      if (start.y > point.y) {
        y = start.y - height;
      }

      if (start.x > point.x) {
        x = start.x - width;
      }

      if (x < 0) {
        x = 0;
      }

      if (y < 0) {
        y = 0;
      }

      if (x + width > imageWidth) {
        width = imageWidth - x;
        height = width / aspect;
      }

      if (y + height > imageHeight) {
        height = imageHeight - y;
        width = height * aspect;
      }
    }

    setCrop({
      x,
      y,
      width,
      height,
    });
  };

  const finishSelection = () => {
    setDragging(false);
  };

  const setPreset = (preset: string) => {
    if (!imageRef.current) return;

    setRatio(preset);

    const width = imageRef.current.clientWidth;
    const height = imageRef.current.clientHeight;

    let cropWidth = width * 0.8;
    let cropHeight = height * 0.8;

    if (preset === "1:1") {
      const size = Math.min(cropWidth, cropHeight);

      cropWidth = size;
      cropHeight = size;
    }

    if (preset === "4:3") {
      const aspect = 4 / 3;

      if (cropWidth / cropHeight > aspect) {
        cropWidth = cropHeight * aspect;
      } else {
        cropHeight = cropWidth / aspect;
      }
    }

    if (preset === "16:9") {
      const aspect = 16 / 9;

      if (cropWidth / cropHeight > aspect) {
        cropWidth = cropHeight * aspect;
      } else {
        cropHeight = cropWidth / aspect;
      }
    }

    setCrop({
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    });
  };

  const cropImage = () => {
    if (
      !image ||
      crop.width < 5 ||
      crop.height < 5 ||
      !imageRef.current
    ) {
      alert("Please select a crop area first.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const scaleX = img.naturalWidth / imageRef.current!.clientWidth;
      const scaleY = img.naturalHeight / imageRef.current!.clientHeight;

      const sourceX = crop.x * scaleX;
      const sourceY = crop.y * scaleY;

      const sourceWidth = crop.width * scaleX;
      const sourceHeight = crop.height * scaleY;

      canvas.width = Math.round(sourceWidth);
      canvas.height = Math.round(sourceHeight);

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");

          link.href = url;
          link.download = "cropped-image.png";

          document.body.appendChild(link);
          link.click();
          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        },
        "image/png"
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image Cropper
          </h1>

          <p className="mt-2 text-gray-600">
            Crop your images quickly and easily in your browser.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          {!image ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-14 transition hover:border-blue-500 hover:bg-blue-50">
              <div className="mb-4 text-5xl">✂️</div>

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
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Select Crop Area
                  </h2>

                  <p className="text-sm text-gray-500">
                    Click and drag on the image.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setImage(null);
                    setCrop({
                      x: 0,
                      y: 0,
                      width: 0,
                      height: 0,
                    });
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {/* IMAGE CROPPER */}
              <div
                ref={containerRef}
                className="flex justify-center overflow-hidden rounded-xl bg-gray-900 p-4"
              >
                <div
                  className="relative inline-block cursor-crosshair select-none"
                  onPointerDown={startSelection}
                  onPointerMove={updateSelection}
                  onPointerUp={finishSelection}
                  onPointerCancel={finishSelection}
                >
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Crop"
                    draggable={false}
                    onLoad={() => {
                      if (!imageRef.current) return;

                      const width =
                        imageRef.current.clientWidth;

                      const height =
                        imageRef.current.clientHeight;

                      setImageWidth(width);
                      setImageHeight(height);

                      if (crop.width === 0) {
                        const cropWidth = width * 0.8;
                        const cropHeight = height * 0.8;

                        setCrop({
                          x: (width - cropWidth) / 2,
                          y: (height - cropHeight) / 2,
                          width: cropWidth,
                          height: cropHeight,
                        });
                      }
                    }}
                    className="block max-h-[600px] max-w-full"
                  />

                  {/* DARK OVERLAY */}
                  {crop.width > 5 &&
                    crop.height > 5 && (
                      <>
                        <div
                          className="pointer-events-none absolute inset-0 bg-black/45"
                        />

                        {/* CROP BOX */}
                        <div
                          className="pointer-events-none absolute border-2 border-white"
                          style={{
                            left: crop.x,
                            top: crop.y,
                            width: crop.width,
                            height: crop.height,
                          }}
                        >
                          {/* GRID */}
                          <div className="absolute left-1/3 top-0 h-full border-l border-white/50" />
                          <div className="absolute left-2/3 top-0 h-full border-l border-white/50" />

                          <div className="absolute left-0 top-1/3 w-full border-t border-white/50" />
                          <div className="absolute left-0 top-2/3 w-full border-t border-white/50" />

                          {/* CORNER HANDLES */}
                          <div className="absolute -left-1 -top-1 h-3 w-3 bg-white" />
                          <div className="absolute -right-1 -top-1 h-3 w-3 bg-white" />
                          <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-white" />
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-white" />
                        </div>
                      </>
                    )}
                </div>
              </div>

              {/* ASPECT RATIO */}
              <div className="mt-6">
                <h2 className="mb-3 font-semibold text-gray-800">
                  Aspect Ratio
                </h2>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setPreset("free")}
                    className={`rounded-lg px-5 py-2 font-medium ${
                      ratio === "free"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Free
                  </button>

                  <button
                    onClick={() => setPreset("1:1")}
                    className={`rounded-lg px-5 py-2 font-medium ${
                      ratio === "1:1"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    1:1
                  </button>

                  <button
                    onClick={() => setPreset("4:3")}
                    className={`rounded-lg px-5 py-2 font-medium ${
                      ratio === "4:3"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    4:3
                  </button>

                  <button
                    onClick={() => setPreset("16:9")}
                    className={`rounded-lg px-5 py-2 font-medium ${
                      ratio === "16:9"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    16:9
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Original Size
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {imageRef.current?.naturalWidth || 0} ×{" "}
                    {imageRef.current?.naturalHeight || 0} px
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Crop Size
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {imageRef.current
                      ? Math.round(
                          crop.width *
                            (imageRef.current.naturalWidth /
                              imageRef.current.clientWidth)
                        )
                      : 0}{" "}
                    ×{" "}
                    {imageRef.current
                      ? Math.round(
                          crop.height *
                            (imageRef.current.naturalHeight /
                              imageRef.current.clientHeight)
                        )
                      : 0}{" "}
                    px
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Ratio
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {ratio}
                  </p>
                </div>
              </div>

              {/* DOWNLOAD */}
              <button
                onClick={cropImage}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
              >
                ✂️ Crop & Download
              </button>
            </>
          )}
        </div>

        {/* HOW TO */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            How to crop an image?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">
            <li>1. Upload your image.</li>
            <li>2. Click and drag over the image.</li>
            <li>3. Choose Free, 1:1, 4:3 or 16:9.</li>
            <li>4. Check the crop size.</li>
            <li>5. Click “Crop & Download”.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}