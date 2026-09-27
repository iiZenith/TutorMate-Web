"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { getFriendlyAuthError } from "@/lib/authErrors";

/* ═══════════════════════════════════════════════════
   Tutor Sign-Up — combines the Flutter app's
   DetailedRegistrationScreen and TutorOnboardingScreen
   ═══════════════════════════════════════════════════ */

const TARGET_LEVELS = [
  "Primary",
  "Middle School",
  "Secondary (SEE)",
  "+2",
  "Bachelor",
];

const SUBJECTS = [
  "Social",
  "Nepali",
  "English",
  "Math",
  "Science",
  "Health",
];

export default function TutorSignUpPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Basic Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Other");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Professional Details
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [rate, setRate] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/tutor/dashboard");
    }
  }, [authLoading, user, router]);

  function toggleLevel(level: string) {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

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
    if (!headline.trim()) {
      setError("Professional headline is required.");
      return;
    }
    if (selectedLevels.length === 0) {
      setError("Please select at least one target level.");
      return;
    }
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Use.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Firebase Auth user + base Firestore users doc (role: 'tutor')
      const uid = await signUp(fullName.trim(), email.trim(), password, "tutor");
      
      // 2. Save the tutor profile details
      const profileData = {
        gender,
        phoneNumber: phone.trim(),
        isProfileComplete: true, // Mark profile as complete since we collected the required info
        tutorProfile: {
          headline: headline.trim(),
          bio: bio.trim(),
          targetLevels: selectedLevels,
          subjects: selectedSubjects,
          monthlyRate: rate ? parseFloat(rate) : null,
          isIdentityVerified: false,
        }
      };

      await updateDoc(doc(db, "users", uid), profileData);
      
      router.push("/tutor/dashboard");
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-surface-raised to-surface p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-500/25">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Tutor<span className="text-brand-600">Mate</span>
            </span>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-brand-100 p-2 text-brand-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-900">Become a Tutor</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Set up your profile and start teaching students
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border-default bg-surface-raised p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="mb-4 text-base font-bold text-slate-800 border-border-default border-b pb-2">Basic Details</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Sita Sharma"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Gender</label>
                  <div className="mt-2 flex gap-4">
                    {(["Male", "Female", "Other"] as const).map((g) => (
                      <label
                        key={g}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                          gender === g
                            ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                            : "border-border-default bg-surface-sunken text-slate-600 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
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
              </div>
            </div>

            {/* Section 2: Professional Details */}
            <div>
              <h3 className="mb-4 text-base font-bold text-slate-800 border-border-default border-b pb-2">Professional Details</h3>
              <div className="space-y-5">
                <div>
                  <label htmlFor="headline" className="block text-sm font-semibold text-slate-700">
                    Headline <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="headline"
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g., M.Sc. Physics Tutor with 5+ Years Exp"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-slate-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about your teaching style..."
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Target Levels <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_LEVELS.map((level) => {
                      const isSelected = selectedLevels.includes(level);
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => toggleLevel(level)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isSelected
                              ? "border-brand-400 bg-brand-600 text-white shadow-sm"
                              : "border-border-default bg-surface-sunken text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <svg className="mr-1.5 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subjects You Teach <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isSelected
                              ? "border-emerald-400 bg-emerald-600 text-white shadow-sm"
                              : "border-border-default bg-surface-sunken text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <svg className="mr-1.5 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="rate" className="block text-sm font-semibold text-slate-700">
                    Expected Monthly Rate (NPR)
                  </label>
                  <input
                    id="rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g., 10000"
                    className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <span className="font-medium text-brand-600">Terms of Use</span>{" "}
                  and{" "}
                  <span className="font-medium text-brand-600">Privacy Policy</span>
                </span>
              </label>

              {error && (
                <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Complete Profile & Start Tutoring
              </button>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="transition hover:text-brand-600">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
