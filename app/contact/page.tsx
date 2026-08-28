"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

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

      {/* Contact Section */}
      <section className="relative overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
              Get in Touch
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              Contact Us
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Have a question, suggestion or feedback?
              We would love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Information */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-6 text-4xl">💬</div>

              <h2 className="text-2xl font-bold">
                We’re here to help
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                If you have questions about ToolVoraa, a tool
                is not working correctly, or you have an idea for
                a new feature, please contact us.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Website
                  </p>

                  <p className="mt-1 font-medium">
                    ToolVoraa
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Support
                  </p>

                  <p className="mt-1 text-purple-400">
                    We will respond as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              {submitted ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="text-5xl">✅</div>

                  <h2 className="mt-5 text-2xl font-bold">
                    Message Received
                  </h2>

                  <p className="mt-3 text-slate-400">
                    Thank you for contacting ToolVoraa.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-7 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold transition hover:border-purple-500 hover:text-purple-400"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-purple-600 py-3 font-semibold shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© 2026 ToolVoraa. All rights reserved.</p>

          <div className="flex gap-6">
            <a
              href="/privacy"
              className="transition hover:text-purple-400"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="transition hover:text-purple-400"
            >
              Terms of Service
            </a>

            <a
              href="/contact"
              className="text-purple-400"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}