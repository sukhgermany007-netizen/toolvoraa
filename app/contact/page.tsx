"use client";

import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Supabase Auth
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setAuthLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMobileMenu(false);
    window.location.href = "/";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message || "Message could not be sent.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  const userEmail = user?.email ?? "";

  const userInitial =
    userEmail.length > 0 ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-purple-500/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            Tool<span className="text-purple-400">Voraa</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="/"
              className="transition hover:text-purple-400"
            >
              Home
            </a>

            <a
              href="/tools/all"
              className="transition hover:text-purple-400"
            >
              All Tools
            </a>

            <a
              href="/#pricing"
              className="transition hover:text-purple-400"
            >
              Pricing
            </a>

            <a
              href="/contact"
              className="font-medium text-purple-400"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 md:flex">
            {authLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-800" />
            ) : user ? (
              <>
                {/* User Profile */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                    {userInitial}
                  </div>

                  <span
                    className="max-w-[150px] truncate text-sm text-slate-300"
                    title={userEmail}
                  >
                    {userEmail}
                  </span>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-purple-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <a
                  href="/login"
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-purple-400"
                >
                  Login
                </a>

                {/* Explore Tools */}
                <a
                  href="/tools/all"
                  className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
                >
                  Explore Tools →
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenu((open) => !open)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xl md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenu}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <nav className="flex flex-col gap-4 border-t border-slate-800 px-6 py-5 text-sm text-slate-300 md:hidden">
            <a
              href="/"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </a>

            <a
              href="/tools/all"
              onClick={() => setMobileMenu(false)}
            >
              All Tools
            </a>

            <a
              href="/#pricing"
              onClick={() => setMobileMenu(false)}
            >
              Pricing
            </a>

            <a
              href="/contact"
              onClick={() => setMobileMenu(false)}
              className="text-purple-400"
            >
              Contact
            </a>

            <div className="mt-2 border-t border-slate-800 pt-4">
              {authLoading ? (
                <p className="text-slate-500">Loading account...</p>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                      {userInitial}
                    </div>

                    <span className="max-w-[230px] truncate text-slate-300">
                      {userEmail}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-left font-semibold transition hover:border-purple-500 hover:text-purple-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-500"
                >
                  Login with Google
                </a>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* CONTACT SECTION */}
      <section className="relative flex-1 overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] max-w-full -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
              Get in Touch
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              Contact Us
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Have a question, suggestion or feedback? We would love to hear
              from you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div
                className="mb-6 text-4xl"
                aria-hidden="true"
              >
                💬
              </div>

              <h2 className="text-2xl font-bold">
                We&apos;re here to help
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                If you have questions about ToolVoraa, a tool is not working
                correctly, or you have an idea for a new feature, please
                contact us.
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

            {/* Contact Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              {status === "success" ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <div
                    className="text-5xl"
                    aria-hidden="true"
                  >
                    ✅
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    Message Sent
                  </h2>

                  <p className="mt-3 text-slate-400">
                    Thank you for contacting ToolVoraa.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
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
                  {/* Honeypot */}
                  <div
                    className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="website">
                      Website
                    </label>

                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Name */}
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
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Email */}
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
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Message */}
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
                      minLength={10}
                      maxLength={5000}
                      rows={6}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <p
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-lg bg-purple-600 py-3 font-semibold shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending"
                      ? "Sending..."
                      : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>
            © 2026 ToolVoraa. All rights reserved.
          </p>

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