"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface WayfindingBannerProps {
  locale: string;
}

export function WayfindingBanner({ locale }: WayfindingBannerProps) {
  const t = useTranslations("profilePage");

  return (
    <section className="w-full mt-12 sm:mt-16">
      <div className="relative bg-[#f5f2ea] rounded-3xl p-6 sm:p-10 shadow-scrapbook overflow-hidden border border-[#ded8cb]">
        {/* Translucent tape highlight top right */}
        <div className="absolute top-0 right-16 w-32 h-7 bg-[#f3b9a7]/80 rounded-b-md shadow-tape -rotate-2 border-b border-[#222222]/10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl flex flex-col gap-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 w-fit mx-auto md:mx-0 bg-white border border-[#ded8cb] px-3 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="font-mono text-xs uppercase text-[#222222] font-semibold">
                {t("closingTag")}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold leading-tight">
              {t("closingTitle")}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
              {t("closingDesc")}
            </p>

            <div className="mt-1">
              <p className="font-serif text-base italic text-[#2563eb] font-semibold">
                {t("closingSign")}
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-center">
            <Link
              href={`/${locale}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#222222] text-white font-sans text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:bg-[#2563eb] transition-all"
            >
              <span>✉</span>
              <span>{t("closingBtnContact")}</span>
            </Link>

            <Link
              href={`/${locale}/projects`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f5f3ee] text-[#222222] border border-[#ded8cb] font-sans text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <span>📁</span>
              <span>{t("closingBtnProjects")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
