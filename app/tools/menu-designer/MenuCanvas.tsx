"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Canvas,
  IText,
  FabricImage,
} from "fabric";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/*
  IMPORTANT:

  Physical print size and screen size are different things.

  Example:
  450 mm does NOT need to become 1276 screen pixels.

  We keep the real print size separately,
  but use a comfortable display scale inside the editor.
*/

const SCREEN_PX_PER_MM = 2.5;

function mmToScreenPx(mm: number) {
  return Math.round(mm * SCREEN_PX_PER_MM);
}

function ptToMm(pt: number) {
  return (pt * 25.4) / 72;
}

type MenuCanvasProps = {
  onDocumentSizeDetected?: (
    widthMM: number,
    heightMM: number
  ) => void;
};

export type MenuCanvasHandle = {
  addHeading: () => void;
  addSubheading: () => void;
  addBodyText: () => void;

  deleteSelected: () => void;

  setFontSize: (size: number) => void;
  setTextColor: (color: string) => void;
  setOpacity: (opacity: number) => void;

  moveForward: () => void;
  moveBackward: () => void;

  uploadPDF: (file: File) => Promise<void>;

  setDocumentSizeMM: (
    widthMM: number,
    heightMM: number
  ) => void;
};

const MenuCanvas = forwardRef<
  MenuCanvasHandle,
  MenuCanvasProps
