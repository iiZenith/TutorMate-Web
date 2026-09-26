"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ═══════════════════════════════════════════════════
   Admin — Subjects Management
   Firestore path: platform_metadata / subjects / { items: string[] }
   ═══════════════════════════════════════════════════ */

const COLLECTION = "platform_metadata";
const DOCUMENT = "subjects";
const FIELD = "items";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ── Fetch subjects ── */
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const snap = await getDoc(doc(db, COLLECTION, DOCUMENT));
        if (snap.exists()) {
          const data = snap.data();
          setSubjects((data[FIELD] as string[]) ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  /* ── Add subject ── */
  async function handleAdd() {
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) {
      alert("This subject already exists.");
      return;
    }
    setAdding(true);
    try {
      const ref = doc(db, COLLECTION, DOCUMENT);
      await updateDoc(ref, { [FIELD]: arrayUnion(trimmed) });
      setSubjects((prev) => [...prev, trimmed]);
      setNewSubject("");
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add subject. Make sure the Firestore document exists.");
    } finally {
      setAdding(false);
    }
  }

  /* ── Delete subject ── */
  async function handleDelete(subject: string) {
    if (!confirm(`Remove "${subject}" from subjects?`)) return;
    setDeletingId(subject);
    try {
      const ref = doc(db, COLLECTION, DOCUMENT);
      await updateDoc(ref, { [FIELD]: arrayRemove(subject) });
      setSubjects((prev) => prev.filter((s) => s !== subject));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Filtered list ── */
  const filtered = subjects.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Manage Subjects
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add or remove subjects available on TutorMate. Changes sync with the
          mobile app instantly.
        </p>
      </div>

      {/* Add form */}
      <div className="rounded-2xl border border-white bg-white p-6 shadow-sm">
        <label
          htmlFor="new-subject"
          className="block text-sm font-semibold text-slate-700"
        >
          New Subject
        </label>
        <div className="mt-2 flex gap-3">
          <input
            id="new-subject"
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Mathematics, Physics…"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newSubject.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
            Add Subject
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white bg-white shadow-sm">
        {/* Search bar */}
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {filtered.length} subject{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400">
              {subjects.length === 0
                ? "No subjects yet. Add one above!"
                : "No results match your search."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {filtered.map((subject) => (
              <li
                key={subject}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-slate-50/60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-xs font-semibold text-purple-600">
                    📚
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {subject}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(subject)}
                  disabled={deletingId === subject}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                  title={`Remove ${subject}`}
                >
                  {deletingId === subject ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
