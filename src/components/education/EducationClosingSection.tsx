"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

interface EducationClosingSectionProps {
  locale: string;
}

export function EducationClosingSection({
  locale,
}: EducationClosingSectionProps) {
  void locale;
  const t = useTranslations("educationPage");

  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xs relative overflow-hidden border border-[#ded8cb] w-full mt-16 sm:mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pt-2">
        {/* Text and Action Buttons (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            <span>{t("closingTag")}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] leading-tight font-bold">
            {t("closingTitle")}
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#444748] max-w-xl leading-relaxed">
            {t("closingLead")}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/projects"
              className="px-6 py-3 rounded-xl bg-[#222222] text-white font-sans text-sm font-semibold transition-all hover:bg-[#2563eb] shadow-xs flex items-center gap-2"
            >
              <span>{t("closingBtnProjects")}</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link
              href="/#contact"
              className="px-6 py-3 rounded-xl bg-[#f0eee8] hover:bg-[#eae8e2] text-[#222222] font-sans text-sm font-semibold transition-colors flex items-center gap-2 border border-[#ded8cb]"
            >
              <span>{t("closingBtnContact")}</span>
              <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Illustration Character Thinking Badge (Col 4) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#f5f3ee] p-2 shadow-inner border border-[#ded8cb]">
            <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsfn2U9EZeUAI12cBS4CgAxFkQhhHo5_HPBnvDh_BDI0xp1XFtikxtsIR36uO6cgIvbjAQTOVVufF4xWZ0StqmEzx43y2y7iVwwJDQIqkodVwD_ZkEqSXwpArrT4UYIoCZPAm-28e8J7NcIFLkTgUGdo8Jk156UOKq9vb3n_5azUakGQVzgj-lPkl-vy58jUS1o2CPL-y6eFG6t293MQx5Lm9BhCanAxrpTxvJbqKyhpMygS4Lsipp"
                alt="Debian Bian looking up thoughtfully with a tiny glowing idea lightbulb doodle"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
              />
            </div>
            {/* Floating note */}
            <div className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-lg bg-[#bfdbfe] text-[#1e40af] font-mono text-[11px] font-bold shadow-xs border border-[#2563eb]/20">
              {t("closingFloating")}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Footer Stamp */}
      <div className="mt-8 pt-6 border-t border-[#f0eee8] flex flex-wrap items-center justify-between text-[#686660] font-mono text-xs">
        <span className="font-semibold">{t("closingFooterStamp")}</span>
        <span className="text-[#2563eb] font-bold">MOKLET PRIDE • ID</span>
      </div>
    </section>
  );
}
