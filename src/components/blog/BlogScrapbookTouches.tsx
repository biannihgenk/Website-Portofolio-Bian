"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function BlogScrapbookTouches() {
  const t = useTranslations("blogPage");

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-16 sm:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Pantun Sudut Jurnal Card */}
        <div className="md:col-span-6 bg-[#f5f3ee] rounded-3xl p-6 sm:p-8 shadow-scrapbook border-l-4 border-[#2563eb] relative overflow-hidden border border-[#ded8cb] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#2563eb] mb-4">
              <span className="text-base">📖</span>
              <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
                {t("pantunTag")}
              </span>
            </div>

            <blockquote className="font-serif text-lg sm:text-xl text-[#222222] italic leading-relaxed space-y-1">
              <p>{t("pantunLine1")}</p>
              <p>{t("pantunLine2")}</p>
              <p>{t("pantunLine3")}</p>
              <p>{t("pantunLine4")}</p>
            </blockquote>
          </div>

          <div className="mt-6 pt-4 border-t border-[#ded8cb]/80 flex items-center justify-between text-[#686660] font-mono text-xs">
            <span>{t("pantunAuthor")}</span>
            <span className="text-[#2563eb] font-bold">{t("pantunHash")}</span>
          </div>
        </div>

        {/* Hand-annotated Sticky Note */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#ded8cb] shadow-scrapbook rotate-1 hover:rotate-0 transition-transform duration-300 relative flex flex-col justify-between">
          {/* Masking tape on top */}
          <div className="absolute -top-3 left-8 w-24 h-5 bg-[#f5f2ea]/90 backdrop-blur-xs rounded-xs shadow-tape border-l border-r border-dashed border-[#686660]/30 pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-[#686660] font-mono text-xs uppercase mb-3">
              <span className="text-sm">📌</span>
              <span className="font-bold tracking-wider">{t("manifestoTag")}</span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#222222] leading-relaxed italic">
              {t("manifestoText")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f0eee8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="font-mono text-[11px] uppercase text-[#686660] font-bold tracking-wider">
              {t("manifestoBadge")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
