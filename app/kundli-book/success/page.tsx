"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Result = {
  paid: boolean;
  status?: string;
  customerName?: string;
  error?: string;
};

export default function KundliSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? "";
  const [checking, setChecking] = useState(true);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!orderId) {
      setResult({ paid: false, error: "Order ID missing." });
      setChecking(false);
      return;
    }

    fetch(`/api/kundli/verify-order?order_id=${encodeURIComponent(orderId)}`, {
      cache: "no-store",
    })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ data }) => setResult(data))
      .catch(() => setResult({ paid: false, error: "Payment verification failed." }))
      .finally(() => setChecking(false));
  }, [orderId]);

  return (
    <main className="min-h-screen bg-[#070b18] px-5 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#11162b] p-8 text-center shadow-2xl sm:p-12">
        {checking ? (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-300/20 border-t-amber-300" />
            <h1 className="mt-6 text-2xl font-black">Payment verify हो रही है…</h1>
            <p className="mt-2 text-slate-300">कृपया इस page को बंद न करें।</p>
          </>
        ) : result?.paid ? (
          <>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300">✓</div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[.2em] text-amber-300">Payment Successful</p>
            <h1 className="mt-2 text-3xl font-black">आपका Kundli Beginner Bundle तैयार है</h1>
            <p className="mt-3 leading-7 text-slate-300">धन्यवाद{result.customerName ? `, ${result.customerName}` : ""}। Payment server से verify हो चुकी है।</p>
            <div className="mt-7 rounded-2xl border border-amber-300/15 bg-amber-300/5 p-5 text-left text-sm leading-6 text-slate-300">
              <strong className="text-amber-200">Delivery setup:</strong> secure download endpoint में final bundle file जोड़ने के बाद यहीं Download button दिखाई देगा। अभी payment verification layer तैयार है।
            </div>
            <p className="mt-5 break-all text-xs text-slate-500">Order: {orderId}</p>
          </>
        ) : (
          <>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/15 text-3xl text-amber-300">!</div>
            <h1 className="mt-5 text-2xl font-black">Payment अभी confirm नहीं हुई</h1>
            <p className="mt-3 leading-7 text-slate-300">Status: {result?.status ?? "UNKNOWN"}. अगर payment कट गई है तो थोड़ी देर बाद page refresh करें।</p>
            {result?.error && <p className="mt-3 text-sm text-red-300">{result.error}</p>}
          </>
        )}
      </section>
    </main>
  );
}
