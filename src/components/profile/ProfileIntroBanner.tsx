"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "@/lib/i18n/navigation";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

interface ProfileIntroBannerProps {
  fullName?: string;
  nickname?: string;
  school?: string;
  studyProgram?: string;
  location?: string;
  avatarUrl?: string | null;
}

type PortraitMode = "official" | "lab" | "digital";

export function ProfileIntroBanner({
  fullName = "Naufal Nizar De Bian Setyo Firwanto",
  nickname = "Bian",
  school = "SMK Telkom Malang",
  studyProgram = "Teknik Komputer dan Jaringan (TKJ)",
  location = "Malang & Sidoarjo, Jawa Timur",
  avatarUrl,
}: ProfileIntroBannerProps) {
  const t = useTranslations("profilePage");
  const locale = useLocale();
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();
  const [portraitMode, setPortraitMode] = useState<PortraitMode>("official");

  // Guard against stray surrounding quotes in CMS/i18n strings
  const cleanQuote = t("deskNoteQuote").replace(/^[“”"']+|[“”"']+$/g, "");

  // Cleanly split fullName for dual-tone editorial heading
  const nameWords = fullName.trim().split(/\s+/).filter(Boolean);
  const splitCount = nameWords.length >= 4 ? 2 : nameWords.length >= 2 ? 1 : 0;
  const primaryName =
    splitCount > 0 ? nameWords.slice(0, -splitCount).join(" ") : fullName;
  const accentName =
    splitCount > 0 ? `${nameWords.slice(-splitCount).join(" ")}.` : "";

  const shortLocation =
    location.includes("Malang") ? "Malang, East Java" : location;

  const portraitViews: Record<
    PortraitMode,
    {
      tabLabel: string;
      src: string;
      alt: string;
      tag: string;
      caption: string;
      objectPos: string;
      unoptimized?: boolean;
    }
  > = {
    official: {
      tabLabel: isId ? "Potret Resmi" : "Portrait",
      src: avatarUrl || "/images/debian_real_landscape.jpg",
      alt: `${fullName} — ${school}`,
      tag: "VERIFIED PROFILE",
      caption: `${nickname} (@debian) • ${school}`,
      objectPos: "object-[50%_18%]",
      unoptimized: Boolean(avatarUrl),
    },
    lab: {
      tabLabel: isId ? "Lab TKJ" : "TKJ Lab",
      src: "/images/education_hero_debian.jpg",
      alt: `${fullName} di laboratorium Teknik Komputer dan Jaringan ${school}`,
      tag: "ALMAMATER MOKLET",
      caption: `${school} • Lab Infrastruktur`,
      objectPos: "object-top",
    },
    digital: {
      tabLabel: isId ? "Konsep 3D" : "3D Render",
      src: "/images/debian_avatar_3d.jpg",
      alt: `Digital 3D identity render of ${fullName}`,
      tag: "DIGITAL PERSONA",
      caption: `@debianxyz • SMK Telkom Malang`,
      objectPos: "object-top",
    },
  };

  const activePortrait = portraitViews[portraitMode];

  const sectionAnchors = [
    {
      href: "#biodata-board",
      label: isId ? "02 Biodata" : "02 Biodata",
    },
    {
      href: "#campus-location",
      label: isId ? "03 Kampus" : "03 Campus",
    },
    {
      href: "#profile-facts",
      label: isId ? "04 Karakter" : "04 Traits",
    },
  ];

  return (
    <section className="relative w-full mb-8 sm:mb-12 pt-1">
      <SubpageBreadcrumb
        sectionIndex={isId ? "01 / PROFIL" : "01 / PROFILE"}
        sectionLabel="Profil & Identitas"
        sectionLabelEn="Profile & Identity"
        rightMeta={school}
      />

      {/* Unified Subpage Profile Dossier Header */}
      <div className="bg-white/95 rounded-3xl border border-[#ded8cb] shadow-xs overflow-hidden">
        {/* Subpage Masthead Bar: Explicitly orients visitor inside the Profile document */}
        <div className="px-5 sm:px-9 lg:px-11 py-3.5 bg-[#fbf9f3]/90 border-b border-[#ded8cb]/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827] truncate">
              {isId
                ? "DOSSIER PRIBADI // SUB-HALAMAN PROFIL"
                : "PERSONAL DOSSIER // PROFILE SUBPAGE"}
            </span>
          </div>

          <nav
            aria-label={isId ? "Navigasi bagian profil" : "Profile sections"}
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[11px]"
          >
            {sectionAnchors.map((anchor) => (
              <a
                key={anchor.href}
                href={anchor.href}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ded8cb] hover:border-[#2563eb]/60 hover:text-[#2563eb] text-[#4b5563] font-semibold transition-colors"
              >
                {anchor.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Main 12-Column Executive Profile Body */}
        <div className="p-5 sm:p-9 lg:p-11">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-11 items-center">
            {/* LEFT COLUMN (7 Cols): Biographical Header, Role, Ethos & Quick Specs */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col gap-5 min-w-0"
            >
              {/* Crisp Subpage Category Pill */}
              <div className="inline-flex items-center gap-2 w-fit max-w-full bg-[#f5f3ee] border border-[#ded8cb] px-3.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#4b5563] truncate">
                  {t("eyebrow")}
                </span>
              </div>

              {/* Dignified Biographical Display Name */}
              <div className="space-y-2.5">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0b0c0c] font-bold tracking-tight leading-[1.13]">
                  {primaryName}{" "}
                  {accentName && (
                    <span className="italic font-normal text-[#2563eb] block sm:inline">
                      {accentName}
                    </span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-[#4b5563]">
                  <span className="font-bold text-[#111827]">
                    {nickname} (@debian)
                  </span>
                  <span className="text-[#c5bfb0]">•</span>
                  <span className="text-[#2563eb] font-semibold">
                    {studyProgram}
                  </span>
                  <span className="text-[#c5bfb0] hidden sm:inline">•</span>
                  <span className="text-[#6b6863]">{t("stampCohort")}</span>
                </div>
              </div>

              {/* Clean Narrative Paragraphs */}
              <div className="space-y-3">
                <p className="font-sans text-[15px] sm:text-base text-[#111827] leading-relaxed">
                  {t("introP1")}
                </p>
                <p className="font-sans text-sm sm:text-[15px] text-[#6b6863] leading-relaxed">
                  {t("introP2")}
                </p>
              </div>

              {/* Refined Engineering Ethos Callout Strip */}
              <div className="bg-[#fbf9f3] rounded-2xl border border-[#ded8cb] border-l-4 border-l-[#2563eb] p-4 sm:p-5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#2563eb]">
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                      {t("deskNoteTitle")}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#ded8cb] font-mono text-[10px] font-bold text-[#2563eb]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("deskNoteTime")}
                  </span>
                </div>

                <blockquote className="font-serif text-sm sm:text-base italic text-[#111827] leading-relaxed">
                  &ldquo;{cleanQuote}&rdquo;
                </blockquote>
              </div>

              {/* Action Strip tailored to Subpage Navigation */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#biodata-board"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b0c0c] hover:bg-[#2563eb] text-white font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>
                    {isId ? "Lihat Biodata Lengkap" : "Explore Full Biodata"}
                  </span>
                  <span>↓</span>
                </a>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fbf9f3] hover:bg-white text-[#111827] border border-[#ded8cb] hover:border-[#2563eb]/50 font-sans text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>{t("closingBtnProjects")}</span>
                  <span>→</span>
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[#4b5563] hover:text-[#2563eb] font-sans text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>{isId ? "Hubungi Langsung" : "Direct Contact"}</span>
                </a>
              </div>

              {/* Compact 4-Column Quick Identity Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-[#ded8cb]/80">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Panggilan" : "Call Sign"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#111827] mt-0.5 block truncate">
                    {nickname} / Debian
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Institusi" : "Institution"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#111827] mt-0.5 block truncate">
                    {school}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Angkatan" : "Cohort"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#2563eb] mt-0.5 block truncate">
                    Moklet A&apos;35
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Domisili" : "Base"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] mt-0.5 block truncate">
                    {shortLocation}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN (5 Cols): Verified Portrait Identity Frame */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              className="lg:col-span-5"
            >
              <div className="bg-[#fbf9f3] rounded-2xl border border-[#ded8cb] p-4 sm:p-5 flex flex-col gap-3.5">
                {/* Switcher Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                      {isId ? "Potret Identitas" : "Identity Portrait"}
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label={isId ? "Pilih tampilan foto profil" : "Select profile photo view"}
                    className="inline-flex flex-wrap p-1 rounded-xl bg-white border border-[#ded8cb] text-[10px] sm:text-[11px] font-mono"
                  >
                    {(["official", "lab", "digital"] as PortraitMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        role="tab"
                        aria-selected={portraitMode === mode}
                        onClick={() => setPortraitMode(mode)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          portraitMode === mode
                            ? "bg-[#0b0c0c] text-white shadow-2xs"
                            : "text-[#6b6863] hover:text-[#111827]"
                        }`}
                      >
                        {portraitViews[mode].tabLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Framed Photo Container */}
                <div className="relative w-full aspect-[4/4.2] rounded-xl overflow-hidden bg-[#18181b] border border-[#ded8cb] group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePortrait.src}
                      initial={shouldReduceMotion ? false : { opacity: 0.25 }}
                      animate={{ opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0.25 }}
                      transition={{ duration: 0.22 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activePortrait.src}
                        alt={activePortrait.alt}
                        fill
                        priority
                        unoptimized={activePortrait.unoptimized}
                        className={`${activePortrait.objectPos} group-hover:scale-[1.02] transition-transform duration-500`}
                        sizes="(max-width: 1024px) 100vw, 440px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/15 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                    {activePortrait.tag}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] sm:text-[11px] font-semibold truncate">
                      {activePortrait.caption}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white/95 text-[#111827] font-mono text-[10px] font-bold shrink-0">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Compact Dark Active Focus Ledger */}
                <div className="bg-[#0b1120] text-white rounded-xl px-4 py-3.5 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blue-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {isId ? "Status Akademik Aktif" : "Active Academic Track"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      MALANG 65139
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-200 leading-relaxed">
                    {isId
                      ? "Fokus saat ini: Routing MikroTik & Cisco (OSPF/VLAN), server Linux Debian, Docker, dan arsitektur web Next.js."
                      : "Current focus: MikroTik & Cisco routing (OSPF/VLAN), Debian Linux servers, Docker, and Next.js web architecture."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
