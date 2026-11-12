"use client";

import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";

interface SubpageBreadcrumbProps {
  sectionIndex: string;
  sectionLabel: string;
  sectionLabelEn?: string;
  rightMeta?: string;
}

export function SubpageBreadcrumb({
  sectionIndex,
  sectionLabel,
  sectionLabelEn,
  rightMeta,
}: SubpageBreadcrumbProps) {
  const locale = useLocale();
  const isId = locale === "id";
  const currentLabel = isId ? sectionLabel : sectionLabelEn || sectionLabel;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#ded8cb]/80">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-[#6b6863]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#6b6863] hover:text-[#2563eb] transition-colors font-medium"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>{isId ? "Beranda" : "Home"}</span>
        </Link>
        <span className="text-[#c5bfb0]">/</span>
        <span className="text-[#111827] font-semibold">{currentLabel}</span>
      </nav>

      <div className="flex items-center gap-2.5 font-mono text-[11px]">
        {rightMeta && (
          <span className="hidden sm:inline-block text-[#6b6863] uppercase tracking-wider">
            {rightMeta}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#ded8cb] text-[#111827] font-bold tracking-wider uppercase shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          <span>{sectionIndex}</span>
        </span>
      </div>
    </div>
  );
}
