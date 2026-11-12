"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";

interface KineticCanvasStageProps {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string;
  school?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export function KineticCanvasStage({
  displayName = "Naufal Nizar De Bian Setyo Firwanto",
  avatarUrl,
  bio,
  school = "SMK Telkom Malang",
  githubUrl = "https://github.com/biannihgenk",
  linkedinUrl = "https://linkedin.com",
  instagramUrl = "https://instagram.com",
}: KineticCanvasStageProps) {
  const locale = useLocale();
  const isId = locale === "id";
  const t = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>("10:00:00");
  const [pingState, setPingState] = useState<{ testing: boolean; latency: number }>({
    testing: false,
    latency: 12,
  });

  const fallbackPhoto =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBNrmoVQbmOgjgzU8fW6x2aFmr_pLmzPu3Ov1C2cUo_cELkM6-3NXEfEOffgUhB9tK56jVTL2sl8uHFX7NHzZE6ZYNLqF9Hk1CYTHk2LrkN0noWPfuShl5gS_-CMJ1pc0pYD2SRPy6xizzAYdTHWkIeQXNnBmPsbyYC0dqA_ePTpb_0ZIS4120TTNt5291kHYqe0gt1BJJKTJyFO1LQTR-sZ0ym-ySndPHyjcZtxCtVS_YUCtoH8GSU";
  const displayPhoto = avatarUrl || fallbackPhoto;

  function handleTestPing() {
    if (pingState.testing) return;
    setPingState((prev) => ({ ...prev, testing: true }));
    setTimeout(() => {
      const randomized = Math.floor(Math.random() * 6) + 9;
      setPingState({ testing: false, latency: randomized });
    }, 500);
  }

  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Jakarta",
          hour12: false,
        });
        setTimeStr(formatted);
      } catch {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        setTimeStr(`${hours}:${minutes}:${seconds}`);
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-x-clip scroll-mt-24"
    >
      {/* Top Architectural Status Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#ded8cb]/80 text-[11px] font-mono text-[#6b6863]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-[#111827] uppercase tracking-wider">
              {school}
            </span>
            <span className="text-[#c5bfb0]">•</span>
            <span className="text-[#2563eb] font-semibold uppercase tracking-wider">
              {isId ? "Teknik Komputer & Jaringan (TKJ)" : "Computer & Network Engineering"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestPing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-blue-50/70 border border-[#ded8cb] hover:border-blue-300 text-[#111827] transition-colors cursor-pointer shadow-2xs"
              title={isId ? "Uji latensi gateway lab" : "Test lab gateway latency"}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  pingState.testing ? "bg-amber-500 animate-ping" : "bg-emerald-500"
                }`}
              />
              <span>
                {pingState.testing ? "Pinging..." : `RTT ${pingState.latency}ms`}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3ee] border border-[#ded8cb]">
              <span className="font-semibold text-[#111827]">{t("locationStamp")}</span>
              <span className="text-[#c5bfb0]">|</span>
              <span>{timeStr} WIB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Asymmetric Executive Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN (7 Cols): Authoritative Narrative, CTAs & Focus Strip */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6 text-left"
          >
            {/* Subtle Executive Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ded8cb] shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                {isId
                  ? "Web & Network Engineer • Moklet A'35"
                  : "Web & Network Engineer • Moklet A'35"}
              </span>
            </div>

            {/* Crisp Serif Headline (Zero Chrome Gradients / Zero Clutter) */}
            <div className="space-y-4">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] xl:text-[3.6rem] font-bold text-[#0b0c0c] tracking-tight leading-[1.09]">
                {isId ? (
                  <>
                    Merancang Infrastruktur Jaringan &amp;{" "}
                    <span className="italic font-normal text-[#2563eb]">
                      Sistem Web Modern.
                    </span>
                  </>
                ) : (
                  <>
                    Engineering Resilient Networks &amp;{" "}
                    <span className="italic font-normal text-[#2563eb]">
                      Modern Web Systems.
                    </span>
                  </>
                )}
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-2xl leading-relaxed">
                {isId ? "Saya " : "I'm "}
                <strong className="text-[#0b0c0c] font-semibold">
                  {displayName}
                </strong>{" "}
                (Bian) — {isId ? "siswa" : "a vocational student at"}{" "}
                <span className="text-[#2563eb] font-semibold">{school}</span>.{" "}
                {bio ||
                  (isId
                    ? "Berfokus pada perancangan topologi MikroTik & Cisco, administrasi server Linux Debian, serta pengembangan aplikasi web berperforma tinggi dengan Next.js dan TypeScript."
                    : "Focused on MikroTik & Cisco network engineering, Debian Linux systems administration, and high-performance web architectures built with Next.js and TypeScript.")}
              </p>
            </div>

            {/* Action CTAs + Minimalist Social Channels */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0b0c0c] hover:bg-[#2563eb] text-white font-sans font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>{t("ctaProjects")}</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#f5f2ea] text-[#111827] border border-[#ded8cb] hover:border-[#2563eb]/50 font-sans font-semibold text-sm shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <span>{isId ? "Profil Lengkap" : "Full Profile"}</span>
              </Link>

              <div className="h-6 w-[1px] bg-[#ded8cb] hidden sm:block mx-0.5" />

              {/* Clean Minimal Social Buttons */}
              <div className="flex items-center gap-2" role="group" aria-label="Social Channels">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("followGithub")}
                  title="GitHub"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#0b0c0c] border border-[#ded8cb] hover:border-[#0b0c0c] flex items-center justify-center text-[#111827] hover:text-white shadow-2xs hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("followLinkedin")}
                  title="LinkedIn"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#0a66c2] border border-[#ded8cb] hover:border-[#0a66c2] flex items-center justify-center text-[#111827] hover:text-white shadow-2xs hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("followInstagram")}
                  title="Instagram"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#e1306c] border border-[#ded8cb] hover:border-[#e1306c] flex items-center justify-center text-[#111827] hover:text-white shadow-2xs hover:-translate-y-0.5 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Clean 3-Column Core Technical Focus Strip */}
            <div className="w-full pt-6 mt-2 border-t border-[#ded8cb]/80 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                  01 / NETWORKING
                </span>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                  MikroTik, Cisco &amp; VLAN
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                  02 / WEB ARCHITECTURE
                </span>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                  Next.js 15, TypeScript &amp; SQL
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                  03 / SYSTEMS &amp; LAB
                </span>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                  Debian Linux &amp; Docker
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (5 Cols): Sleek Flippable 3D Identity Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center select-none">
              <motion.div
                drag
                dragConstraints={{ top: -24, bottom: 32, left: -40, right: 40 }}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 22 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                whileTap={{ scale: 0.98, cursor: "grabbing" }}
                className="relative z-20 cursor-grab select-none [perspective:1400px]"
              >
                <div className="p-3 sm:p-3.5 rounded-[30px] bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/[0.06] relative">
                  {/* Punch Slot */}
                  <div className="w-14 h-2.5 mx-auto mb-2.5 bg-slate-200/80 rounded-full border border-slate-300/80 flex items-center justify-center">
                    <div className="w-7 h-1 rounded-full bg-slate-500/70" />
                  </div>

                  {/* 3D Flippable Inner Card */}
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.55, type: "spring", stiffness: 220, damping: 22 }}
                    className="relative w-[270px] sm:w-[300px] min-h-[420px] sm:min-h-[450px] bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#ded8cb] [transform-style:preserve-3d]"
                  >
                    {/* FRONT SIDE */}
                    <div
                      className={`w-full h-full flex flex-col justify-between [backface-visibility:hidden] ${
                        isFlipped ? "pointer-events-none" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#ded8cb]/70">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                          <span className="font-mono text-xs font-bold text-[#111827] tracking-wider">
                            debianxyz.my.id
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[9px] text-[#6b6863] font-bold">
                          2026
                        </span>
                      </div>

                      <div className="my-2.5 relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb]">
                        <Image
                          src={displayPhoto}
                          alt="Naufal Nizar De Bian Setyo Firwanto"
                          fill
                          sizes="300px"
                          unoptimized
                          priority
                          className="object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#ded8cb] text-[9px] font-mono text-[#2563eb] font-bold flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>IDENTITY CARD</span>
                        </div>
                      </div>

                      <div className="text-left space-y-0.5">
                        <h2 className="font-serif font-bold text-lg sm:text-xl text-[#111827] leading-tight">
                          Naufal Nizar De Bian
                        </h2>
                        <p className="font-mono text-[11px] text-[#6b6863]">
                          {isId ? "Teknik Komputer & Jaringan" : "Computer & Network Engineering"}
                        </p>
                        <p className="font-mono text-[11px] text-[#2563eb] font-bold">
                          {school}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#ded8cb]/70 flex items-center justify-between gap-2 mt-2">
                        <div className="flex flex-col text-left">
                          <span className="font-mono text-[9px] text-[#6b6863] uppercase">
                            Focus Domain
                          </span>
                          <span className="font-mono text-[10px] font-bold text-[#111827]">
                            Network • Web • SysAdmin
                          </span>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="h-4 w-16 flex items-center justify-end gap-[1.5px] opacity-80">
                            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 5, 2, 1, 3].map((w, i) => (
                              <div
                                key={i}
                                className="bg-[#111827] h-full rounded-[0.5px]"
                                style={{ width: `${w}px` }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[8px] text-[#6b6863] mt-0.5">
                            TKJ-35-2026
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div
                      className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between rounded-2xl bg-white [transform:rotateY(180deg)] [backface-visibility:hidden] ${
                        !isFlipped ? "pointer-events-none" : ""
                      }`}
                    >
                      <div className="-mx-4 sm:-mx-5 -mt-4 sm:-mt-5 h-8 bg-[#0f172a] border-b border-black/20 rounded-t-xl" />

                      <div className="flex items-center justify-between pt-1">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/40 flex flex-col justify-around p-1">
                          <div className="h-[1px] bg-amber-800/40 w-full" />
                          <div className="h-[1px] bg-amber-800/40 w-full" />
                        </div>

                        <div className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[9px] font-mono text-blue-700 font-bold">
                          VERIFIED • 2026
                        </div>
                      </div>

                      <div className="space-y-2.5 text-left my-1 bg-[#fbf9f3] p-3 rounded-xl border border-[#ded8cb]">
                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            {isId ? "Nama Lengkap" : "Full Name"}
                          </span>
                          <span className="font-serif font-bold text-xs text-[#111827]">
                            {displayName}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                              {isId ? "Konsentrasi" : "Major"}
                            </span>
                            <span className="font-mono text-[10px] text-[#111827] font-semibold">
                              TKJ (Networking)
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                              {isId ? "Angkatan" : "Cohort"}
                            </span>
                            <span className="font-mono text-[10px] text-[#2563eb] font-bold">
                              Moklet A&apos;35
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            {isId ? "Institusi" : "Institution"}
                          </span>
                          <span className="font-mono text-[10px] text-[#111827] font-semibold">
                            {school}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#ded8cb] mt-auto">
                        <div className="flex-1 text-left">
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block mb-1">
                            {isId ? "Otorisasi Pemegang" : "Holder Signature"}
                          </span>
                          <div className="h-7 bg-[#f5f2ea] rounded-md border border-[#ded8cb] px-2 flex items-center justify-center">
                            <span className="font-serif italic text-xs font-bold text-[#2563eb] select-none">
                              Naufal Nizar De Bian
                            </span>
                          </div>
                        </div>

                        <div className="w-10 h-10 rounded-md bg-white border border-[#ded8cb] p-1 flex flex-col justify-between shrink-0">
                          <div className="grid grid-cols-3 gap-[1px] w-full h-full">
                            {[1, 0, 1, 1, 1, 0, 0, 1, 1].map((dot, idx) => (
                              <div
                                key={idx}
                                className={`rounded-[0.5px] ${
                                  dot ? "bg-[#111827]" : "bg-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#ded8cb] flex items-center justify-between text-[9px] font-mono text-[#6b6863]">
                        <span>PORTFOLIO CREDENTIAL</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Flip Trigger Pill & Hint */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-[#ded8cb] hover:border-blue-400 text-xs font-mono font-bold text-[#111827] hover:text-[#2563eb] shadow-xs transition-all cursor-pointer group"
                >
                  <span className="group-hover:rotate-180 transition-transform duration-500">
                    ↺
                  </span>
                  <span>
                    {isFlipped
                      ? isId
                        ? "Lihat Bagian Depan"
                        : "Show Front Side"
                      : isId
                      ? "Balik Kartu Spesifikasi"
                      : "Flip Identity Card"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
