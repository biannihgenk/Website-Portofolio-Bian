"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

interface ToBeContinuedSectionProps {
  locale: string;
}

export function ToBeContinuedSection({ locale }: ToBeContinuedSectionProps) {
  void locale;
  const t = useTranslations("achievementsPage");

  return (
    <section className="mt-16 sm:mt-20 w-full">
      <div className="relative bg-[#f5f2ea] rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xs border border-[#ded8cb] overflow-hidden">
        {/* Ambient doodle spark glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(243,185,167,0.35) 0%, rgba(243,185,167,0) 70%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Narrative (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#dbeafe] text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
                {t("continuedTag")}
              </span>
              <span className="font-mono text-xs text-[#686660]">
                {t("continuedSub")}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] tracking-tight font-bold">
              {t("continuedTitle")}
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#444748] max-w-2xl leading-relaxed">
              {t("continuedLead")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/#contact"
                className="px-6 py-3 rounded-full bg-[#222222] text-white font-sans text-sm font-semibold shadow-xs hover:bg-[#2563eb] transition-all flex items-center gap-2"
              >
                <span>{t("continuedBtnCollab")}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3 rounded-full bg-white text-[#222222] font-sans text-sm font-semibold shadow-xs hover:bg-[#f0eee8] transition-all flex items-center gap-2 border border-[#ded8cb]"
              >
                <span>{t("continuedBtnProjects")}</span>
                <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Thinking Visual (Col 4) */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <Image
                src="https://lh3.googleusercontent.com/aida/AEtjO1XVE1iCotPojxE6l8t0QnfGo_0KJsxjpslEXkF13ZYuQL8xnTkIlvbh2X0VirWOK8TkCq_1LODQP1ADTfII7MvfDC6u-dM_YdBRnEdPjldhIdbA3T5DX9SIPA4M_wjPVpGJprD8-hk8_xDP2yssNTq9uQ6NTPRxJxw0GMNoNHCgKFQAJ88wx_DdYUqqwI6QpiTDVdvJW2D0Lvix7PnpeHE9ExP2AkOObk3D20GN5nL_hPYKWFXo1ZTWXO4"
                alt="Debian Bian thinking and exploring new ideas"
                width={240}
                height={240}
                className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
