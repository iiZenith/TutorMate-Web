"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  variant?: "icon" | "text" | "full";
}

export default function LogoutButton({ className = "", variant = "full" }: LogoutButtonProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  const icon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        title="Sign out"
        disabled={loading}
        className={`rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
        ) : (
          icon
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600   disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
      ) : (
        icon
      )}
      {variant === "full" && "Logout"}
    </button>
  );
}
