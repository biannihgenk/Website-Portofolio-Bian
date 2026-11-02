"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function PantunNoteSection() {
  const t = useTranslations("achievementsPage");

  return (
    <section className="mt-14 sm:mt-16 flex justify-center w-full">
      <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xs max-w-xl w-full transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-[#ded8cb]">
        {/* Faux brass paperclip */}
        <div className="absolute -top-4 left-10 w-6 h-12 rounded-full border-4 border-[#c4c7c7] bg-transparent pointer-events-none transform -rotate-12 shadow-xs" />
        {/* Faux small tape */}
        <div className="absolute -top-2 right-10 w-16 h-4 bg-[#dbeafe]/90 rounded-xs transform rotate-2 shadow-tape border-l border-r border-dashed border-[#686660]/30" />

        <div className="flex items-start gap-4">
          <svg className="w-8 h-8 text-[#2563eb] flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#686660] uppercase tracking-wider font-bold">
              {t("pantunLabel")}
            </span>

            <p className="font-serif text-lg sm:text-xl text-[#222222] italic leading-relaxed">
              {t("pantunLine1")}<br />
              {t("pantunLine2")}<br />
              {t("pantunLine3")}<br />
              {t("pantunLine4")}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-[#ded8cb]/60">
              <span className="font-mono text-xs text-[#686660] font-medium">
                {t("pantunAuthor")}
              </span>
              <svg className="w-4 h-4 text-[#f3b9a7]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
