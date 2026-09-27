"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

interface JobRequest {
  jobId: string;
  studentName: string;
  grade: string;
  subjects: string[];
  district: string;
  area: string;
  budgetNpr: number;
  tuitionMode: string;
  daysPerWeek: number;
  status: string;
  createdAt: Timestamp | Date;
}

export default function StudentDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [myRequests, setMyRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      const q = query(
        collection(db, "job_requests"),
        where("studentId", "==", user.uid)
      );
      
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => doc.data() as JobRequest);
      
      // Sort by newest first
      fetched.sort((a, b) => {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : (a.createdAt as Date).getTime();
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : (b.createdAt as Date).getTime();
        return timeB - timeA;
      });

      setMyRequests(fetched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && userData?.role === "studentGuardian") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMyRequests();
    } else if (!authLoading && userData && userData.role !== "studentGuardian") {
      router.replace("/");
    }
  }, [user, userData, authLoading, router, fetchMyRequests]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  const firstName = userData?.fullName?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface">
      {/* Header */}
      <header className="border-b border-border-default bg-surface-raised sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-md shadow-brand-500/25">
              T
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Student <span className="text-brand-600">Dashboard</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton variant="text" className="!p-0 hover:!bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-10">
        {/* Greeting & Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Namaste, {firstName} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
            Find a Home Tutor in Kathmandu Valley
          </p>
        </div>

        {/* Primary Action Card */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Request a Home Tutor</h2>
            <p className="text-brand-100 max-w-xl">
              Post your specific requirements and let qualified tutors reach out to you. Start learning with the best tutors today!
            </p>
          </div>
          <Link
            href="/student/request"
            className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-brand-600 transition hover:bg-brand-50 shadow-md"
          >
            Post a Request
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* My Requests Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">My Requests</h2>
          
          {loading ? (
             <div className="space-y-4">
               {[1, 2].map((i) => (
                 <div key={i} className="h-32 rounded-2xl bg-surface-raised shadow-sm border border-border-default animate-pulse"></div>
               ))}
             </div>
          ) : myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border-default border-dashed bg-surface-raised py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No requests yet</h3>
              <p className="mt-1 text-sm text-slate-500 mb-4 max-w-sm">
                You haven&apos;t requested any tutors yet.
              </p>
              <Link
                href="/student/request"
                className="text-brand-600 font-semibold hover:text-brand-700 transition"
              >
                Tap here to post your first requirement
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myRequests.map((req) => (
                <div key={req.jobId} className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-flex rounded-full bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 text-xs font-bold text-brand-700 dark:text-brand-300 mb-2">
                        {req.grade}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{req.subjects.join(", ")}</h3>
                    </div>
                    <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Open
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {req.area}, {req.district}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Rs. {req.budgetNpr.toLocaleString()} / month
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tutor Directory (Empty State) */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Tutor Directory</h2>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border-default border-dashed bg-surface-raised py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Tutor directory is currently refreshing.</h3>
              <p className="mt-1 text-sm text-slate-500 mb-4 max-w-sm">
                Check back later to see featured tutors in your area.
              </p>
            </div>
        </div>
      </main>
    </div>
  );
}
