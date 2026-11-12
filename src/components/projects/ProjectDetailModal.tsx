"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface ProjectDetailData {
  key: string;
  title: string;
  status: string;
  statusColor: string;
  period: string;
  summary: string;
  problem: string;
  role: string;
  tech: string[];
  lessons: string;
  projectUrl?: string | null;
  repoUrl?: string | null;
  coverUrl?: string | null;
}

interface ProjectDetailModalProps {
  isOpen: boolean;
  data: ProjectDetailData | null;
  onClose: () => void;
  _locale?: string;
}

export function ProjectDetailModal({
  isOpen,
  data,
  onClose,
}: ProjectDetailModalProps) {
  const t = useTranslations("projectsPage");

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c19]/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#ded8cb] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f0eee8] hover:bg-[#eae8e2] flex items-center justify-center text-[#222222] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer"
          aria-label="Close blueprint modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Dynamic Modal Content */}
        <div className="space-y-4">
          {/* Header Badges */}
          <div className="flex items-center gap-2 flex-wrap pr-10">
            <span
              className={`px-3 py-0.5 rounded-full ${data.statusColor} text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider`}
            >
              {data.status}
            </span>
            <span className="font-mono text-xs text-[#686660]">{data.period}</span>
          </div>

          {/* Cover Image Preview */}
          {data.coverUrl && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] shadow-inner my-2">
              <Image
                src={data.coverUrl}
                alt={data.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Title & Summary */}
          <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
            {data.title}
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#444748] leading-relaxed">
            {data.summary}
          </p>

          {/* Problem & Motivation Box */}
          <div className="bg-[#f5f2ea] p-4 rounded-xl space-y-1.5 shadow-xs border border-[#ded8cb]">
            <div className="font-mono text-[11px] text-[#2563eb] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {t("modalChallenges")}
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#222222] italic leading-relaxed">
              &ldquo;{data.problem}&rdquo;
            </p>
          </div>

          {/* Role & Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-[#f5f3ee] rounded-xl border border-[#ded8cb]">
              <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider">
                {t("modalRole")}
              </div>
              <div className="font-sans text-xs sm:text-sm text-[#222222] mt-1 font-medium">
                {data.role}
              </div>
            </div>
            <div className="p-3.5 bg-[#f5f3ee] rounded-xl border border-[#ded8cb]">
              <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider">
                {t("modalLessons")}
              </div>
              <div className="font-sans text-xs sm:text-sm text-[#222222] mt-1 font-medium">
                {data.lessons}
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="pt-2">
            <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider mb-2">
              {t("modalTech")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-[#f5f2ea] font-mono text-xs text-[#222222] border border-[#ded8cb]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer with Actions */}
          <div className="pt-4 border-t border-[#ded8cb] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-[#686660] tracking-wider uppercase font-bold">
              {t("modalSnapshot")}
            </span>
            <div className="flex items-center gap-2">
              {data.repoUrl && (
                <a
                  href={data.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Code</span>
                </a>
              )}
              {data.projectUrl && (
                <a
                  href={data.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563eb] text-white font-mono text-xs hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5"
                >
                  <span>Live</span>
                  <span className="text-[11px]">↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-all shadow-xs cursor-pointer"
              >
                {t("modalClose")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
