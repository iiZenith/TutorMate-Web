"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ═══════════════════════════════════════════════════
   Landing Page  –  TutorMate Nepal
   ═══════════════════════════════════════════════════ */

export default function HomePage() {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 border-b border-border-default/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-lg font-bold shadow-md shadow-brand-500/25">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Tutor<span className="text-brand-600">Mate</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              Features
            </a>
            <a
              href="#download"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              Download
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {user && isAdmin && (
              <Link
                href="/admin"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Admin Panel
              </Link>
            )}
            <a
              href="#download"
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50 hover:brightness-110"
            >
              Get the App
            </a>
          </div>
        </nav>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-surface pt-20 pb-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Now available across Nepal
          </div>

          <h1
            className="animate-fade-in-up mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Find the Perfect{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Home Tutor
            </span>{" "}
            in Nepal
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with verified, experienced tutors in your area. Whether
            it&apos;s Math, Science, or Languages — TutorMate helps you learn
            from the best, right at home.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.35s" }}
          >
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition hover:shadow-brand-500/50 hover:brightness-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Mobile App
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
            >
              Learn More
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 mx-auto max-w-3xl"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              { value: "500+", label: "Verified Tutors" },
              { value: "15k+", label: "Students Matched" },
              { value: "50+", label: "Subjects" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/60 bg-white/60 px-4 py-5 shadow-sm backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-brand-600">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Simple Process
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              How TutorMate Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Getting started is easy. Follow these three simple steps to find
              your ideal tutor today.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                title: "Search & Browse",
                desc: "Search by subject, location, or price. Filter through hundreds of verified tutors near you.",
              },
              {
                step: "02",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: "Connect & Chat",
                desc: "View tutor profiles, read reviews, and message them directly through the app.",
              },
              {
                step: "03",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
                title: "Start Learning",
                desc: "Schedule sessions, track progress, and achieve your academic goals with expert guidance.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-lg hover:shadow-brand-100/40"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 transition-colors group-hover:text-brand-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Everything You Need
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🛡️",
                title: "Verified Tutors",
                desc: "Every tutor is background-checked and verified for quality assurance.",
              },
              {
                icon: "📍",
                title: "Location-Based",
                desc: "Find tutors in your neighborhood. We cover cities and towns across Nepal.",
              },
              {
                icon: "💰",
                title: "Affordable Rates",
                desc: "Compare prices and choose a tutor that fits your budget perfectly.",
              },
              {
                icon: "⭐",
                title: "Ratings & Reviews",
                desc: "Read honest reviews from other students before making your choice.",
              },
              {
                icon: "📱",
                title: "Mobile First",
                desc: "Our Flutter app works beautifully on both Android and iOS devices.",
              },
              {
                icon: "🔔",
                title: "Real-Time Alerts",
                desc: "Get instant notifications when tutors respond or new matches are found.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white bg-white p-7 shadow-sm transition-all hover:border-brand-100 hover:shadow-md"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Download CTA ─── */}
      <section id="download" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-12 shadow-2xl shadow-brand-700/25 sm:p-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your Tutor?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Download the TutorMate app today and connect with verified tutors
              in your area. Available on Android and iOS.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 2.235a.533.533 0 0 0-.146.003c-.108.017-.222.06-.36.128l-9.7 5.618L4.003 4.858c-.524-.502-1.067-.536-1.46-.146l-.002.002c-.385.385-.35.917.148 1.44l2.84 2.73-2.84 2.73c-.498.523-.533 1.055-.148 1.44l.002.002c.393.39.936.356 1.46-.146l3.314-3.126 9.7 5.618c.138.068.252.11.36.128a.533.533 0 0 0 .146.003c.333-.037.634-.318.634-.88V3.115c0-.562-.3-.843-.634-.88z" />
                </svg>
                Google Play
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-7 py-4 font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                T
              </div>
              <span className="text-lg font-bold text-slate-900">
                Tutor<span className="text-brand-600">Mate</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} TutorMate Nepal. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-slate-400 transition hover:text-brand-600"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-slate-400 transition hover:text-brand-600"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-slate-400 transition hover:text-brand-600"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
