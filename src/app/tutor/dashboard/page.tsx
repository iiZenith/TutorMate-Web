"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import LocationSelector, { LocationSelection } from "@/components/LocationSelector";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

/* ═══════════════════════════════════════════════════
   Tutor Dashboard / Job Board
   Mirrors the Flutter app's JobBoardScreen
   ═══════════════════════════════════════════════════ */

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

const SUBJECTS = [
  "Social",
  "Nepali",
  "English",
  "Math",
  "Science",
  "Health",
];

export default function TutorDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [locationFilter, setLocationFilter] = useState<LocationSelection>({
    province: "",
    district: "",
    area: "",
  });
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  useEffect(() => {
    // Auth Guard
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && userData?.role === "tutor") {
      fetchJobs();
    } else if (!authLoading && userData && userData.role !== "tutor" && userData.role !== "admin") {
      // Basic role protection (admin can view too)
      router.replace("/");
    }
  }, [user, userData, authLoading, router]);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "job_requests"),
        where("status", "==", "open"),
        // Firestore requires composite index for orderBy with equality where, 
        // so we'll fetch all open and sort in memory for simplicity unless we have the index.
      );
      
      const snapshot = await getDocs(q);
      const fetchedJobs = snapshot.docs.map(doc => doc.data() as JobRequest);
      
      // Sort by newest first
      fetchedJobs.sort((a, b) => {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : (a.createdAt as Date).getTime();
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : (b.createdAt as Date).getTime();
        return timeB - timeA;
      });

      setJobs(fetchedJobs);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  // Apply frontend filters
  const filteredJobs = jobs.filter((job) => {
    let match = true;
    if (locationFilter.district && job.district !== locationFilter.district) {
      match = false;
    }
    if (locationFilter.area && job.area !== locationFilter.area) {
      match = false;
    }
    if (subjectFilter && !job.subjects.includes(subjectFilter)) {
      match = false;
    }
    return match;
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 ">
      {/* Header */}
      <header className="border-b border-border-default bg-surface-raised sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-md shadow-brand-500/25">
              T
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Job <span className="text-brand-600">Board</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              {userData?.fullName}
            </span>
            <Link href="/tutor/profile" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition">
              My Profile
            </Link>
            <ThemeToggle />
            <LogoutButton variant="text" className="!p-0 hover:!bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filters Sidebar */}
          <div className="w-full shrink-0 md:w-64 space-y-6">
            <div className="rounded-2xl border border-slate-200  bg-white  p-5 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 className="font-bold text-slate-800 ">Filters</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200  bg-slate-50  px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                  >
                    <option value="">All Subjects</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <LocationSelector
                    value={locationFilter}
                    onChange={setLocationFilter}
                  />
                </div>

                {(locationFilter.district || subjectFilter) && (
                  <button
                    onClick={() => {
                      setLocationFilter({ province: "", district: "", area: "" });
                      setSubjectFilter("");
                    }}
                    className="w-full rounded-xl border border-slate-200  bg-white  py-2 text-sm font-semibold text-slate-600  transition hover:bg-slate-50 "
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 ">Available Tuitions</h1>
              <button 
                onClick={fetchJobs}
                className="rounded-xl bg-white  border border-slate-200  p-2 text-slate-500 transition hover:bg-slate-50  hover:text-brand-600 shadow-sm"
                title="Refresh Jobs"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-2xl bg-white  shadow-sm border border-slate-100  animate-pulse"></div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200  border-dashed bg-white  py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 ">
                  <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 ">No tuitions found</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm">
                  Try adjusting your filters or check back later for new tutoring opportunities in your area.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.jobId} 
                    className="group rounded-2xl border border-slate-200  bg-white  p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left side content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                            {job.grade}
                          </span>
                          <span className="inline-flex rounded-full bg-slate-100  px-2 py-0.5 text-xs font-medium text-slate-600 ">
                            {job.tuitionMode}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900  mt-2 line-clamp-1">
                          {job.subjects.join(", ")}
                        </h3>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.area}, {job.district}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.daysPerWeek} days/week
                          </div>
                        </div>
                      </div>

                      {/* Right side content (Budget & Action) */}
                      <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:gap-4 border-t border-slate-100  sm:border-0 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Budget</p>
                          <p className="text-xl font-black text-emerald-600">
                            Rs. {job.budgetNpr.toLocaleString("en-NP")}
                          </p>
                          <p className="text-xs text-slate-400">/ month</p>
                        </div>
                        <button className="rounded-xl bg-brand-50 px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
