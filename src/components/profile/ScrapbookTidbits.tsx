"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export function ScrapbookTidbits() {
  const t = useTranslations("profilePage");

  const colorPalettes = [
    "bg-white",
    "bg-[#dbeafe]/50",
    "bg-[#f3b9a7]/35",
    "bg-[#bfdbfe]/40",
    "bg-[#f5f2ea]",
  ];

  const [activeColors, setActiveColors] = useState<number[]>([0, 0, 0, 0]);

  function cycleColor(index: number) {
    setActiveColors((prev) => {
      const copy = [...prev];
      copy[index] = (copy[index] + 1) % colorPalettes.length;
      return copy;
    });
  }

  const tidbits = [
    {
      tapeRotate: "-rotate-2",
      cardRotate: "rotate-[-1.5deg]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
      header: t("t1Header"),
      title: t("t1Title"),
      desc: t("t1Desc"),
    },
    {
      tapeRotate: "rotate-3",
      cardRotate: "rotate-[2deg]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      header: t("t2Header"),
      title: t("t2Title"),
      desc: t("t2Desc"),
    },
    {
      tapeRotate: "-rotate-1",
      cardRotate: "rotate-[-1deg]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
      header: t("t3Header"),
      title: t("t3Title"),
      desc: t("t3Desc"),
    },
    {
      tapeRotate: "rotate-2",
      cardRotate: "rotate-[1.5deg]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      header: t("t4Header"),
      title: t("t4Title"),
      desc: t("t4Desc"),
    },
  ];

  return (
    <section className="w-full my-12 sm:my-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs uppercase bg-[#dbeafe] text-[#1e3a8a] font-bold px-3 py-1 rounded-full border border-[#dbeafe]">
            {t("tidbitsTag")}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
            {t("tidbitsTitle")}
          </h2>
        </div>
        <span className="font-mono text-xs text-[#6b6863] hidden sm:inline-block">
          {t("tidbitsHint")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {tidbits.map((note, idx) => {
          const bgClass = colorPalettes[activeColors[idx]];

          return (
            <div
              key={idx}
              onClick={() => cycleColor(idx)}
              className={`relative ${bgClass} p-6 rounded-2xl border border-[#ded8cb] shadow-scrapbook ${note.cardRotate} hover:rotate-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer group flex flex-col justify-between select-none`}
            >
              {/* Masking tape on top */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#f3b9a7]/75 backdrop-blur-sm rounded-sm shadow-tape ${note.tapeRotate} border-t border-b border-[#222222]/10 pointer-events-none`}
              />

              <div>
                <div className="flex items-center gap-1.5 text-[#2563eb] mb-2">
                  {note.icon}
                  <span className="font-mono text-[10px] uppercase font-bold text-[#6b6863]">
                    {note.header}
                  </span>
                </div>

                <h4 className="font-mono text-xs font-bold text-[#222222] mb-2">
                  {note.title}
                </h4>

                <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
                  {note.desc}
                </p>
              </div>

              <span className="font-mono text-[10px] text-[#6b6863] block mt-4 pt-2 border-t border-[#ded8cb]/40 italic group-hover:text-[#222222] transition-colors">
                {t("clickHint")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
