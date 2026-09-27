"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { AppUserData } from "@/context/AuthContext";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AppUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const q = query(collection(db, "users"), where("role", "==", "studentGuardian"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            email: d.email || "",
            fullName: d.fullName || "",
            role: "studentGuardian",
            isProfileComplete: d.isProfileComplete || false,
            createdAt: d.createdAt?.toDate?.() || new Date(),
            phoneNumber: d.phoneNumber,
            gender: d.gender,
          } as AppUserData;
        });
        
        data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Students Directory</h2>
          <p className="mt-1 text-sm text-text-muted">
            Manage student and guardian accounts.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading students...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-lg font-bold text-text-primary">No Students Found</h3>
            <p className="mt-2 text-sm text-text-muted">There are currently no registered students.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-sunken border-b border-border-default">
                <tr>
                  <th className="px-6 py-4 font-bold text-text-muted uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-bold text-text-muted uppercase tracking-wider text-xs">Email</th>
                  <th className="px-6 py-4 font-bold text-text-muted uppercase tracking-wider text-xs">Joined</th>
                  <th className="px-6 py-4 font-bold text-text-muted uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {students.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-surface-sunken/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">{student.fullName}</div>
                      {student.phoneNumber && (
                        <div className="text-xs text-text-muted mt-0.5">{student.phoneNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{student.email}</td>
                    <td className="px-6 py-4 text-text-secondary">
                      {student.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
