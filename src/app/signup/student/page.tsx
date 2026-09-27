"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   Student Sign-Up — mirrors the Flutter app's
   DetailedRegistrationScreen (role = Student)
   ═══════════════════════════════════════════════════ */

export default function StudentSignUpPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Other");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Use.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(fullName.trim(), email.trim(), password, "studentGuardian");
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-500/25">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              Tutor<span className="text-brand-600">Mate</span>
            </span>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-brand-100 p-2 text-brand-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </span>
            <h1 className="text-lg font-bold text-text-primary">Create Account</h1>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Register as a Student / Guardian
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border-default bg-surface-raised p-8 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-text-secondary">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ram Bahadur Thapa"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Phone (optional, same as Flutter) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-text-secondary">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-secondary">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Gender — radio group matching Flutter */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary">Gender</label>
              <div className="mt-2 flex gap-4">
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${ gender === g ? "border-brand-400 bg-brand-50 text-brand-700" : "border-border-default bg-surface text-text-secondary hover:border-border-default" }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="sr-only"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-secondary">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-secondary">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-border-default bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border-default text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-text-secondary">
                I agree to the{" "}
                <span className="font-medium text-brand-600">Terms of Use</span>{" "}
                and{" "}
                <span className="font-medium text-brand-600">Privacy Policy</span>
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-default border-t-white" />
              )}
              Sign Up
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-semibold text-brand-600 transition hover:text-brand-700"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          <Link href="/" className="transition hover:text-brand-600">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
