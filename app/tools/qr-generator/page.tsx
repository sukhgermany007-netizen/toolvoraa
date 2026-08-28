"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");

  const generateQR = async () => {
    if (!text.trim()) {
      alert("Please enter some text or a URL");
      return;
    }

    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
      });

      setQrCode(url);
    } catch (error) {
      console.error(error);
      alert("Could not generate QR code");
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <div className="text-center mb-12">
          <div className="inline-block rounded-full border border-blue-500/50 bg-blue-500/10 px-5 py-2 text-blue-300">
            📱 Free QR Tool
          </div>

          <h1 className="mt-6 text-5xl font-bold">
            QR Code Generator
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Create a QR code for any text, website or link.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Input */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="text-2xl font-bold">
              Enter Your Content
            </h2>

            <p className="mt-2 text-slate-400">
              Enter a website URL or any text.
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: https://google.com"
              className="mt-6 h-40 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={generateQR}
              className="mt-5 w-full rounded-xl bg-blue-600 py-4 font-bold hover:bg-blue-500"
            >
              Generate QR Code
            </button>

          </div>

          {/* Result */}
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-8">

            {qrCode ? (
              <>
                <img
                  src={qrCode}
                  alt="Generated QR Code"
                  className="rounded-lg bg-white p-3"
                />

                <button
                  onClick={downloadQR}
                  className="mt-6 rounded-xl bg-green-600 px-8 py-3 font-bold hover:bg-green-500"
                >
                  Download QR Code
                </button>
              </>
            ) : (
              <>
                <div className="text-7xl">▦</div>

                <p className="mt-5 text-center text-slate-400">
                  Enter text or a URL and click
                  <br />
                  Generate QR Code
                </p>
              </>
            )}

          </div>

        </div>

        <div className="mt-10 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to ToolVoraa
          </a>
        </div>

      </div>
    </main>
  );
}