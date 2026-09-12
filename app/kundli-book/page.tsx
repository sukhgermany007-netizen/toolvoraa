import type { Metadata } from "next";
import KundliCheckout from "./KundliCheckout";

export const metadata: Metadata = {
  title: "कुंडली पढ़ना सीखें | Beginner Hindi eBook Bundle",
  description: "अपनी जन्म कुंडली को शुरुआत से समझना सीखें। 16 अध्याय, practical workbook और quick-reference cheat sheets के साथ हिंदी digital bundle।",
  robots: { index: true, follow: true },
};

const chapters = [
  "जन्म कुंडली और ज्योतिष की बुनियाद",
  "12 भाव पहचानना और समझना",
  "12 राशियाँ और उनके स्वामी",
  "नवग्रह और उनके प्रमुख कारक",
  "लग्न और लग्नेश",
  "ग्रह किस भाव में बैठा है?",
  "उच्च, नीच, स्वराशि और ग्रह-शक्ति",
  "ग्रह दृष्टि और युति",
  "27 नक्षत्र और पाद",
  "महादशा और अंतरदशा",
  "गोचर और साढ़ेसाती की basic समझ",
  "प्रमुख योग और verification",
  "15-Step Kundli Reading Method",
  "Career, Marriage, Money, Education विषय",
  "Solved और Blind Practice Kundlis",
  "Common Mistakes + 30-Day Practice Plan",
];

const faqs = [
  ["क्या यह beginners के लिए है?", "हाँ। पुस्तक zero/basic knowledge से step-by-step शुरू होती है।"],
  ["क्या physical book मिलेगी?", "नहीं। यह digital PDF bundle है, जिसे payment verify होने के बाद download किया जा सकता है।"],
  ["Bundle में क्या मिलेगा?", "Main Hindi eBook, अलग Practice Workbook और Quick Reference/Cheat Sheets।"],
  ["क्या यह भविष्यवाणी की guarantee देती है?", "नहीं। सामग्री पारंपरिक ज्योतिष को educational purpose से सीखने के लिए है; guaranteed predictions नहीं दी जातीं।"],
];

export default function KundliBookPage() {
  return (
    <main className="min-h-screen bg-[#070b18] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_#4b172b_0,_#10152c_34%,_#070b18_70%)] px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-300">हिंदी • Beginner Friendly • Practical</div>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">अपनी जन्म कुंडली को <span className="text-amber-300">खुद समझना सीखें</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">बिल्कुल शुरुआत से 16 अध्यायों की आसान हिंदी guide — practical examples, workbook और quick-reference cheat sheets के साथ।</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-200">
              {["16 विस्तृत अध्याय", "Practice Workbook", "Quick Cheat Sheets", "Solved Examples"].map((x) => <span key={x} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">✓ {x}</span>)}
            </div>
            <a href="#buy" className="mt-8 inline-flex rounded-xl bg-amber-400 px-7 py-4 text-lg font-black text-[#16101a] hover:bg-amber-300">अभी खरीदें — ₹299</a>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-amber-300/30 bg-gradient-to-b from-[#501b30] to-[#11162b] p-6 shadow-2xl shadow-black/40">
            <div className="rounded-2xl border border-amber-300/25 bg-[#090d1c] p-7 text-center">
              <div className="text-5xl">☉</div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.28em] text-amber-300">Practical Hindi Guide</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">कुंडली पढ़ना सीखें</h2>
              <div className="mx-auto my-6 h-px w-20 bg-amber-300/50" />
              <p className="leading-7 text-slate-300">शुरुआत से अपनी जन्म कुंडली समझने की सरल और व्यावहारिक गाइड</p>
              <div className="mt-7 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-200">Main eBook + Workbook + Cheat Sheets</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-bold text-amber-300">STEP-BY-STEP LEARNING</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">इस bundle में आप क्या सीखेंगे?</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {chapters.map((chapter, i) => <div key={chapter} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-300/10 font-black text-amber-300">{i + 1}</span><p className="pt-1 font-semibold text-slate-200">{chapter}</p></div>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0d1226] px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Main eBook", "74-page expanded master edition with 16 chapters and practical reading method."],
              ["Practice Workbook", "अलग printable exercises, observation practice और Kundli practice sheets."],
              ["Quick Reference", "भाव, राशियाँ, ग्रह, दृष्टियाँ, नक्षत्र, Vimshottari और 15-step checklist."],
            ].map(([title, desc]) => <div key={title} className="rounded-3xl border border-amber-300/15 bg-[#11162b] p-7"><div className="text-3xl">✦</div><h3 className="mt-4 text-xl font-black text-amber-300">{title}</h3><p className="mt-3 leading-7 text-slate-300">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="font-bold text-amber-300">BEGINNER BUNDLE</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">सिर्फ पढ़िए नहीं — अपनी कुंडली पर अभ्यास कीजिए</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">हर concept को एक structured method में रखा गया है: ग्रह → भाव → राशि → स्वामी → दृष्टि → युति → शक्ति → नक्षत्र → दशा → गोचर। उद्देश्य है कि beginner धीरे-धीरे एक balanced interpretation बनाना सीख सके।</p>
            <div className="mt-8 space-y-3 text-slate-200">
              <p>✓ आसान हिंदी explanation</p><p>✓ Practical examples और case labs</p><p>✓ Revision tests और 30-day practice plan</p><p>✓ Rahu/Ketu जैसे disputed rules पर tradition-dependent warnings</p>
            </div>
          </div>
          <KundliCheckout />
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black">अक्सर पूछे जाने वाले सवाल</h2>
          <div className="mt-8 space-y-4">
            {faqs.map(([q, a]) => <details key={q} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><summary className="cursor-pointer font-bold text-white">{q}</summary><p className="mt-3 leading-7 text-slate-300">{a}</p></details>)}
          </div>
          <div className="mt-10 rounded-2xl border border-amber-300/15 bg-amber-300/5 p-5 text-sm leading-6 text-slate-400"><strong className="text-amber-200">Educational Disclaimer:</strong> यह सामग्री ज्योतिष के पारंपरिक सिद्धांतों को सीखने के उद्देश्य से है। ज्योतिष वैज्ञानिक रूप से प्रमाणित भविष्यवाणी पद्धति नहीं है और यह चिकित्सा, कानूनी, वित्तीय या अन्य professional advice का विकल्प नहीं है।</div>
        </div>
      </section>

      <div className="sticky bottom-0 z-40 border-t border-amber-300/20 bg-[#070b18]/95 p-3 backdrop-blur md:hidden"><a href="#buy" className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-black text-[#16101a]">अभी खरीदें — ₹299</a></div>
    </main>
  );
}
