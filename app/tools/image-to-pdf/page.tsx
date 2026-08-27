"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
};

export default function ImageToPDF() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [fitMode, setFitMode] = useState("contain");
  const [margin, setMargin] = useState(20);
  const [creating, setCreating] = useState(false);

  const handleFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    imageFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const newImage: ImageItem = {
          id:
            Date.now().toString() +
            Math.random().toString(36).slice(2),
          file,
          preview: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        setImages((prev) => [...prev, newImage]);
      };

      img.src = url;
    });

    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((image) => image.id === id);

      if (item) {
        URL.revokeObjectURL(item.preview);
      }

      return prev.filter((image) => image.id !== id);
    });
  };

  const moveImage = (
    index: number,
    direction: "up" | "down"
  ) => {
    setImages((prev) => {
      const newImages = [...prev];

      if (
        direction === "up" &&
        index > 0
      ) {
        [
          newImages[index - 1],
          newImages[index],
        ] = [
          newImages[index],
          newImages[index - 1],
        ];
      }

      if (
        direction === "down" &&
        index < newImages.length - 1
      ) {
        [
          newImages[index],
          newImages[index + 1],
        ] = [
          newImages[index + 1],
          newImages[index],
        ];
      }

      return newImages;
    });
  };

  const clearAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setImages([]);
  };

  const getPageDimensions = () => {
    let width = 595.28;
    let height = 841.89;

    if (pageSize === "Letter") {
      width = 612;
      height = 792;
    }

    if (pageSize === "Original") {
      if (images.length > 0) {
        width = images[0].width * 0.75;
        height = images[0].height * 0.75;
      }
    }

    if (orientation === "landscape") {
      [width, height] = [height, width];
    }

    return {
      width,
      height,
    };
  };

  const imageToJpeg = (
    file: File
  ): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas =
          document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(
            new Error("Could not create canvas.")
          );
          return;
        }

        // White background for transparent images.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(
          async (blob) => {
            URL.revokeObjectURL(url);

            if (!blob) {
              reject(
                new Error(
                  "Could not convert image."
                )
              );
              return;
            }

            resolve(
              await blob.arrayBuffer()
            );
          },
          "image/jpeg",
          0.92
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(
          new Error("Could not load image.")
        );
      };

      img.src = url;
    });
  };

  const createPDF = async () => {
    if (!images.length) {
      alert("Please upload at least one image.");
      return;
    }

    setCreating(true);

    try {
      const pdfDoc =
        await PDFDocument.create();

      for (const image of images) {
        const {
          width: pageWidth,
          height: pageHeight,
        } = getPageDimensions();

        const page = pdfDoc.addPage([
          pageWidth,
          pageHeight,
        ]);

        const imageBytes =
          await imageToJpeg(image.file);

        const embeddedImage =
          await pdfDoc.embedJpg(
            imageBytes
          );

        const imageWidth =
          embeddedImage.width;

        const imageHeight =
          embeddedImage.height;

        const availableWidth =
          pageWidth - margin * 2;

        const availableHeight =
          pageHeight - margin * 2;

        let drawWidth = availableWidth;
        let drawHeight = availableHeight;

        if (fitMode === "contain") {
          const scale = Math.min(
            availableWidth / imageWidth,
            availableHeight / imageHeight
          );

          drawWidth =
            imageWidth * scale;

          drawHeight =
            imageHeight * scale;
        }

        if (fitMode === "fill") {
          drawWidth =
            availableWidth;

          drawHeight =
            availableHeight;
        }

        const x =
          (pageWidth - drawWidth) / 2;

        const y =
          (pageHeight - drawHeight) / 2;

        page.drawImage(
          embeddedImage,
          {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
          }
        );
      }
const pdfBytes = await pdfDoc.save();
     const pdfBuffer = pdfBytes.buffer as ArrayBuffer;

const blob = new Blob(
  [pdfBuffer],
  {
    type: "application/pdf",
  }
);
      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "images-to-pdf.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error(error);

      alert(
        "Could not create PDF. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Image to PDF
          </h1>

          <p className="mt-2 text-gray-600">
            Convert multiple images into one PDF
            document.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">

          {/* UPLOAD */}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 transition hover:border-blue-500 hover:bg-blue-50">

            <div className="mb-4 text-5xl">
              📄
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Choose Images
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select one or multiple JPG, PNG or
              WEBP images
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFiles}
              className="hidden"
            />

          </label>

          {/* IMAGE LIST */}
          {images.length > 0 && (
            <div className="mt-8">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Selected Images
                  </h2>

                  <p className="text-sm text-gray-500">
                    {images.length} image
                    {images.length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                </div>

                <button
                  onClick={clearAll}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>

              </div>

              <div className="space-y-3">
                {images.map(
                  (image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >

                      {/* NUMBER */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      {/* PREVIEW */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                        <img
                          src={image.preview}
                          alt={`Image ${
                            index + 1
                          }`}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="min-w-0 flex-1">

                        <p className="truncate font-medium text-gray-800">
                          {image.file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {image.width} ×{" "}
                          {image.height} px
                        </p>

                      </div>

                      {/* MOVE BUTTONS */}
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            moveImage(
                              index,
                              "up"
                            )
                          }
                          disabled={
                            index === 0
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Move Up"
                        >
                          ↑
                        </button>

                        <button
                          onClick={() =>
                            moveImage(
                              index,
                              "down"
                            )
                          }
                          disabled={
                            index ===
                            images.length - 1
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Move Down"
                        >
                          ↓
                        </button>

                        <button
                          onClick={() =>
                            removeImage(
                              image.id
                            )
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow-sm hover:bg-red-50"
                          title="Remove"
                        >
                          ✕
                        </button>

                      </div>

                    </div>
                  )
                )}
              </div>

              {/* SETTINGS */}
              <div className="mt-8">

                <h2 className="mb-5 font-semibold text-gray-800">
                  PDF Settings
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* PAGE SIZE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Page Size
                    </label>

                    <select
                      value={pageSize}
                      onChange={(e) =>
                        setPageSize(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="A4">
                        A4
                      </option>

                      <option value="Letter">
                        Letter
                      </option>

                      <option value="Original">
                        Original Image Size
                      </option>
                    </select>
                  </div>

                  {/* ORIENTATION */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Orientation
                    </label>

                    <select
                      value={orientation}
                      onChange={(e) =>
                        setOrientation(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="portrait">
                        Portrait
                      </option>

                      <option value="landscape">
                        Landscape
                      </option>
                    </select>
                  </div>

                  {/* FIT */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Image Fit
                    </label>

                    <select
                      value={fitMode}
                      onChange={(e) =>
                        setFitMode(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="contain">
                        Fit Inside Page
                      </option>

                      <option value="fill">
                        Fill Page
                      </option>
                    </select>
                  </div>

                  {/* MARGIN */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Margin
                    </label>

                    <select
                      value={margin}
                      onChange={(e) =>
                        setMargin(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="0">
                        No Margin
                      </option>

                      <option value="10">
                        Small
                      </option>

                      <option value="20">
                        Medium
                      </option>

                      <option value="40">
                        Large
                      </option>
                    </select>
                  </div>

                </div>

                {/* SUMMARY */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Images
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {images.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Page Size
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {pageSize}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Orientation
                    </p>

                    <p className="mt-1 font-semibold capitalize text-gray-900">
                      {orientation}
                    </p>
                  </div>

                </div>

                {/* CREATE PDF */}
                <button
                  onClick={createPDF}
                  disabled={creating}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Creating PDF..."
                    : "📄 Create & Download PDF"}
                </button>

              </div>
            </div>
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
                Your images are processed directly
                in your browser. They are not uploaded
                to a server.
              </p>
            </div>

          </div>

        </div>

        {/* HOW TO */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            How to convert images to PDF?
          </h2>

          <ol className="mt-4 space-y-2 text-sm text-gray-600">

            <li>
              1. Upload one or multiple images.
            </li>

            <li>
              2. Arrange the images using ↑ and ↓.
            </li>

            <li>
              3. Choose A4, Letter or Original size.
            </li>

            <li>
              4. Select Portrait or Landscape.
            </li>

            <li>
              5. Choose how the image should fit.
            </li>

            <li>
              6. Click “Create & Download PDF”.
            </li>

          </ol>

        </div>

      </div>
    </main>
  );
}