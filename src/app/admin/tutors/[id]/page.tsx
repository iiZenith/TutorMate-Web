"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppUserData } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminTutorDetailPage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<AppUserData & { tutorProfile?: { headline?: string, bio?: string, targetLevels?: string[], subjects?: string[], monthlyRate?: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTutorData() {
      try {
        const docRef = doc(db, "users", params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const d = docSnap.data();
          setTutor({
            id: docSnap.id,
            email: d.email || "",
            fullName: d.fullName || "",
            role: "tutor",
            isProfileComplete: d.isProfileComplete || false,
            createdAt: d.createdAt?.toDate?.() || new Date(),
            phoneNumber: d.phoneNumber,
            gender: d.gender,
            tutorProfile: d.tutorProfile || {},
          } as AppUserData & { tutorProfile?: { headline?: string, bio?: string, targetLevels?: string[], subjects?: string[], monthlyRate?: number } });
        } else {
          setError("Tutor not found.");
        }
      } catch (err) {
        console.error("Failed to load tutor", err);
        setError("Failed to load tutor data.");
      } finally {
        setLoading(false);
      }
    }
    fetchTutorData();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading tutor details...</div>;
  }

  if (error || !tutor) {
    return (
      <div className="mx-auto max-w-3xl text-center py-16">
        <h2 className="text-xl font-bold text-red-500 mb-4">{error || "Not found"}</h2>
        <Link href="/admin/tutors" className="text-brand-600 hover:underline">
          &larr; Back to Tutors
        </Link>
      </div>
    );
  }

  const tp = tutor.tutorProfile || {};

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/tutors" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-600 mb-4 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Directory
        </Link>
        <h2 className="text-3xl font-bold text-text-primary">{tutor.fullName}</h2>
        <p className="mt-1 text-sm text-text-muted">
          {tp.headline || "Tutor Profile"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border-default bg-surface-raised p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-default pb-3">Basic Info</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm text-text-secondary mt-1">{tutor.email}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Phone</p>
                <p className="text-sm text-text-secondary mt-1">{tutor.phoneNumber || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Gender</p>
                <p className="text-sm text-text-secondary mt-1">{tutor.gender || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Joined</p>
                <p className="text-sm text-text-secondary mt-1">{tutor.createdAt.toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${tutor.isProfileComplete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {tutor.isProfileComplete ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border-default">
              <h3 className="text-lg font-bold text-text-primary">Professional Details</h3>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
              
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Bio</h4>
                <div className="text-sm text-text-secondary bg-surface-sunken p-4 rounded-xl border border-border-default whitespace-pre-wrap">
                  {tp.bio || "No bio provided."}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Target Levels</h4>
                  {tp.targetLevels && tp.targetLevels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tp.targetLevels.map((level: string) => (
                        <span key={level} className="inline-flex rounded-full border border-border-default bg-surface-sunken px-3 py-1 text-xs font-medium text-text-secondary">
                          {level}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">None specified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Subjects</h4>
                  {tp.subjects && tp.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tp.subjects.map((subject: string) => (
                        <span key={subject} className="inline-flex rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium border border-emerald-100">
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">None specified</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Expected Monthly Rate</h4>
                <div className="text-xl font-bold text-brand-600">
                  {tp.monthlyRate ? `Rs. ${tp.monthlyRate.toLocaleString("en-NP")}` : "Not specified"}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