>(function MenuCanvas(
  { onDocumentSizeDetected },
  ref
) {
  const htmlCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const fabricCanvasRef =
    useRef<Canvas | null>(null);

  const pdfBackgroundRef =
    useRef<FabricImage | null>(null);

  const documentWidthMMRef =
    useRef(210);

  const documentHeightMMRef =
    useRef(297);

  /*
    Create initial A4 canvas
  */

  useEffect(() => {
    if (!htmlCanvasRef.current) return;

    const width =
      mmToScreenPx(210);

    const height =
      mmToScreenPx(297);

    const canvas =
      new Canvas(
        htmlCanvasRef.current,
        {
          width,
          height,
          backgroundColor: "#ffffff",
          selection: true,
          preserveObjectStacking: true,
        }
      );

    fabricCanvasRef.current =
      canvas;

    const title =
      new IText(
        "Your Menu",
        {
          left:
            width / 2 - 95,

          top: 100,

          fontSize: 42,

          fontWeight:
            "bold",

          fill:
            "#111827",

          editable: true,
        }
      );

    canvas.add(title);

    canvas.setActiveObject(
      title
    );

    canvas.requestRenderAll();

    return () => {
      canvas.dispose();

      fabricCanvasRef.current =
        null;

      pdfBackgroundRef.current =
        null;
    };
  }, []);

  const getCanvas = () =>
    fabricCanvasRef.current;

  /*
    FIT PDF EXACTLY TO CANVAS
  */

  const fitPDFBackground =
    () => {
      const canvas =
        getCanvas();

      const image =
        pdfBackgroundRef.current;

      if (
        !canvas ||
        !image
      ) {
        return;
      }

      const canvasWidth =
        canvas.getWidth();

      const canvasHeight =
        canvas.getHeight();

      const imageWidth =
        image.width || 1;

      const imageHeight =
        image.height || 1;

      /*
        X and Y scaling are calculated separately.

        This guarantees that the PDF fills
        the complete document canvas.
      */

      const scaleX =
        canvasWidth /
        imageWidth;

      const scaleY =
        canvasHeight /
        imageHeight;

      image.set({
        left: 0,
        top: 0,

        originX: "left",
        originY: "top",

        scaleX,
        scaleY,

        selectable: false,
        evented: false,

        hasControls: false,
        hasBorders: false,

        lockMovementX: true,
        lockMovementY: true,

        hoverCursor:
          "default",
      });

      image.setCoords();

      canvas.sendObjectToBack(
        image
      );

      canvas.requestRenderAll();
    };

  /*
    DOCUMENT / PRINT SIZE
  */

  const setDocumentSizeMM = (
    widthMM: number,
    heightMM: number
  ) => {
    const canvas =
      getCanvas();

    if (!canvas) return;

    if (
      widthMM <= 0 ||
      heightMM <= 0
    ) {
      return;
    }

    documentWidthMMRef.current =
      widthMM;

    documentHeightMMRef.current =
      heightMM;

    const widthPX =
      mmToScreenPx(widthMM);

    const heightPX =
      mmToScreenPx(heightMM);

    canvas.setDimensions({
      width: widthPX,
      height: heightPX,
    });

    /*
      If a PDF is already loaded,
      stretch it again to the new document size.
    */

    fitPDFBackground();

    canvas.requestRenderAll();
  };

  /*
    TEXT FUNCTIONS
  */

  const addTextObject = (
    text: string,
    fontSize: number,
    fontWeight:
      | "normal"
      | "bold"
  ) => {
    const canvas =
      getCanvas();

    if (!canvas) return;

    const textObject =
      new IText(
        text,
        {
          left: 60,
          top: 60,

          fontSize,

          fontWeight,

          fill:
            "#111827",

          editable: true,
        }
      );

    canvas.add(
      textObject
    );

    canvas.setActiveObject(
      textObject
    );

    canvas.requestRenderAll();
  };

  /*
    PDF UPLOAD
  */

  const uploadPDF =
    async (
      file: File
    ) => {
      const canvas =
        getCanvas();

      if (!canvas) return;

      try {
        const arrayBuffer =
          await file.arrayBuffer();

        const loadingTask =
          pdfjsLib.getDocument({
            data:
              arrayBuffer,
          });

        const pdf =
          await loadingTask.promise;

        const page =
          await pdf.getPage(
            1
          );

        /*
          Detect actual PDF page size.
        */

        const originalViewport =
          page.getViewport({
            scale: 1,
          });

        const widthMM =
          ptToMm(
            originalViewport.width
          );

        const heightMM =
          ptToMm(
            originalViewport.height
          );

        const detectedWidthMM =
          Math.round(
            widthMM * 10
          ) / 10;

        const detectedHeightMM =
          Math.round(
            heightMM * 10
          ) / 10;

        documentWidthMMRef.current =
          detectedWidthMM;

        documentHeightMMRef.current =
          detectedHeightMM;

        /*
          Update parent UI.
        */

        onDocumentSizeDetected?.(
          detectedWidthMM,
          detectedHeightMM
        );

        /*
          Resize editor canvas
          while preserving real print dimensions.
        */

        const screenWidth =
          mmToScreenPx(
            detectedWidthMM
          );

        const screenHeight =
          mmToScreenPx(
            detectedHeightMM
          );

        canvas.setDimensions({
          width:
            screenWidth,

          height:
            screenHeight,
        });

        /*
          Render PDF at higher resolution
          than screen display.

          This keeps text/images sharper.
        */

        const qualityMultiplier =
          2;

        const renderScale =
          (
            screenWidth *
            qualityMultiplier
          ) /
          originalViewport.width;

        const viewport =
          page.getViewport({
            scale:
              renderScale,
          });

        const tempCanvas =
          document.createElement(
            "canvas"
          );

        const context =
          tempCanvas.getContext(
            "2d"
          );

        if (!context) {
          throw new Error(
            "Canvas context unavailable"
          );
        }

        tempCanvas.width =
          Math.round(
            viewport.width
          );

        tempCanvas.height =
          Math.round(
            viewport.height
          );

        await page.render({
          canvas:
            tempCanvas,

          canvasContext:
            context,

          viewport,
        }).promise;

        const dataURL =
          tempCanvas.toDataURL(
            "image/png",
            1
          );

        const pdfImage =
          await FabricImage.fromURL(
            dataURL
          );

        /*
          Remove previous PDF.
        */

        if (
          pdfBackgroundRef.current
        ) {
          canvas.remove(
            pdfBackgroundRef.current
          );
        }

        pdfBackgroundRef.current =
          pdfImage;

        canvas.add(
          pdfImage
        );

        /*
          Fit PDF exactly
          edge-to-edge.
        */

        fitPDFBackground();

        /*
          Remove initial demo title.
        */

        canvas
          .getObjects()
          .forEach(
            (
              object: any
            ) => {
              if (
                object.type ===
                  "i-text" &&
                object.text ===
                  "Your Menu"
              ) {
                canvas.remove(
                  object
                );
              }
            }
          );

        canvas.discardActiveObject();

        canvas.requestRenderAll();

      } catch (
        error
      ) {
        console.error(
          "PDF upload error:",
          error
        );

        alert(
          "PDF load ਨਹੀਂ ਹੋ ਸਕੀ। Browser console check ਕਰੋ."
        );
      }
    };

  /*
    EXPOSE FUNCTIONS TO page.tsx
  */

  useImperativeHandle(
    ref,
    () => ({
      addHeading() {
        addTextObject(
          "Add Heading",
          40,
          "bold"
        );
      },

      addSubheading() {
        addTextObject(
          "Add Subheading",
          28,
          "bold"
        );
      },

      addBodyText() {
        addTextObject(
          "Add body text here",
          18,
          "normal"
        );
      },

      async uploadPDF(
        file: File
      ) {
        await uploadPDF(
          file
        );
      },

      setDocumentSizeMM(
        widthMM: number,
        heightMM: number
      ) {
        setDocumentSizeMM(
          widthMM,
          heightMM
        );
      },

      deleteSelected() {
        const canvas =
          getCanvas();

        if (!canvas) return;

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        if (
          object ===
          pdfBackgroundRef.current
        ) {
          return;
        }

        canvas.remove(
          object
        );

        canvas.discardActiveObject();

        canvas.requestRenderAll();
      },

      setFontSize(
        size: number
      ) {
        const canvas =
          getCanvas();

        if (
          !canvas ||
          size <= 0
        ) {
          return;
        }

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        if (
          object.type ===
            "i-text" ||
          object.type ===
            "textbox" ||
          object.type ===
            "text"
        ) {
          object.set({
            fontSize:
              size,
          });

          object.setCoords();

          canvas.requestRenderAll();
        }
      },

      setTextColor(
        color: string
      ) {
        const canvas =
          getCanvas();

        if (!canvas)
          return;

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        if (
          object.type ===
            "i-text" ||
          object.type ===
            "textbox" ||
          object.type ===
            "text"
        ) {
          object.set({
            fill:
              color,
          });

          canvas.requestRenderAll();
        }
      },

      setOpacity(
        opacity: number
      ) {
        const canvas =
          getCanvas();

        if (!canvas)
          return;

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        object.set({
          opacity:
            Math.max(
              0,
              Math.min(
                1,
                opacity
              )
            ),
        });

        canvas.requestRenderAll();
      },

      moveForward() {
        const canvas =
          getCanvas();

        if (!canvas)
          return;

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        canvas.bringObjectForward(
          object
        );

        canvas.requestRenderAll();
      },

      moveBackward() {
        const canvas =
          getCanvas();

        if (!canvas)
          return;

        const object =
          canvas.getActiveObject();

        if (!object)
          return;

        canvas.sendObjectBackwards(
          object
        );

        /*
          PDF must always remain
          behind editable elements.
        */

        if (
          pdfBackgroundRef.current
        ) {
          canvas.sendObjectToBack(
            pdfBackgroundRef.current
          );
        }

        canvas.requestRenderAll();
      },
    })
  );

  return (
    <div className="flex items-center justify-center">
      <div className="overflow-hidden bg-white shadow-2xl">
        <canvas
          ref={
            htmlCanvasRef
          }
        />
      </div>
    </div>
  );
});

export default MenuCanvas;