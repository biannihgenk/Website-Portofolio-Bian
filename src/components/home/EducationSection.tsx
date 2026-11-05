"use client";

import React from "react";
import { useTranslations } from "next-intl";
import type { Education } from "@/types/content";

interface EducationSectionProps {
  educationList: Education[];
  locale: string;
}

export function EducationSection({ educationList, locale }: EducationSectionProps) {
  const t = useTranslations("education");

  const primaryEdu = educationList[0];

  return (
    <section id="education" className="w-full py-16 sm:py-20 bg-transparent border-y border-[#ded8cb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="space-y-2 mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#ded8cb] rounded-full font-mono text-xs font-bold text-blue-600 uppercase tracking-widest shadow-xs">
            <span>📚</span> {t("badge")}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#222222]">
            {t("title")}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6b6863]">
            {t("subtitle")}
          </p>
        </div>

        {/* Split Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card: Formal Vocational Education */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ded8cb] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 font-mono text-xs font-bold text-blue-900 uppercase">
                  {t("vocationalLabel")}
                </span>
                <span className="font-mono text-xs text-[#6b6863]">2023 — 2026 (Exp.)</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-2xl text-[#222222]">
                  {primaryEdu?.institution || t("vocationalTitle")}
                </h3>
                <p className="font-sans text-sm font-semibold text-blue-600">
                  {primaryEdu?.program || t("vocationalMajor")}
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed">
                {t("vocationalDesc")}
              </p>

              <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-[#444748]">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("vocPoint1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("vocPoint2")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("vocPoint3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 bg-[#f5f2ea] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 rounded-b-3xl flex items-center justify-between font-mono text-xs border-t border-[#ded8cb]">
              <span className="text-[#6b6863]">Location: Malang, East Java</span>
              <span className="text-blue-600 font-bold">● Active Student</span>
            </div>
          </div>

          {/* Right Card: Self-Directed Tech Exploration */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ded8cb] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#f3b9a7] font-mono text-xs font-bold text-[#222222] uppercase">
                  {t("selfLabel")}
                </span>
                <span className="font-mono text-xs text-[#6b6863]">Continuous</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-2xl text-[#222222]">
                  {t("selfTitle")}
                </h3>
                <p className="font-sans text-sm font-semibold text-[#6b6863]">
                  {t("selfMajor")}
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed">
                {t("selfDesc")}
              </p>

              <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-[#444748]">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("selfPoint1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("selfPoint2")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{t("selfPoint3")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 bg-[#f5f2ea] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 rounded-b-3xl flex items-center justify-between font-mono text-xs border-t border-[#ded8cb]">
              <span className="text-[#6b6863]">Curiosity & Homelab</span>
              <span className="text-blue-600 font-bold">⚡ Self-Driven</span>
            </div>
          </div>
        </div>

        {/* CTA to Dedicated Education Page */}
        <div className="mt-10 text-center">
          <a
            href={`/${locale}/education`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] shadow-xs transition-all font-bold"
          >
            <span>{t("cta")}</span>
            <span className="text-blue-600">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
