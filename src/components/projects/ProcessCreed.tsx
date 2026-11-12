"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

interface ProcessCreedProps {
  locale: string;
}

export function ProcessCreed({ locale }: ProcessCreedProps) {
  void locale;
  const t = useTranslations("projectsPage");

  return (
    <section className="w-full mt-12 sm:mt-16 pt-4">
      <div className="relative bg-[#f5f2ea] rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs border border-[#ded8cb]">
        {/* Ambient faint decorative glow */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(219,234,254,0.5) 0%, rgba(219,234,254,0) 70%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Text and Action Buttons (Col 8) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white shadow-xs border border-[#ded8cb]">
              <span className="font-mono text-[11px] text-[#2563eb] uppercase tracking-wider font-bold">
                {t("creedTag")}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] tracking-tight font-bold">
              {t("creedTitle")}
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#444748] max-w-xl leading-relaxed">
              {t("creedDesc")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/"
                className="px-5 py-3 rounded-xl bg-[#222222] text-white font-sans text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-xs flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{t("creedBtnHome")}</span>
              </Link>
              <Link
                href="/#blog"
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#eae8e2] text-[#222222] font-sans text-sm font-semibold transition-all shadow-xs flex items-center gap-2 border border-[#ded8cb]"
              >
                <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>{t("creedBtnBlog")}</span>
              </Link>
            </div>
          </div>

          {/* Spot Illustration of Bian Celebrating (Col 4) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-56 sm:w-64">
              {/* Photo Card */}
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#ded8cb]">
                <div className="rounded-xl overflow-hidden bg-[#f5f3ee] aspect-square flex items-center justify-center border border-[#ded8cb]/80">
                  <Image
                    src="https://lh3.googleusercontent.com/aida/AEtjO1X8x7ZrxDh76j36fLf6cjqvOPefdYA5FQ5UM6vgfk1njEjTRNm4zy8sjMrOtX76KkIHjlAjb-E7ey59ADHkd77KkPFIvOfKx8uH6FVeArcj6Um-gwtTdeTwiHhAv_91_sS4wm45AJyTqID_c96kHBkdwH1tIOI0zm6TQszn9uMlRcc9jmYjFGJwKwzB-pCL5ypa437I-NphiUpayJ3M6LOLJzpiyI-iPzvDZu7teg23pJ2vN8FwZrUuUEU"
                    alt="Debian celebrating a small milestone with a humble smile and fist pump"
                    width={260}
                    height={260}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Badge */}
                <div className="mt-3 text-center pb-1">
                  <div className="inline-block bg-[#f3b9a7] text-[#222222] px-3 py-1 rounded-md text-xs font-mono shadow-xs font-semibold border border-[#ded8cb]">
                    {t("creedSticker")}
                  </div>
                  <div className="font-serif text-xs italic text-[#686660] mt-1.5 font-medium">
                    {t("creedSign")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
