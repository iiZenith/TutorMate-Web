import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* ── Validate environment variables ─────────────────────── */
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value || value.startsWith("your_"))
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(
    `⚠️ Firebase config: The following environment variables are missing or still set to placeholder values: ${missingVars.join(", ")}. ` +
      `Firebase may not work correctly. Please check your .env.local file.`
  );
}

/* ── Firebase config ────────────────────────────────────── */
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey ?? "",
  authDomain: requiredEnvVars.authDomain ?? "",
  projectId: requiredEnvVars.projectId ?? "",
  storageBucket: requiredEnvVars.storageBucket ?? "",
  messagingSenderId: requiredEnvVars.messagingSenderId ?? "",
  appId: requiredEnvVars.appId ?? "",
};

// Prevent re-initialization in dev (HMR)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
