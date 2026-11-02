"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Achievement } from "@/types/content";

interface SpotlightStorySectionProps {
  featuredAchievement?: Achievement | null;
  locale?: string;
}

export function SpotlightStorySection({
  featuredAchievement,
  locale = "id",
}: SpotlightStorySectionProps) {
  const t = useTranslations("achievementsPage");
  const isId = locale === "id";

  if (!featuredAchievement) return null;

  const title = isId
    ? featuredAchievement.title_id || featuredAchievement.title_en
    : featuredAchievement.title_en || featuredAchievement.title_id;

  const description = isId
    ? featuredAchievement.description_id || featuredAchievement.description_en
    : featuredAchievement.description_en || featuredAchievement.description_id;

  const organization = featuredAchievement.organization || "Pusat Prestasi Nasional / Vokasi";

  return (
    <section className="relative mt-16 sm:mt-20 pt-6" id="spotlight-section">
      {/* Notebook binding style header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
          {featuredAchievement.category?.toUpperCase() || t("spotlightTag")}
        </span>
        <span className="font-mono text-xs text-[#686660] font-medium">
          {organization} • {featuredAchievement.achievement_date ? new Date(featuredAchievement.achievement_date).getFullYear() : "2026"}
        </span>
      </div>

      {/* Double-card editorial spread with notebook aesthetic */}
      <div className="bg-white rounded-3xl shadow-scrapbook overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative border border-[#ded8cb]">
        {/* Subtle notebook margin line */}
        <div className="hidden lg:block absolute left-6 top-0 bottom-0 w-px bg-rose-300/40 pointer-events-none" />

        {/* Left Story Column (Col 7) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col gap-6 lg:pl-14">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-[#686660] tracking-wider font-bold">
              {featuredAchievement.slug.toUpperCase()}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#222222] tracking-tight font-bold">
              {title}
            </h2>
          </div>

          <div className="space-y-4 font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
            <div>
              <h4 className="font-sans text-sm sm:text-base font-bold text-[#222222] mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                {isId ? "Latar Belakang & Persiapan Kompetisi" : "Background & Competition Preparation"}
              </h4>
              <p>{description}</p>
            </div>

            <div>
              <h4 className="font-sans text-sm sm:text-base font-bold text-[#222222] mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                {isId ? "Pengalaman & Tantangan Pembuktian" : "Hands-On Experience & Proof"}
              </h4>
              <p>
                {isId
                  ? "Mengintegrasikan dasar algoritma cerdas, pemrosesan data, dan penalaran teknis di bawah batas waktu kompetitif yang ketat."
                  : "Integrated core algorithmic logic, data pipelines, and technical reasoning under tight competition time constraints."}
              </p>
            </div>
          </div>

          {/* Stamped reflection quote banner */}
          <div className="bg-[#f5f2ea] p-4 sm:p-5 rounded-2xl flex items-start gap-3 border border-[#ded8cb] shadow-xs">
            <svg className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <p className="font-serif text-sm sm:text-base text-[#222222] italic leading-snug">
                {t("spotlightQuote")}
              </p>
              <span className="font-mono text-[10px] sm:text-[11px] text-[#686660] font-bold block mt-1 tracking-wider">
                {t("spotlightAuthor")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual Editorial Column (Col 5) */}
        <div className="lg:col-span-5 bg-[#f5f3ee] p-6 sm:p-10 lg:p-12 flex flex-col justify-between items-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#ded8cb]">
          {/* Washi tape top right */}
          <div className="absolute -top-3 right-8 w-28 h-6 bg-[rgba(245,242,234,0.95)] rounded-xs transform rotate-3 shadow-tape border-l-2 border-r-2 border-dashed border-[#686660]/30 z-20 backdrop-blur-xs" />

          {/* Spotlight Character Illustration */}
          <div className="relative w-full max-w-xs aspect-square flex items-center justify-center my-auto">
            <Image
              src="https://lh3.googleusercontent.com/aida/AEtjO1UKXwT0RTs6CXdEVJMllCltYtHIZphM3btZb8Jztqfo5mWeAJPIhGTUGQ2oOdmkV-GYE08MUNYG7F4RcRnZlWaYWsxolTDpaIllDqzA2TOodDWdp21GDwmQB1tbJEL798-_OlgvCD9PZCEjs6CVWQiJOzovUhXe_PEKySffJMp83IxFQ6Y-WhIXJy5HV0Noe9VOwURarR71vqOLPQ1SbL4_dOL9EoW6_DqgkQwDHArZjCM1dx_mZU599Q"
              alt="Debian Bian with vocational blazer and sketchbook"
              width={340}
              height={340}
              className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Verification Metadata Box */}
          <div className="w-full bg-white p-4 rounded-xl shadow-xs flex flex-col gap-2 mt-4 border border-[#ded8cb]">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#686660]">
              <span>{isId ? "VERIFIKASI RESMI" : "OFFICIAL VERIFICATION"}</span>
              <span className="text-[#2563eb] font-bold">100% VALIDATED</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#bfdbfe] flex items-center justify-center text-[#1e40af] flex-shrink-0">
                <svg className="w-5 h-5 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div>
                <div className="font-sans text-sm font-bold text-[#222222] line-clamp-1">
                  {title}
                </div>
                <div className="font-sans text-xs text-[#444748]">
                  {organization}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
