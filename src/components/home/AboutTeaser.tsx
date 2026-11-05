"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

export function AboutTeaser() {
  const t = useTranslations("about");

  return (
    <section id="about-profile" className="w-full py-16 sm:py-20 bg-transparent border-y border-[#ded8cb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Left Frame */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Clean photo card with Foto Bian */}
              <div className="relative bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#ded8cb]">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-[#f5f2ea] shadow-inner">
                  <Image
                    src="/images/Foto Bian.png"
                    alt="Potret Naufal Nizar De Bian (Siswa SMK Telkom Malang Moklet A'35)"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top hover:scale-103 transition-transform duration-500"
                  />
                </div>

                <div className="pt-3.5 sm:pt-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider block">
                      Naufal Nizar De Bian
                    </span>
                    <span className="font-sans text-xs sm:text-sm text-[#6b6863] italic">
                      SMK Telkom Malang
                    </span>
                  </div>
                  <div className="px-2.5 py-1 bg-[#f5f3ee] border border-[#ded8cb] rounded-md font-mono text-[10.5px] text-[#222222] font-bold">
                    Moklet A&apos;35 • X TKJ
                  </div>
                </div>
              </div>

              {/* Clean bottom philosophy quote card */}
              <div className="mt-4 bg-[#f5f2ea] p-4 rounded-2xl shadow-xs border border-[#ded8cb]">
                <p className="font-mono text-[10px] text-[#6b6863] uppercase tracking-wider font-bold">
                  {t("philosophy")}
                </p>
                <p className="font-serif text-sm text-[#222222] italic mt-1 font-semibold leading-snug">
                  &ldquo;{t("quote")}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Right Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs uppercase tracking-wider font-bold">
              <span>●</span> {t("chapter")}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] leading-tight">
              {t("title")}
            </h2>

            <div className="space-y-4 font-sans text-base sm:text-lg text-[#6b6863] leading-relaxed">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#222222] text-white font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm"
              >
                <span>{t("cta")}</span>
                <span>→</span>
              </Link>
              <div className="flex items-center gap-2 font-mono text-xs text-[#6b6863]">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>{t("status")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
