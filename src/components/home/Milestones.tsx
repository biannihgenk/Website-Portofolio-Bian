"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Achievement } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

interface MilestonesProps {
  achievements: Achievement[];
  locale: string;
}

export function Milestones({ achievements, locale }: MilestonesProps) {
  const t = useTranslations("milestones");
  const isId = locale === "id";

  const items = achievements;

  const badgeColors = [
    "bg-blue-100",
    "bg-sky-100",
    "bg-indigo-100",
    "bg-amber-100",
  ];

  return (
    <section id="achievements" className="w-full py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
            <span>★</span> {t("badge")}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#222222]">
            {t("title")}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="font-sans text-sm sm:text-base text-[#6b6863] max-w-md">
            {t("subtitle")}
          </p>
          <a
            href={`/${locale}/achievements`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] shadow-xs transition-all whitespace-nowrap self-start sm:self-auto font-bold"
          >
            <span>{t("exploreAll")}</span>
            <span className="text-blue-600">→</span>
          </a>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-dashed border-[#ded8cb] text-center space-y-3">
          <div className="text-4xl">🏆</div>
          <p className="font-serif text-xl font-bold text-[#222222]">
            {isId ? "Belum Ada Pencapaian yang Ditambahkan" : "No Milestones Added Yet"}
          </p>
          <p className="font-sans text-sm text-[#6b6863] max-w-md mx-auto">
            {isId
              ? "Sertifikasi, penghargaan, dan prestasi akan muncul di sini setelah ditambahkan melalui panel admin."
              : "Certifications, awards, and milestones will appear here once added through the admin panel."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded8cb] shadow-scrapbook space-y-4">
          {items.map((item, idx) => {
          const title = isId ? item.title_id : item.title_en;
          const desc = isId ? item.description_id : item.description_en;
          const imgUrl = item.image_path ? getStoragePublicUrl(item.image_path) : null;
          const colorClass = badgeColors[idx % badgeColors.length];

          return (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#f5f3ee] hover:bg-[#f5f2ea] border border-[#ded8cb]/80 hover:border-[#222222]/20 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${colorClass} shrink-0 flex items-center justify-center text-[#222222] font-bold border border-[#222222]/10 shadow-xs overflow-hidden`}
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={title}
                      width={48}
                      height={48}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xl">🏆</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#222222] hover:text-blue-600 transition-colors">
                      <a href={`/${locale}/achievements`}>
                        {title}
                      </a>
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200/60 font-mono text-[10px] uppercase text-blue-900 font-bold">
                      {item.category || "Honors"}
                    </span>
                  </div>

                  {item.organization && (
                    <p className="font-sans text-xs text-blue-600 font-semibold">
                      {item.organization}
                    </p>
                  )}

                  {desc && (
                    <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed max-w-2xl line-clamp-2">
                      {desc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center font-mono text-xs text-[#6b6863] shrink-0">
                {item.achievement_date && (
                  <span className="px-2.5 py-1 rounded bg-white border border-[#ded8cb]">
                    {item.achievement_date}
                  </span>
                )}
                {item.credential_url ? (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                  >
                    <span>{t("verify")}</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}
