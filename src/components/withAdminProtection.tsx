"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

/**
 * Higher-order component that protects a route.
 * - Unauthenticated users → redirected to "/login"
 * - Authenticated but not admin → redirected to "/" with console warning
 * - Shows a centered spinner while checking auth + admin status
 */
export default function withAdminProtection<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  function ProtectedRoute(props: P) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
      // Don't do anything until loading is definitively false
      if (loading) return;

      if (!user) {
        // Unauthenticated → send to login
        setHasRedirected(true);
        router.replace("/");
        return;
      }

      if (!isAdmin) {
        // Authenticated but not an admin → send to homepage
        console.warn("Access Denied: Not an Admin");
        setHasRedirected(true);
        router.replace("/");
        return;
      }
    }, [user, loading, isAdmin, router]);

    // Show spinner while auth state is resolving
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-text-muted">Verifying access…</p>
          </div>
        </div>
      );
    }

    // While the redirect is in progress, keep showing the spinner
    if (!user || !isAdmin) {
      if (!hasRedirected) {
        // Safety: shouldn't normally reach here, but guard anyway
        return (
          <div className="flex min-h-screen items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="text-sm text-text-muted">Redirecting…</p>
            </div>
          </div>
        );
      }
      // Already redirected, show spinner until navigation completes
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-text-muted">Redirecting…</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  }

  ProtectedRoute.displayName = `withAdminProtection(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
}
