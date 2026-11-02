"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface BlogClosingSectionProps {
  locale: string;
  contactEmail?: string;
}

export function BlogClosingSection({ locale, contactEmail = "firwanto.debian@gmail.com" }: BlogClosingSectionProps) {
  const t = useTranslations("blogPage");
  const isId = locale === "id";
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function handleSubscribeClick() {
    setToastMessage(
      isId
        ? "📡 RSS Feed: Sinkronisasi RSS dan newsletter logbook aktif! Feed URL: /api/rss.xml"
        : "📡 RSS Feed: RSS synchronization and newsletter dispatch active! Feed URL: /api/rss.xml"
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-16 sm:mt-20 mb-12 sm:mb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#222222] text-[#dbeafe] px-5 py-3 rounded-2xl shadow-2xl border border-[#dbeafe]/30 font-mono text-xs flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white hover:text-rose-400 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-[#222222] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-scrapbook relative overflow-hidden border border-[#222222]">
        {/* Ambient background decoration */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#2563eb]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#f3b9a7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#dbeafe] font-bold">
            {t("closingTag")}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight font-bold">
            {t("closingTitle")}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#c8c6c5] leading-relaxed">
            {t("closingLead")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleSubscribeClick}
              className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 rounded-full font-mono text-xs uppercase font-bold hover:bg-[#dbeafe] hover:text-[#1e3a8a] transition-colors shadow-xs"
            >
              <span>📡</span>
              <span>{t("closingBtnSubscribe")}</span>
            </button>

            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-mono text-xs uppercase font-bold transition-colors border border-white/15"
            >
              <span>💻</span>
              <span>{t("closingBtnProjects")}</span>
            </Link>

            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 bg-transparent hover:underline text-[#dbeafe] px-4 py-3 font-mono text-xs"
            >
              <span>Email Bian ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
