"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
      }) => Promise<unknown>;
    };
  }
}

export default function KundliCheckout() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.Cashfree) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () =>
      setError("Payment system load नहीं हुआ। कृपया page refresh करें।");
    document.head.appendChild(script);
  }, []);

  async function startPayment() {
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("कृपया नाम, ईमेल और मोबाइल नंबर भरें।");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/kundli/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data?.paymentSessionId) {
        throw new Error(data?.error || "Payment शुरू नहीं हो सकी।");
      }
      if (!window.Cashfree) throw new Error("Cashfree checkout तैयार नहीं है।");

      const cashfree = window.Cashfree({ mode: data.mode });
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment शुरू नहीं हो सकी।");
      setLoading(false);
    }
  }

  return (
    <div id="buy" className="rounded-3xl border border-amber-300/20 bg-[#11162b] p-6 shadow-2xl sm:p-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-300">Introductory Offer</p>
        <h3 className="mt-2 text-2xl font-black text-white">Complete Beginner Bundle</h3>
        <div className="mt-3 text-5xl font-black text-amber-300">₹299</div>
        <p className="mt-2 text-sm text-slate-300">One-time payment • Digital PDF bundle</p>
      </div>

      <div className="mt-6 space-y-3">
        <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-300" placeholder="आपका नाम" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-300" placeholder="ईमेल" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input inputMode="tel" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-300" placeholder="मोबाइल नंबर" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>

      {error && <p className="mt-3 rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-200">{error}</p>}

      <button onClick={startPayment} disabled={!ready || loading} className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-4 text-lg font-black text-[#16101a] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Payment खोल रहे हैं…" : ready ? "अभी खरीदें — ₹299" : "Payment तैयार हो रहा है…"}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-slate-400">Secure Cashfree checkout • यह physical book नहीं है।</p>
    </div>
  );
}
