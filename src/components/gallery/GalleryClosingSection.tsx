"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface GalleryClosingSectionProps {
  locale: string;
}

export function GalleryClosingSection({ locale }: GalleryClosingSectionProps) {
  const t = useTranslations("galleryPage");

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 pt-10 pb-8 sm:pb-12">
      <div className="bg-[#f5f2ea] p-6 sm:p-10 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-scrapbook border border-[#ded8cb]">
        {/* Subtle decorative stamp background mark */}
        <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none select-none text-[#0b0c0c]">
          <svg className="w-56 h-56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        {/* Narrative */}
        <div className="max-w-xl relative z-10">
          <span className="font-mono text-[10px] font-bold text-[#2563eb] uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-xs border border-[#ded8cb] inline-block">
            {t("closingTag")}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b0c0c] tracking-tight mt-3">
            {t("closingTitle")}
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#444748] mt-2 leading-relaxed">
            {t("closingLead")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
          <Link
            href={`/${locale}/projects`}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#0b0c0c] text-white font-sans text-xs sm:text-sm font-medium hover:bg-[#2563eb] transition-all shadow-sm flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            <span>{t("closingBtnProjects")}</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <Link
            href={`/${locale}`}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-[#0b0c0c] font-sans text-xs sm:text-sm font-medium hover:bg-[#f0eee8] transition-all shadow-xs flex items-center justify-center gap-2 border border-[#ded8cb] w-full sm:w-auto"
          >
            <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{t("closingBtnHome")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
