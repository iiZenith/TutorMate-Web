"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppUserData } from "@/context/AuthContext";
import Link from "next/link";

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

export default function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<AppUserData | null>(null);
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const docRef = doc(db, "users", params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const d = docSnap.data();
          setStudent({
            id: docSnap.id,
            email: d.email || "",
            fullName: d.fullName || "",
            role: "studentGuardian",
            isProfileComplete: d.isProfileComplete || false,
            createdAt: d.createdAt?.toDate?.() || new Date(),
            phoneNumber: d.phoneNumber,
            gender: d.gender,
          } as AppUserData);
          
          // Fetch job requests for this student
          const q = query(collection(db, "job_requests"), where("studentId", "==", params.id));
          const reqSnap = await getDocs(q);
          const reqData = reqSnap.docs.map(reqDoc => reqDoc.data() as JobRequest);
          reqData.sort((a, b) => {
             const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : (a.createdAt as Date).getTime();
             const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : (b.createdAt as Date).getTime();
             return timeB - timeA;
          });
          setRequests(reqData);
        } else {
          setError("Student not found.");
        }
      } catch (err) {
        console.error("Failed to load student", err);
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading student details...</div>;
  }

  if (error || !student) {
    return (
      <div className="mx-auto max-w-3xl text-center py-16">
        <h2 className="text-xl font-bold text-red-500 mb-4">{error || "Not found"}</h2>
        <Link href="/admin/students" className="text-brand-600 hover:underline">
          &larr; Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/students" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-600 mb-4 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Directory
        </Link>
        <h2 className="text-3xl font-bold text-text-primary">{student.fullName}</h2>
        <p className="mt-1 text-sm text-text-muted">
          Student / Guardian Profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-default pb-3">Profile Info</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm text-text-secondary mt-1">{student.email}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Phone</p>
                <p className="text-sm text-text-secondary mt-1">{student.phoneNumber || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Gender</p>
                <p className="text-sm text-text-secondary mt-1">{student.gender || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Joined</p>
                <p className="text-sm text-text-secondary mt-1">{student.createdAt.toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.isProfileComplete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {student.isProfileComplete ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border-default">
              <h3 className="text-lg font-bold text-text-primary">Tutor Requests</h3>
              <p className="text-sm text-text-muted mt-1">Showing all job requests created by this student.</p>
            </div>
            
            <div className="p-6 flex-1 bg-surface-sunken/30">
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken mb-3">
                    <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted">No requests found for this student.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map(req => (
                    <div key={req.jobId} className="rounded-xl border border-border-default bg-surface p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 mb-2">
                            {req.grade}
                          </span>
                          <h4 className="font-bold text-base text-text-primary">{req.subjects.join(", ")}</h4>
                        </div>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${req.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-sunken text-text-muted'}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {req.area}, {req.district}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Rs. {req.budgetNpr.toLocaleString()} / month
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {req.daysPerWeek} days/week
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {req.tuitionMode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
