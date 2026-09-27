"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { getFriendlyAuthError } from "@/lib/authErrors";
import ThemeToggle from "@/components/ThemeToggle";


export default function RootLoginPage() {
  const { signIn, resetPassword, user, userData, loading: authLoading } = useAuth();
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");



  // Smart Role-Based Routing
  useEffect(() => {
    if (!authLoading && user && userData) {
      if (userData.role === "admin") {
        router.replace("/admin");
      } else if (userData.role === "studentGuardian") {
        router.replace("/student/dashboard");
      } else if (userData.role === "tutor") {
        router.replace("/tutor/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [authLoading, user, userData, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);
    try {
      await signIn(email, password);
      // Let the useEffect handle the routing once userData populates
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err));
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setResetMessage("");
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  // To prevent flickering before routing when already logged in
  if (authLoading || (user && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-default border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-surface-raised to-surface p-4">
      {/* Absolute Header for Theme Toggle and Landing Link */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Link
          href="/welcome"
          className="text-sm font-medium text-text-muted hover:text-brand-600 transition"
        >
          About TutorMate
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-bold text-white shadow-xl shadow-brand-500/30">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to continue
          </p>
        </div>

        {/* Floating Card */}
        <div className="rounded-3xl border border-border-default bg-surface-raised p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text-secondary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-text-secondary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-sm font-medium text-brand-600 hover:text-brand-500 disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50/20 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {resetMessage && (
              <div className="rounded-xl bg-emerald-50/20 px-4 py-3 text-sm text-emerald-600">
                {resetMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-default border-t-transparent" />
              )}
              Log In
            </button>
          </form>

          {/* Links for new users */}
          <div className="mt-8 pt-6 border-t border-border-default">
            <p className="text-center text-sm text-text-muted mb-4">
              Don&apos;t have an account?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup/student"
                className="flex flex-1 items-center justify-center rounded-xl border border-border-default bg-surface-sunken px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-sunken"
              >
                Create Student Account
              </Link>
              <Link
                href="/signup/tutor"
                className="flex flex-1 items-center justify-center rounded-xl border border-brand-200 bg-brand-50/20 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100/40"
              >
                Apply as Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
