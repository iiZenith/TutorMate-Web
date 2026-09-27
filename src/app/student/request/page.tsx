"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import LocationSelector, { LocationSelection } from "@/components/LocationSelector";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

/* ═══════════════════════════════════════════════════
   Student — Hire a Tutor (Job Request Form)
   Mirrors the Flutter app's HireTutorScreen exactly.

   Firestore collection: job_requests
   Field names match JobRequestModel.toMap():
     jobId, studentId, studentName, grade, subjects,
     district, area, budgetNpr, status, createdAt
   ═══════════════════════════════════════════════════ */

const GRADES = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
];

const SUBJECTS = [
  "Social",
  "Nepali",
  "English",
  "Math",
  "Science",
  "Health",
];

const TUITION_MODES = ["Home Tuition", "Tutor's Place", "Online"];

export default function HireTutorPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  /* ── Form state ── */
  const [grade, setGrade] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationSelection>({
    province: "",
    district: "",
    area: "",
  });
  const [tuitionMode, setTuitionMode] = useState("Home Tuition");
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [salary, setSalary] = useState(5000);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    /* ── Validation ── */
    if (!grade) {
      setError("Please select a grade.");
      return;
    }
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }
    if (!location.district) {
      setError("Please select at least a district.");
      return;
    }

    if (!user || !userData) {
      setError("You must be logged in to post a request.");
      return;
    }

    setSubmitting(true);
    try {
      const docRef = doc(collection(db, "job_requests"));

      await setDoc(docRef, {
        jobId: docRef.id,
        studentId: user.uid,
        studentName: userData.fullName,
        grade,
        subjects: selectedSubjects,
        district: location.district,
        area: location.area,
        budgetNpr: salary,
        tuitionMode,
        daysPerWeek,
        status: "open",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to post request.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-surface-raised to-surface p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 /30">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Request Posted!</h2>
          <p className="mt-2 text-sm text-text-muted">
            Your tutor request has been posted successfully. Qualified tutors in your area will be able to see and respond to it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/student/dashboard"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setGrade("");
                setSelectedSubjects([]);
                setLocation({ province: "", district: "", area: "" });
                setTuitionMode("Home Tuition");
                setDaysPerWeek(5);
                setSalary(5000);
              }}
              className="rounded-xl border border-border-default bg-surface-raised px-6 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface"
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Loading / auth guard ── */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-surface-raised to-surface">
      {/* Top bar */}
      <header className="border-b border-border-default bg-surface-raised backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/student/dashboard" className="inline-flex items-center gap-2">
            <svg className="h-6 w-6 text-text-muted hover:text-brand-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-text-primary hidden sm:block">
              Back to Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton variant="text" className="!p-0 hover:!bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Heading */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-text-primary">Hire a Tutor</h1>
          <p className="mt-1 text-sm text-text-muted">
            Fill in the details below to find the perfect tutor match.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ─── 1. Grade ─── */}
          <section className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary">
              1. Student Grade / Class <span className="text-red-400">*</span>
            </h3>
            <p className="mt-1 text-xs text-text-muted">Grades 1 through 10 only</p>
            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${ grade === g ? "border-brand-400 bg-brand-50 /20 text-brand-700 " : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
                >
                  {g.replace("Grade ", "")}
                </button>
              ))}
            </div>
          </section>

          {/* ─── 2. Subjects ─── */}
          <section className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary">
              2. Subjects Required <span className="text-red-400">*</span>
            </h3>
            <p className="mt-1 text-xs text-text-muted">Select one or more subjects</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUBJECTS.map((s) => {
                const isSelected = selectedSubjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${ isSelected ? "border-brand-400 bg-brand-600 text-white shadow-sm" : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
                  >
                    {isSelected && (
                      <svg className="mr-1.5 inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─── 3. Location ─── */}
          <section className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary">
              3. Your Location <span className="text-red-400">*</span>
            </h3>
            <p className="mt-1 mb-4 text-xs text-text-muted">Select province, then district, then local area</p>
            <LocationSelector
              value={location}
              onChange={setLocation}
            />
          </section>

          {/* ─── 4. Tuition Preferences ─── */}
          <section className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              4. Tuition Preferences
            </h3>

            {/* Mode */}
            <label className="mb-2 block text-xs font-semibold text-text-muted uppercase tracking-wide">
              Mode
            </label>
            <div className="flex gap-2">
              {TUITION_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTuitionMode(mode)}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${ tuitionMode === mode ? "border-brand-400 bg-brand-50 /20 text-brand-700 " : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Days per week */}
            <label className="mt-6 mb-2 block text-xs font-semibold text-text-muted uppercase tracking-wide">
              Days per Week
            </label>
            <select
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-border-default bg-surface-sunken px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 /40"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? "s" : ""} / week
                </option>
              ))}
            </select>
          </section>

          {/* ─── 5. Budget ─── */}
          <section className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary">
              5. Monthly Budget
            </h3>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Rs. 2,000</span>
                <span className="text-lg font-bold text-brand-700">
                  Rs. {salary.toLocaleString("en-NP")}
                </span>
                <span className="text-xs text-text-muted">Rs. 25,000</span>
              </div>
              <input
                type="range"
                min={2000}
                max={25000}
                step={500}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>
          </section>

          {/* ─── Error ─── */}
          {error && (
            <div className="rounded-xl bg-red-50 /20 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ─── Submit ─── */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-default border-t-white" />
            )}
            Post Request
          </button>
        </form>
      </main>
    </div>
  );
}
