"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

type ImageFile = {
  file: File;
  preview: string;
};

export default function JpgToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (validFiles.length === 0) {
      alert("Please select JPG or PNG images.");
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((previous) => [...previous, ...newImages]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((previous) => {
      URL.revokeObjectURL(previous[index].preview);

      return previous.filter((_, i) => i !== index);
    });
  };

  const moveImage = (
    index: number,
    direction: "up" | "down"
  ) => {
    setImages((previous) => {
      const newImages = [...previous];

      const newIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= newImages.length
      ) {
        return previous;
      }

      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];

      return newImages;
    });
  };

  const createPdf = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const image of images) {
        const imageBytes = await image.file.arrayBuffer();

        let embeddedImage;

        if (image.file.type === "image/jpeg") {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        }

        const imageWidth = embeddedImage.width;
        const imageHeight = embeddedImage.height;

        const maxWidth = 595;
        const maxHeight = 842;

        const scale = Math.min(
          maxWidth / imageWidth,
          maxHeight / imageHeight
        );

        const width = imageWidth * scale;
        const height = imageHeight * scale;

        const page = pdfDoc.addPage([
          maxWidth,
          maxHeight,
        ]);

        page.drawImage(embeddedImage, {
          x: (maxWidth - width) / 2,
          y: (maxHeight - height) / 2,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);

      new Uint8Array(pdfBuffer).set(pdfBytes);

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "images-to-pdf.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      alert("PDF created successfully.");
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while creating the PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setImages([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <h1 className="text-4xl font-bold text-gray-900">
            JPG to PDF
          </h1>

          <p className="mt-3 text-gray-600">
            Convert JPG and PNG images into a single PDF.
          </p>

        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Upload */}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12 transition hover:border-blue-500">

            <div className="mb-4 text-5xl">
              🖼️
            </div>

            <span className="text-lg font-semibold text-gray-800">
              Choose Images
            </span>

            <span className="mt-2 text-sm text-gray-500">
              Select one or multiple JPG or PNG images
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFiles}
              className="hidden"
            />

          </label>

          {/* Images */}
          {images.length > 0 && (
            <div className="mt-8">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-900">
                  Selected Images ({images.length})
                </h2>

                <button
                  onClick={clearAll}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {images.map((image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                  >

                    {/* Preview */}
                    <div className="relative flex h-52 items-center justify-center bg-gray-100 p-3">

                      <img
                        src={image.preview}
                        alt={`Image ${index + 1}`}
                        className="max-h-full max-w-full rounded object-contain"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                        Page {index + 1}
                      </div>

                    </div>

                    {/* Controls */}
                    <div className="p-3">

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {image.file.name}
                      </p>

                      <div className="mt-3 flex gap-2">

                        <button
                          onClick={() =>
                            moveImage(index, "up")
                          }
                          disabled={index === 0}
                          className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↑
                        </button>

                        <button
                          onClick={() =>
                            moveImage(index, "down")
                          }
                          disabled={
                            index === images.length - 1
                          }
                          className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↓
                        </button>

                        <button
                          onClick={() =>
                            removeImage(index)
                          }
                          className="flex-1 rounded-lg border border-red-200 px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              {/* Create PDF */}
              <button
                onClick={createPdf}
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Creating PDF..."
                  : "Create & Download PDF"}
              </button>

            </div>
          )}

        </div>

        {/* Privacy */}
        <div className="mt-8 text-center">

          <p className="text-sm text-gray-500">
            🔒 Your images are processed directly in your browser.
          </p>

        </div>

      </div>
    </main>
  );
}