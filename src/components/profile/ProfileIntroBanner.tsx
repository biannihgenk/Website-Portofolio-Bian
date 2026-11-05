"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProfileIntroBannerProps {
  school?: string;
}

export function ProfileIntroBanner({
  school = "SMK Telkom Malang",
}: ProfileIntroBannerProps) {
  const t = useTranslations("profilePage");

  return (
    <section className="relative w-full mb-12 sm:mb-16">
      {/* Top Eyebrow & Intro Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#ded8cb]">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 w-fit bg-[#f5f3ee] border border-[#ded8cb] px-3.5 py-1 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b6863]">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] font-bold tracking-tight mt-2 relative">
            {t("heading1")}<br />
            <span className="relative inline-block">
              {t("heading2")}
              {/* Decorative scribble highlight beneath */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#bfdbfe] pointer-events-none -z-10"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 300 12"
              >
                <path
                  d="M2.5 9.5C65.5 3.5 158.5 2 297.5 7.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Quick Status Stamp Badge */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-xs border border-[#ded8cb] shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#bfdbfe] flex items-center justify-center text-[#1e40af]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-[#222222]">
              {school}
            </span>
            <span className="font-mono text-[10px] text-[#6b6863] uppercase">
              {t("stampCohort")}
            </span>
          </div>
        </div>
      </div>

      {/* Intro Text and Handwritten Note Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <p className="font-sans text-base sm:text-lg text-[#222222] leading-relaxed">
            {t("introP1")}
          </p>
          <p className="font-sans text-sm sm:text-base text-[#6b6863] leading-relaxed">
            {t("introP2")}
          </p>
        </div>

        {/* Reflective Note Card */}
        <div className="lg:col-span-4 relative">
          <div className="bg-[#dbeafe]/40 p-6 rounded-2xl shadow-xs border border-[#ded8cb]">
            <div className="flex items-center gap-1.5 text-[#2563eb] mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="font-mono text-xs uppercase font-bold text-[#2563eb]">
                {t("deskNoteTitle")}
              </span>
            </div>

            <p className="font-serif text-base sm:text-lg italic text-[#222222] leading-snug">
              &ldquo;{t("deskNoteQuote")}&rdquo;
            </p>

            <div className="mt-4 pt-2 border-t border-[#ded8cb]/60 flex justify-between items-center text-[#6b6863] text-xs font-mono">
              <span>{t("deskNoteLabel")}</span>
              <span className="text-[#2563eb] font-bold">{t("deskNoteTime")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
