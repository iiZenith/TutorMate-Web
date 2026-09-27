"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";

type Tab = "personal" | "education" | "pricing";

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

export default function TutorProfilePage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Personal Info State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  
  // Professional / Education State
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Pricing State
  const [monthlyRate, setMonthlyRate] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setFullName(data.fullName || "");
        setPhoneNumber(data.phoneNumber || "");
        setGender(data.gender || "Other");

        const tp = data.tutorProfile || {};
        setHeadline(tp.headline || "");
        setBio(tp.bio || "");
        setSelectedLevels(tp.targetLevels || []);
        setSelectedSubjects(tp.subjects || []);
        setMonthlyRate(tp.monthlyRate ? tp.monthlyRate.toString() : "");
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && userData?.role === "tutor") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfileData();
    } else if (!authLoading && userData && userData.role !== "tutor") {
      router.replace("/");
    }
  }, [user, userData, authLoading, router, fetchProfileData]);

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

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        gender,
        tutorProfile: {
          headline: headline.trim(),
          bio: bio.trim(),
          targetLevels: selectedLevels,
          subjects: selectedSubjects,
          monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
          // Maintain existing fields if any, in a real app we'd merge or use dot notation
          // but since we read everything, it's fine.
        }
      });
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
      // Auto-hide success message
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border-default bg-surface-raised sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/tutor/dashboard" className="text-text-muted hover:text-brand-600 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              My Profile
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton variant="text" className="!p-0 hover:!bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        
        {/* Profile Header Card */}
        <div className="mb-8 rounded-2xl bg-surface-raised p-6 shadow-sm border border-border-default flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30">
            {fullName ? fullName[0].toUpperCase() : "T"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{fullName}</h1>
            <p className="text-text-muted">{headline || "Tutor"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-1 rounded-xl bg-surface-sunken p-1 border border-border-default">
          <button
            onClick={() => setActiveTab("personal")}
            className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all ${ activeTab === "personal" ? "bg-surface-raised text-brand-700 shadow" : "text-text-secondary hover:bg-surface-sunken " }`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all ${ activeTab === "education" ? "bg-surface-raised text-brand-700 shadow" : "text-text-secondary hover:bg-surface-sunken " }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all ${ activeTab === "pricing" ? "bg-surface-raised text-brand-700 shadow" : "text-text-secondary hover:bg-surface-sunken " }`}
          >
            Pricing
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${ message.type === "success" ? "bg-emerald-50/20 text-emerald-600 " : "bg-red-50/20 text-red-600 " }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="rounded-2xl bg-surface-raised p-6 shadow-sm border border-border-default">
          
          {activeTab === "personal" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-bold text-text-primary border-b border-border-default pb-2">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-text-secondary">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100/40"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100/40"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary">Gender</label>
                <div className="mt-2 flex gap-4">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <label
                      key={g}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${ gender === g ? "border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
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
          )}

          {activeTab === "education" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-bold text-text-primary border-b border-border-default pb-2">Professional & Education</h2>
              
              <div>
                <label className="block text-sm font-semibold text-text-secondary">Headline</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. M.Sc Physics with 5+ years experience"
                  className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100/40"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary">Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about your teaching methodology..."
                  className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">Target Levels</label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_LEVELS.map((level) => {
                    const isSelected = selectedLevels.includes(level);
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => toggleLevel(level)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${ isSelected ? "border-brand-400 bg-brand-600 text-white shadow-sm" : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${ isSelected ? "border-emerald-400 bg-emerald-600 text-white shadow-sm" : "border-border-default bg-surface-sunken text-text-secondary hover:border-text-muted" }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-bold text-text-primary border-b border-border-default pb-2">Pricing</h2>
              
              <div>
                <label className="block text-sm font-semibold text-text-secondary">Expected Monthly Rate (NPR)</label>
                <input
                  type="number"
                  value={monthlyRate}
                  onChange={(e) => setMonthlyRate(e.target.value)}
                  placeholder="e.g. 15000"
                  className="mt-1.5 w-full rounded-xl border border-border-default bg-surface-sunken px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100/40"
                />
                <p className="mt-2 text-sm text-text-muted">
                  This helps match you with students who have a similar budget.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border-default flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-default border-t-transparent" />}
              Save Changes
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
