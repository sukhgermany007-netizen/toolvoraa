"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
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
      setError("Unable to start Google sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to ToolVoraa
          </h1>

          <p className="mt-2 text-slate-600">
            Sign in to access your account and AI tools.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-xl font-bold">G</span>

          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to ToolVoraa&apos;s Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}