/* ═══════════════════════════════════════════════════
   Firebase Auth Error → Friendly Message
   Mirrors the mobile app's _throwMappedException()
   in firebase_auth_repository_impl.dart
   ═══════════════════════════════════════════════════ */

const AUTH_ERROR_MAP: Record<string, string> = {
  "auth/user-not-found":
    "No account found with this email address. Please check your email or create a new account.",
  "auth/wrong-password":
    "Incorrect password. Please try again or reset your password.",
  "auth/invalid-credential":
    "Invalid email or password. Please check your credentials and try again.",
  "auth/email-already-in-use":
    "An account with this email already exists. Try logging in instead.",
  "auth/weak-password":
    "The password is too weak. Please use at least 6 characters.",
  "auth/invalid-email":
    "The email address is not valid. Please enter a valid email.",
  "auth/too-many-requests":
    "Too many failed attempts. Please wait a moment and try again.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection and try again.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support for assistance.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled. Please contact support.",
  "auth/requires-recent-login":
    "This action requires recent authentication. Please log in again.",
  "auth/missing-password": "Please enter your password.",
  "auth/missing-email": "Please enter your email address.",
};

/**
 * Converts a Firebase auth error into a human-readable message.
 * Falls back to a cleaned version of the original message.
 */
export function getFriendlyAuthError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    if (AUTH_ERROR_MAP[code]) {
      return AUTH_ERROR_MAP[code];
    }
  }

  if (error instanceof Error) {
    // Strip Firebase prefix from messages like "Firebase: Error (auth/xyz)."
    const cleaned = error.message
      .replace(/^Firebase:\s*/, "")
      .replace(/\s*\(auth\/[\w-]+\)\.\s*$/, "")
      .trim();
    return cleaned || "An unexpected error occurred. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}
