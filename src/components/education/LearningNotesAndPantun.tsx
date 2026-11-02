"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export function LearningNotesAndPantun() {
  const t = useTranslations("educationPage");
  const [copiedPantun, setCopiedPantun] = useState(false);

  function handleCopyPantun() {
    const text = `${t("pantunLine1")}\n${t("pantunLine2")}\n${t("pantunLine3")}\n${t("pantunLine4")}\n— ${t("pantunAuthor")}`;
    navigator.clipboard?.writeText(text);
    setCopiedPantun(true);
    setTimeout(() => setCopiedPantun(false), 2500);
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full" id="learning-notes">
      {/* Left: Scrapbook Notes Pins (Col 6) */}
      <div className="md:col-span-6 flex flex-col gap-6">
        <div className="font-mono text-xs uppercase text-[#2563eb] font-bold tracking-widest">
          {t("notesTag")}
        </div>

        {/* Sticky Note 1 */}
        <div className="relative bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-[#ded8cb] rotate-1 hover:rotate-0 transition-all duration-300 group">
          <div className="absolute -top-3 left-8 w-28 h-6 bg-[rgba(245,242,234,0.95)] backdrop-blur-xs rounded-xs shadow-tape border-l-2 border-r-2 border-dashed border-[#686660]/30" />
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
            <p className="font-serif text-base sm:text-lg text-[#222222] italic leading-relaxed">
              {t("note1")}
            </p>
          </div>
          <div className="mt-3 text-right font-mono text-xs text-[#686660] font-medium">
            {t("note1Author")}
          </div>
        </div>

        {/* Sticky Note 2 */}
        <div className="relative bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-[#ded8cb] -rotate-1 hover:rotate-0 transition-all duration-300 group">
          <div className="absolute -top-3 right-8 w-28 h-6 bg-[rgba(245,242,234,0.95)] backdrop-blur-xs rounded-xs shadow-tape border-l-2 border-r-2 border-dashed border-[#686660]/30" />
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
            </svg>
            <p className="font-serif text-base sm:text-lg text-[#222222] italic leading-relaxed">
              {t("note2")}
            </p>
          </div>
          <div className="mt-3 text-right font-mono text-xs text-[#686660] font-medium">
            {t("note2Author")}
          </div>
        </div>
      </div>

      {/* Right: Dedicated Pantun Scrapbook Card (Col 6) */}
      <div className="md:col-span-6">
        <div className="h-full bg-[#f5f2ea] p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col justify-between relative overflow-hidden border border-[#ded8cb]">
          {/* Decorative Postal Stamp */}
          <div className="absolute top-6 right-6 w-16 h-16 rounded border-2 border-dashed border-[#686660]/30 flex flex-col items-center justify-center -rotate-6 pointer-events-none">
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#686660] font-bold">TELKOM</span>
            <span className="font-mono text-[10px] text-[#2563eb] font-bold">MOKLET</span>
            <span className="font-mono text-[8px] text-[#686660]">MALANG</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 9V4l1 1V2H7v3l1-1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
              </svg>
              <span className="font-mono text-[11px] text-[#2563eb] uppercase tracking-wider font-bold">
                {t("pantunLabel")}
              </span>
            </div>

            <div className="font-serif text-xl sm:text-2xl text-[#222222] leading-relaxed pl-4 border-l-2 border-[#2563eb]/40 space-y-1.5 italic font-medium">
              <p>{t("pantunLine1")}</p>
              <p>{t("pantunLine2")}</p>
              <p>{t("pantunLine3")}</p>
              <p className="text-[#2563eb] font-bold not-italic">{t("pantunLine4")}</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#ded8cb] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#bfdbfe] flex items-center justify-center font-mono text-xs font-bold text-[#1e40af]">
                BN
              </div>
              <div>
                <div className="font-sans text-xs sm:text-sm font-bold text-[#222222]">
                  Debian (Bian)
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-[#686660]">
                  {t("pantunAuthor")}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPantun}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-[11px] font-semibold border border-[#ded8cb] shadow-xs transition-all flex items-center gap-1"
              title="Salin bait pantun"
            >
              <span>{copiedPantun ? "✓ Disalin" : "Salin Pantun"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
