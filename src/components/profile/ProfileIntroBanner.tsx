"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

interface ProfileIntroBannerProps {
  school?: string;
}

export function ProfileIntroBanner({
  school = "SMK Telkom Malang",
}: ProfileIntroBannerProps) {
  const t = useTranslations("profilePage");
  const locale = useLocale();
  const isId = locale === "id";

  // Guard against stray surrounding quotes in CMS/i18n strings
  const cleanQuote = t("deskNoteQuote").replace(/^[“”"']+|[“”"']+$/g, "");

  return (
    <section className="relative w-full mb-10 sm:mb-14">
      <SubpageBreadcrumb
        sectionIndex={isId ? "01 / PROFIL" : "01 / PROFILE"}
        sectionLabel="Profil & Identitas"
        sectionLabelEn="Profile & Identity"
        rightMeta={school}
      />

      {/* Executive Profile Hero Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN (7 Cols): Authoritative Headline, Narrative & Quick Actions */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 w-fit bg-[#f5f3ee] border border-[#ded8cb] px-3.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#4b5563]">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.1rem] text-[#0b0c0c] font-bold tracking-tight leading-[1.1]">
              {t("heading1")}{" "}
              <span className="italic font-normal text-[#2563eb] block sm:inline">
                {t("heading2")}
              </span>
            </h1>

            <div className="space-y-3.5 pt-1">
              <p className="font-sans text-base sm:text-lg text-[#111827] leading-relaxed">
                {t("introP1")}
              </p>
              <p className="font-sans text-sm sm:text-base text-[#6b6863] leading-relaxed">
                {t("introP2")}
              </p>
            </div>

            {/* Clean Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b0c0c] hover:bg-[#2563eb] text-white font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all"
              >
                <span>{t("closingBtnProjects")}</span>
                <span>→</span>
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fbf9f3] hover:bg-white text-[#111827] border border-[#ded8cb] hover:border-[#2563eb]/50 font-sans text-xs sm:text-sm font-semibold transition-all"
              >
                <span>{isId ? "Hubungi Langsung" : "Direct Contact"}</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Executive Engineering Dossier & Ethos Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#fbf9f3] rounded-2xl border border-[#ded8cb] p-5 sm:p-6 space-y-5">
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#ded8cb]/80">
                <div className="flex items-center gap-2 text-[#2563eb]">
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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

              {/* Clean Single-Quoted Philosophy Statement */}
              <blockquote className="font-serif text-base sm:text-lg italic text-[#111827] leading-relaxed">
                &ldquo;{cleanQuote}&rdquo;
              </blockquote>

              {/* Structured Academic Metadata Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-[#ded8cb]/80">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Institusi" : "Institution"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#111827] mt-0.5 block">
                    {school}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Angkatan" : "Cohort"}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#2563eb] mt-0.5 block">
                    {t("stampCohort")}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Konsentrasi" : "Discipline"}
                  </span>
                  <span className="font-sans text-xs font-semibold text-[#111827] mt-0.5 block">
                    Network &amp; Full-Stack Web
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                    {isId ? "Domisili" : "Base"}
                  </span>
                  <span className="font-sans text-xs font-semibold text-[#111827] mt-0.5 block">
                    Malang, Jawa Timur
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
