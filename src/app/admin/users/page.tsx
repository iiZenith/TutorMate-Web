"use client";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 ">Users</h2>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all registered students and tutors.
        </p>
      </div>

      <div className="rounded-2xl border border-white  bg-white  p-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <h3 className="mt-6 text-lg font-bold text-slate-900 ">
          Users Management
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          This section will display user data from Firestore. Connect your
          Firebase project to see registered users here.
        </p>
      </div>
    </div>
  );
}
