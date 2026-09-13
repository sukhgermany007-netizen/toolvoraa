"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  Circle,
  FabricImage,
  IText,
  Line,
  Rect,
} from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type Tool =
  | "Templates"
  | "Text"
  | "Images"
  | "Menu Items"
  | "Shapes"
  | "QR Code"
  | "Background"
  | "Print Size"
  | "Uploads";

type PrintPreset = "A4" | "A3" | "A5" | "Square" | "Tri-Fold" | "Custom";

type ProjectPage = {
  id: string;
  name: string;
  widthMM: number;
  heightMM: number;
  json: any | null;
  backgroundPdfDataUrl?: string;
};

const SCREEN_PX_PER_MM = 2.35;
const mmToScreenPx = (mm: number) => Math.max(1, Math.round(mm * SCREEN_PX_PER_MM));
const ptToMm = (pt: number) => (pt * 25.4) / 72;
const mmToPt = (mm: number) => (mm * 72) / 25.4;

const leftTools: Tool[] = [
  "Templates",
  "Text",
  "Images",
  "Menu Items",
  "Shapes",
  "QR Code",
  "Background",
  "Print Size",
  "Uploads",
];

const uid = () => Math.random().toString(36).slice(2, 10);

export default function MenuDesigner() {
  const [activeTool, setActiveTool] = useState<Tool>("Templates");
  const [preset, setPreset] = useState<PrintPreset>("A4");
  const [documentWidth, setDocumentWidth] = useState(210);
  const [documentHeight, setDocumentHeight] = useState(297);
  const [bleed, setBleed] = useState(3);
  const [safeMargin, setSafeMargin] = useState(8);
  const [lockRatio, setLockRatio] = useState(true);
  const [zoom, setZoom] = useState(75);
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState("#111827");
  const [opacity, setOpacity] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [pages, setPages] = useState<ProjectPage[]>([
    { id: uid(), name: "Page 1", widthMM: 210, heightMM: 297, json: null },
  ]);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [history, setHistory] = useState<any[]>([]);

  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const suppressHistoryRef = useRef(false);

  const activePage = useMemo(
    () => pages.find((p) => p.id === activePageId) ?? pages[0],
    [pages, activePageId]
  );

  useEffect(() => {
    if (!htmlCanvasRef.current) return;
    const canvas = new Canvas(htmlCanvasRef.current, {
      width: mmToScreenPx(210),
      height: mmToScreenPx(297),
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });
    fabricRef.current = canvas;

    const title = new IText("Your Menu", {
      left: 110,
      top: 90,
      fontSize: 42,
      fontWeight: "bold",
      fill: "#111827",
    });
    canvas.add(title);
    canvas.setActiveObject(title);
    canvas.renderAll();
    pushHistory();

    const push = () => pushHistory();
    canvas.on("object:added", push);
    canvas.on("object:modified", push);
    canvas.on("object:removed", push);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !activePage) return;
    suppressHistoryRef.current = true;
    canvas.setDimensions({
      width: mmToScreenPx(activePage.widthMM),
      height: mmToScreenPx(activePage.heightMM),
    });
    canvas.set({ backgroundColor });
    if (activePage.json) {
      canvas.loadFromJSON(activePage.json).then(() => {
        canvas.requestRenderAll();
        suppressHistoryRef.current = false;
      });
    } else {
      canvas.clear();
      canvas.set({ backgroundColor });
      canvas.requestRenderAll();
      suppressHistoryRef.current = false;
    }
    setDocumentWidth(activePage.widthMM);
    setDocumentHeight(activePage.heightMM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

const serializeCanvas = () => fabricRef.current?.toJSON();

  const saveActivePage = () => {
    const json = serializeCanvas();
    if (!json) return;
    setPages((old) => old.map((p) => (p.id === activePageId ? { ...p, json } : p)));
  };

  const pushHistory = () => {
    if (suppressHistoryRef.current) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
   const snap = canvas.toJSON();
    setHistory((old) => {
      const trimmed = old.slice(0, historyIndex + 1);
      const next = [...trimmed, snap].slice(-50);
      setHistoryIndex(next.length - 1);
      return next;
    });
    saveActivePage();
  };

  const restoreHistory = async (index: number) => {
    const canvas = fabricRef.current;
    const snap = history[index];
    if (!canvas || !snap) return;
    suppressHistoryRef.current = true;
    await canvas.loadFromJSON(snap);
    canvas.requestRenderAll();
    setHistoryIndex(index);
    suppressHistoryRef.current = false;
  };

  const addText = (text: string, size: number, weight: "normal" | "bold" = "normal") => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = new IText(text, {
      left: 60,
      top: 60,
      fontSize: size,
      fontWeight: weight,
      fill: textColor,
      opacity: opacity / 100,
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const addShape = (shape: "rect" | "circle" | "line") => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    let obj: any;
    if (shape === "rect") obj = new Rect({ left: 80, top: 80, width: 180, height: 100, fill: "#e5e7eb", stroke: "#111827" });
    if (shape === "circle") obj = new Circle({ left: 90, top: 90, radius: 55, fill: "#fde68a", stroke: "#111827" });
    if (shape === "line") obj = new Line([80, 120, 280, 120], { stroke: "#111827", strokeWidth: 3 });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const applyDocumentSize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    setDocumentWidth(w);
    setDocumentHeight(h);
    canvas.setDimensions({ width: mmToScreenPx(w), height: mmToScreenPx(h) });
    setPages((old) => old.map((p) => (p.id === activePageId ? { ...p, widthMM: w, heightMM: h } : p)));
    canvas.requestRenderAll();
    saveActivePage();
  };

  const handlePreset = (p: PrintPreset) => {
    setPreset(p);
    if (p === "A4") applyDocumentSize(210, 297);
    if (p === "A3") applyDocumentSize(297, 420);
    if (p === "A5") applyDocumentSize(148, 210);
    if (p === "Square") applyDocumentSize(210, 210);
    if (p === "Tri-Fold") applyDocumentSize(297, 210);
  };

  const handlePDFUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;
    const canvas = fabricRef.current;
    if (!canvas) return;

    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const newPages: ProjectPage[] = [];

    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const vp = page.getViewport({ scale: 1 });
      const widthMM = Math.round(ptToMm(vp.width) * 10) / 10;
      const heightMM = Math.round(ptToMm(vp.height) * 10) / 10;
      const renderScale = (mmToScreenPx(widthMM) * 2) / vp.width;
      const renderVp = page.getViewport({ scale: renderScale });
      const temp = document.createElement("canvas");
      temp.width = Math.round(renderVp.width);
      temp.height = Math.round(renderVp.height);
      const ctx = temp.getContext("2d");
      if (!ctx) continue;
      await page.render({ canvas: temp, canvasContext: ctx, viewport: renderVp }).promise;
      const dataUrl = temp.toDataURL("image/png", 1);
      const img = await FabricImage.fromURL(dataUrl);
      img.set({
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
        customType: "pdf-background",
        scaleX: mmToScreenPx(widthMM) / (img.width || 1),
        scaleY: mmToScreenPx(heightMM) / (img.height || 1),
      });
      const pageCanvas = new Canvas(document.createElement("canvas"), {
        width: mmToScreenPx(widthMM),
        height: mmToScreenPx(heightMM),
        backgroundColor: "#ffffff",
      });
      pageCanvas.add(img);
      pageCanvas.sendObjectToBack(img);
      const json = pageCanvas.toJSON();
      pageCanvas.dispose();
      newPages.push({ id: uid(), name: `Page ${n}`, widthMM, heightMM, json, backgroundPdfDataUrl: dataUrl });
    }

    if (newPages.length) {
      setPages(newPages);
      setActivePageId(newPages[0].id);
      setDocumentWidth(newPages[0].widthMM);
      setDocumentHeight(newPages[0].heightMM);
      setPreset("Custom");
    }
    event.target.value = "";
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    const url = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(url);
    const max = 260;
    const scale = Math.min(max / (img.width || max), max / (img.height || max), 1);
    img.set({ left: 80, top: 80, scaleX: scale, scaleY: scale });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    URL.revokeObjectURL(url);
    event.target.value = "";
  };

  const selectedObject = () => fabricRef.current?.getActiveObject();

  const setSelectedProp = (patch: Record<string, any>) => {
    const canvas = fabricRef.current;
    const obj = selectedObject();
    if (!canvas || !obj) return;
    obj.set(patch);
    obj.setCoords();
    canvas.requestRenderAll();
    pushHistory();
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    const obj = selectedObject();
    if (!canvas || !obj || (obj as any).customType === "pdf-background") return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const addPage = () => {
    saveActivePage();
    const page: ProjectPage = {
      id: uid(),
      name: `Page ${pages.length + 1}`,
      widthMM: documentWidth,
      heightMM: documentHeight,
      json: null,
    };
    setPages((p) => [...p, page]);
    setActivePageId(page.id);
  };

  const deletePage = () => {
    if (pages.length <= 1) return;
    const idx = pages.findIndex((p) => p.id === activePageId);
    const next = pages.filter((p) => p.id !== activePageId);
    setPages(next);
    setActivePageId(next[Math.max(0, idx - 1)].id);
  };

  const newProject = () => {
    const page: ProjectPage = { id: uid(), name: "Page 1", widthMM: 210, heightMM: 297, json: null };
    setPages([page]);
    setActivePageId(page.id);
    setPreset("A4");
    setDocumentWidth(210);
    setDocumentHeight(297);
  };

  const exportPDF = async () => {
    saveActivePage();
    const pdf = await PDFDocument.create();

    for (const p of pages) {
      const tempEl = document.createElement("canvas");
      const c = new Canvas(tempEl, {
        width: mmToScreenPx(p.widthMM),
        height: mmToScreenPx(p.heightMM),
        backgroundColor: backgroundColor,
      });
      if (p.id === activePageId) {
        const live = serializeCanvas();
        if (live) await c.loadFromJSON(live);
      } else if (p.json) {
        await c.loadFromJSON(p.json);
      }
      c.requestRenderAll();
      const pngData = c.toDataURL({ format: "png", multiplier: 2 });
      const pngBytes = await fetch(pngData).then((r) => r.arrayBuffer());
      const png = await pdf.embedPng(pngBytes);
      const page = pdf.addPage([mmToPt(p.widthMM), mmToPt(p.heightMM)]);
      page.drawImage(png, { x: 0, y: 0, width: mmToPt(p.widthMM), height: mmToPt(p.heightMM) });
      c.dispose();
    }

    const bytes = await pdf.save();
    const pdfBytes = new Uint8Array(bytes);
const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toolvoraa-menu.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (kind: "pizza" | "restaurant" | "cafe") => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    suppressHistoryRef.current = true;
    canvas.clear();
    canvas.backgroundColor = kind === "pizza" ? "#fff7ed" : kind === "restaurant" ? "#f8fafc" : "#fefce8";
    const heading = new IText(kind === "pizza" ? "PIZZA MENU" : kind === "restaurant" ? "RESTAURANT MENU" : "CAFE MENU", {
      left: 55,
      top: 45,
      fontSize: 38,
      fontWeight: "bold",
      fill: "#111827",
    });
    canvas.add(heading);
    const items = [
      ["Margherita", "€9.50"],
      ["Pepperoni", "€11.50"],
      ["Vegetarian", "€10.90"],
      ["Special", "€13.90"],
    ];
    items.forEach((it, i) => {
      canvas.add(new IText(it[0], { left: 60, top: 140 + i * 60, fontSize: 22, fill: "#111827" }));
      canvas.add(new IText(it[1], { left: 330, top: 140 + i * 60, fontSize: 22, fontWeight: "bold", fill: "#111827" }));
    });
    canvas.requestRenderAll();
    suppressHistoryRef.current = false;
    pushHistory();
  };

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" onChange={handlePDFUpload} className="hidden" />
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#11182b] px-5">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">ToolVoraa Menu Designer</div>
            <div className="hidden items-center gap-2 md:flex">
              <button onClick={newProject} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5">New</button>
              <button onClick={() => pdfInputRef.current?.click()} className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm text-violet-200">Upload PDF</button>
              <button disabled={historyIndex <= 0} onClick={() => restoreHistory(historyIndex - 1)} className="rounded-lg border border-white/10 px-3 py-2 text-sm disabled:opacity-40">Undo</button>
              <button disabled={historyIndex >= history.length - 1} onClick={() => restoreHistory(historyIndex + 1)} className="rounded-lg border border-white/10 px-3 py-2 text-sm disabled:opacity-40">Redo</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={preset} onChange={(e) => handlePreset(e.target.value as PrintPreset)} className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm">
              <option value="A4">A4</option><option value="A3">A3</option><option value="A5">A5</option><option value="Square">Square</option><option value="Tri-Fold">Tri-Fold</option><option value="Custom">Custom</option>
            </select>
            <button onClick={exportPDF} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">Export PDF</button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-24 border-r border-white/10 bg-[#0f172a] md:w-52">
            <div className="p-3">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tools</div>
              <div className="space-y-2">
                {leftTools.map((tool) => (
                  <button key={tool} onClick={() => setActiveTool(tool)} className={`w-full rounded-xl px-3 py-3 text-left text-sm ${activeTool === tool ? "bg-violet-600" : "text-slate-300 hover:bg-white/5"}`}>{tool}</button>
                ))}
              </div>
            </div>
          </aside>

          <section className="hidden w-72 border-r border-white/10 bg-[#11182b] lg:block">
            <div className="border-b border-white/10 p-4"><h2 className="font-semibold">{activeTool}</h2><p className="mt-1 text-xs text-slate-400">Professional menu tools</p></div>
            <div className="space-y-3 p-4 text-sm">
              {activeTool === "Templates" && <>
                <button onClick={() => loadTemplate("pizza")} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left">Pizza Menu Template</button>
                <button onClick={() => loadTemplate("restaurant")} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left">Restaurant Template</button>
                <button onClick={() => loadTemplate("cafe")} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left">Cafe Template</button>
              </>}
              {activeTool === "Text" && <>
                <button onClick={() => addText("Add Heading", 40, "bold")} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Heading</button>
                <button onClick={() => addText("Add Subheading", 28, "bold")} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Subheading</button>
                <button onClick={() => addText("Add body text here", 18)} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Body Text</button>
              </>}
              {activeTool === "Images" && <button onClick={() => imageInputRef.current?.click()} className="w-full rounded-lg bg-violet-600 p-3 font-semibold">Upload Image / Logo</button>}
              {activeTool === "Menu Items" && <>
                <button onClick={() => addText("Dish Name", 24, "bold")} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Dish Name</button>
                <button onClick={() => addText("Description", 16)} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Description</button>
                <button onClick={() => addText("€0.00", 22, "bold")} className="w-full rounded-lg bg-white/5 p-3 text-left">Add Price</button>
              </>}
              {activeTool === "Shapes" && <>
                <button onClick={() => addShape("rect")} className="w-full rounded-lg bg-white/5 p-3 text-left">Rectangle</button>
                <button onClick={() => addShape("circle")} className="w-full rounded-lg bg-white/5 p-3 text-left">Circle</button>
                <button onClick={() => addShape("line")} className="w-full rounded-lg bg-white/5 p-3 text-left">Line</button>
              </>}
              {activeTool === "Background" && <div className="space-y-3"><label className="text-xs text-slate-400">Background Color</label><input type="color" value={backgroundColor} onChange={(e) => { setBackgroundColor(e.target.value); const c=fabricRef.current; if(c){c.backgroundColor=e.target.value;c.requestRenderAll();}}} className="h-12 w-full" /></div>}
              {activeTool === "Print Size" && <div className="space-y-4">
                <div><label className="mb-1 block text-xs text-slate-400">Width (mm)</label><input type="number" step="0.1" value={documentWidth} onChange={(e) => { const v=Number(e.target.value); if(lockRatio){ const r=documentHeight/documentWidth; applyDocumentSize(v, Math.round(v*r*10)/10);} else applyDocumentSize(v,documentHeight); setPreset("Custom");}} className="w-full rounded-lg border border-white/10 bg-[#0f172a] p-2" /></div>
                <div><label className="mb-1 block text-xs text-slate-400">Height (mm)</label><input type="number" step="0.1" value={documentHeight} onChange={(e) => { const v=Number(e.target.value); if(lockRatio){ const r=documentWidth/documentHeight; applyDocumentSize(Math.round(v*r*10)/10,v);} else applyDocumentSize(documentWidth,v); setPreset("Custom");}} className="w-full rounded-lg border border-white/10 bg-[#0f172a] p-2" /></div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={lockRatio} onChange={(e)=>setLockRatio(e.target.checked)} /> Lock aspect ratio</label>
                <div><label className="mb-1 block text-xs text-slate-400">Bleed (mm)</label><input type="number" value={bleed} onChange={(e)=>setBleed(Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-[#0f172a] p-2" /></div>
                <div><label className="mb-1 block text-xs text-slate-400">Safe margin (mm)</label><input type="number" value={safeMargin} onChange={(e)=>setSafeMargin(Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-[#0f172a] p-2" /></div>
                <div className="rounded-lg bg-violet-500/10 p-3 text-violet-200">{documentWidth} × {documentHeight} mm</div>
              </div>}
              {activeTool === "QR Code" && <div className="rounded-lg border border-dashed border-white/10 p-4 text-slate-400">QR generator can be added in Version 1.1 without changing the editor architecture.</div>}
              {activeTool === "Uploads" && <button onClick={() => imageInputRef.current?.click()} className="w-full rounded-lg bg-white/5 p-3 text-left">Upload Asset</button>}
            </div>
          </section>

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0b1020]">
            <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 text-sm text-slate-400">
              <span>{activePage?.name} • {documentWidth} × {documentHeight} mm • Bleed {bleed} mm</span>
              <div className="flex items-center gap-2"><button onClick={()=>setZoom(Math.max(25,zoom-10))} className="rounded border border-white/10 px-2">−</button><span>{zoom}%</span><button onClick={()=>setZoom(Math.min(200,zoom+10))} className="rounded border border-white/10 px-2">+</button></div>
            </div>
            <div className="flex flex-1 items-start justify-center overflow-auto p-8">
              <div style={{ transform: `scale(${zoom/100})`, transformOrigin: "top center" }} className="relative">
                <div className="pointer-events-none absolute z-10 border border-dashed border-red-400/60" style={{ left: mmToScreenPx(bleed), top: mmToScreenPx(bleed), right: mmToScreenPx(bleed), bottom: mmToScreenPx(bleed) }} />
                <div className="pointer-events-none absolute z-10 border border-dashed border-emerald-400/60" style={{ left: mmToScreenPx(safeMargin), top: mmToScreenPx(safeMargin), right: mmToScreenPx(safeMargin), bottom: mmToScreenPx(safeMargin) }} />
                <div className="overflow-hidden bg-white shadow-2xl"><canvas ref={htmlCanvasRef} /></div>
              </div>
            </div>
            <div className="flex h-20 items-center gap-3 overflow-x-auto border-t border-white/10 bg-[#11182b] px-4">
              {pages.map((p, i) => <button key={p.id} onClick={() => { saveActivePage(); setActivePageId(p.id); }} className={`flex h-14 min-w-12 items-center justify-center rounded border ${activePageId===p.id?"border-violet-500 bg-white text-black":"border-white/20 text-slate-300"}`}>{i+1}</button>)}
              <button onClick={addPage} className="flex h-14 min-w-12 items-center justify-center rounded border border-dashed border-white/20">+</button>
              <button onClick={deletePage} className="ml-auto rounded border border-red-500/30 px-3 py-2 text-xs text-red-300">Delete Page</button>
            </div>
          </section>

          <aside className="hidden w-72 border-l border-white/10 bg-[#0f172a] xl:block">
            <div className="border-b border-white/10 p-4"><h2 className="font-semibold">Properties</h2><p className="mt-1 text-xs text-slate-400">Selected element settings</p></div>
            <div className="space-y-5 p-4">
              <div><label className="mb-2 block text-xs text-slate-400">Font Size</label><input type="number" value={fontSize} onChange={(e)=>{const v=Number(e.target.value);setFontSize(v);setSelectedProp({fontSize:v});}} className="w-full rounded-lg border border-white/10 bg-[#11182b] p-2" /></div>
              <div><label className="mb-2 block text-xs text-slate-400">Text / Fill Color</label><input type="color" value={textColor} onChange={(e)=>{setTextColor(e.target.value);setSelectedProp({fill:e.target.value});}} className="h-10 w-full" /></div>
              <div><label className="mb-2 block text-xs text-slate-400">Opacity</label><input type="range" min="0" max="100" value={opacity} onChange={(e)=>{const v=Number(e.target.value);setOpacity(v);setSelectedProp({opacity:v/100});}} className="w-full" /><div className="mt-1 text-xs text-slate-500">{opacity}%</div></div>
              <div className="grid grid-cols-2 gap-2"><button onClick={()=>{const c=fabricRef.current,o=selectedObject();if(c&&o){c.bringObjectForward(o);c.requestRenderAll();}}} className="rounded-lg border border-white/10 p-2 text-sm">Forward</button><button onClick={()=>{const c=fabricRef.current,o=selectedObject();if(c&&o){c.sendObjectBackwards(o);c.requestRenderAll();}}} className="rounded-lg border border-white/10 p-2 text-sm">Backward</button></div>
              <button onClick={deleteSelected} className="w-full rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">Delete Element</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
