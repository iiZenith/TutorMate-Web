import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "TutorMate — Find the Perfect Home Tutor in Nepal",
  description:
    "TutorMate connects students with verified home tutors across Nepal. Browse tutors by subject, location, and experience to find your ideal match.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-surface text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
