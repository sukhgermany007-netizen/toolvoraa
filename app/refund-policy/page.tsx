import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | ToolVoraa",
  description:
    "Read ToolVoraa's refund and cancellation policy for Pro subscriptions and digital services.",
  alternates: {
    canonical: "https://www.toolvoraa.com/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-purple-400 hover:text-purple-300"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold tracking-tight">
          Refund & Cancellation Policy
        </h1>

        <p className="mt-4 text-sm text-slate-400">
          Last updated: September 13, 2026
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white">
              1. Overview
            </h2>
            <p className="mt-3">
              ToolVoraa provides online digital tools, AI-powered utilities,
              productivity tools, PDF tools, image tools, calculators and
              subscription-based Pro features. This policy explains how
              subscription cancellations and refund requests are handled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. Subscription Cancellation
            </h2>
            <p className="mt-3">
              You may cancel your ToolVoraa Pro subscription at any time.
              Cancellation stops future recurring charges. Unless otherwise
              stated, access to Pro features may continue until the end of the
              current paid billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. Refund Eligibility
            </h2>
            <p className="mt-3">
              Subscription fees are generally non-refundable once a billing
              period has started and access to paid digital services has been
              provided.
            </p>
            <p className="mt-3">
              However, we may review refund requests in cases such as duplicate
              payments, incorrect charges, technical payment errors, or where
              the paid service could not be provided due to an issue on our
              side.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Duplicate or Incorrect Charges
            </h2>
            <p className="mt-3">
              If you believe you were charged more than once or charged an
              incorrect amount, contact us with your payment details. After
              verification, eligible refunds will be processed to the original
              payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. Refund Processing Time
            </h2>
            <p className="mt-3">
              Approved refunds may take approximately 5–10 business days to
              appear in your bank account or card statement, depending on the
              payment provider, bank, card network and country.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. International Payments
            </h2>
            <p className="mt-3">
              For international payments, the final refunded amount may be
              affected by currency conversion rates, bank charges or payment
              network fees that are outside ToolVoraa&apos;s control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. How to Request a Refund or Cancellation
            </h2>
            <p className="mt-3">
              For cancellation, billing or refund-related assistance, please
              contact us through our Contact page and provide your registered
              email address along with relevant payment or subscription
              details.
            </p>

            <Link
              href="/contact"
              className="mt-4 inline-block rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-500"
            >
              Contact ToolVoraa
            </Link>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Policy Changes
            </h2>
            <p className="mt-3">
              ToolVoraa may update this Refund & Cancellation Policy from time
              to time. Any updated version will be published on this page with
              the revised effective date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}