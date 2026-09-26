"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* ────────────────────────────────── types ── */
export type UserRole = "admin" | "studentGuardian" | "tutor" | "institute";

export interface AppUserData {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: AppUserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  /** Re-fetches user data from Firestore (after profile updates, etc.) */
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ────────────────────────────────── provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchUserData(uid: string): Promise<AppUserData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) return null;
      const data = userDoc.data();
      return {
        id: uid,
        email: data.email ?? "",
        fullName: data.fullName ?? "",
        role: (data.role as UserRole) ?? "studentGuardian",
        isProfileComplete: data.isProfileComplete ?? false,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      };
    } catch (err) {
      console.error("Failed to fetch user data from Firestore:", err);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const appUser = await fetchUserData(firebaseUser.uid);
        setUserData(appUser);
        setIsAdmin(appUser?.role === "admin");
      } else {
        setUserData(null);
        setIsAdmin(false);
      }

      // Only set loading to false AFTER the Firestore role check is complete
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Register a new user and create the Firestore document.
   * Field names match the Flutter app exactly:
   *   id, email, fullName, role, isProfileComplete, createdAt
   */
  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = credential.user.uid;

    await setDoc(doc(db, "users", uid), {
      id: uid,
      email,
      fullName,
      role,
      isProfileComplete: false,
      createdAt: serverTimestamp(),
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const refreshUserData = async () => {
    if (user) {
      const appUser = await fetchUserData(user.uid);
      setUserData(appUser);
      setIsAdmin(appUser?.role === "admin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ────────────────────────────────── hook ── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
