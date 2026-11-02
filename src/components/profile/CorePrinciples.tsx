"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function CorePrinciples() {
  const t = useTranslations("profilePage");

  const principles = [
    {
      num: "01",
      title: t("p1Title"),
      desc: t("p1Desc"),
      tag: "#CURIOSITY_FIRST",
    },
    {
      num: "02",
      title: t("p2Title"),
      desc: t("p2Desc"),
      tag: "#HANDS_ON_LEARNING",
    },
    {
      num: "03",
      title: t("p3Title"),
      desc: t("p3Desc"),
      tag: "#HUMBLE_ITERATION",
    },
    {
      num: "04",
      title: t("p4Title"),
      desc: t("p4Desc"),
      tag: "#KNOWLEDGE_SHARING",
    },
  ];

  return (
    <section className="w-full my-12 sm:my-16">
      <div className="flex flex-col gap-2 mb-8">
        <div className="inline-flex items-center gap-1.5 w-fit bg-[#bfdbfe]/50 px-3.5 py-1 rounded-full border border-[#bfdbfe]">
          <span className="font-mono text-xs uppercase text-[#1e40af] font-bold">
            {t("principlesTag")}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
          {t("principlesTitle")}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#6b6863] max-w-2xl leading-relaxed">
          {t("principlesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {principles.map((p) => (
          <div
            key={p.num}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded8cb] shadow-scrapbook flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-scrapbook-lg transition-all duration-300 group"
          >
            <div>
              <span className="font-serif font-bold text-4xl sm:text-5xl text-[#2563eb]/25 block mb-3 group-hover:text-[#2563eb]/40 transition-colors">
                {p.num}
              </span>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#222222] mb-2 leading-snug">
                {p.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed">
                {p.desc}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#ded8cb]/60 font-mono text-[10px] uppercase font-bold text-[#6b6863]">
              {p.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
