export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Tool<span className="text-purple-400">Hub</span> AI
          </a>

          <a
            href="/"
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
          >
            Home
          </a>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            Legal
          </p>

          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-slate-400">
            Last updated: August 27, 2026
          </p>
        </div>

        <div className="space-y-8 leading-7 text-slate-300">
          {/* 1 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using ToolHub AI, you agree to be
              bound by these Terms of Service. If you do not agree
              with these terms, please do not use the website or its
              services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              2. About ToolHub AI
            </h2>

            <p>
              ToolHub AI provides online utilities including AI
              tools, calculators, business tools, PDF tools, image
              tools, SEO tools and developer utilities.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              3. Use of the Website
            </h2>

            <p>
              You agree to use ToolHub AI only for lawful purposes
              and in a manner that does not interfere with the
              operation, security or availability of the website.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              4. User Responsibilities
            </h2>

            <p>
              You are responsible for the information, files and
              content you enter, upload or process through the
              website. You should not use ToolHub AI to process
              unlawful, harmful or unauthorized content.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              5. Tool Results
            </h2>

            <p>
              Results produced by calculators, AI tools, generators
              and other utilities are provided for general
              informational and practical purposes. You should
              independently verify important results before relying
              on them for financial, business, legal or other
              important decisions.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              6. Uploaded Files
            </h2>

            <p>
              Some tools may allow you to upload documents or
              images. You are responsible for ensuring that you have
              the necessary rights and permissions to upload and
              process such files.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              7. Intellectual Property
            </h2>

            <p>
              The ToolHub AI website, branding, design, text,
              graphics and software may be protected by applicable
              intellectual property laws. You may not copy,
              reproduce or redistribute website content without
              appropriate authorization.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              8. Availability of Services
            </h2>

            <p>
              We aim to keep ToolHub AI available and functional,
              but we do not guarantee that the website or any
              particular tool will always be available, uninterrupted
              or error-free.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              9. Third-Party Services
            </h2>

            <p>
              ToolHub AI may use third-party services for hosting,
              analytics, payments, advertising or other
              functionality. Third-party services may have separate
              terms and privacy policies.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              10. Disclaimer
            </h2>

            <p>
              ToolHub AI is provided on an “as available” basis.
              While we make reasonable efforts to provide useful and
              accurate tools, we do not guarantee that all results
              will be complete, accurate or suitable for every
              purpose.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              11. Limitation of Liability
            </h2>

            <p>
              To the extent permitted by applicable law, ToolHub AI
              and its operators will not be responsible for losses
              or damages arising from the use of, or inability to
              use, the website or its tools.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              12. Changes to These Terms
            </h2>

            <p>
              We may update these Terms of Service from time to
              time. Updated terms will be published on this page
              with a revised update date.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              13. Contact
            </h2>

            <p>
              If you have questions about these Terms of Service,
              please contact us through the contact information
              provided on the ToolHub AI website.
            </p>
          </section>
        </div>

        {/* Back */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <a
            href="/"
            className="text-purple-400 transition hover:text-purple-300"
          >
            ← Back to ToolHub AI
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-600">
        © 2026 ToolHub AI. All rights reserved.
      </footer>
    </main>
  );
}