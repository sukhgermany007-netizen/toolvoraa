"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignUp() {
    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch {
      setError("Unable to start Google sign up. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <a
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight"
            >
              Tool<span className="text-purple-400">Voraa</span>
            </a>

            <h1 className="mt-7 text-3xl font-bold">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Join ToolVoraa to access AI tools and manage your account.
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 font-semibold text-white transition hover:border-purple-500 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold text-slate-900">
              G
            </span>

            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Secure Sign Up
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-sm text-slate-400">
            <p>✓ Access ToolVoraa AI tools</p>
            <p>✓ Manage your account securely</p>
            <p>✓ Free account to get started</p>
          </div>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-purple-400 transition hover:text-purple-300"
            >
              Login
            </a>
          </p>

          {/* Legal */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            By creating an account, you agree to our{" "}
            <a
              href="/terms"
              className="transition hover:text-purple-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="transition hover:text-purple-400"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          © 2026 ToolVoraa
        </p>
      </div>
    </main>
  );
}