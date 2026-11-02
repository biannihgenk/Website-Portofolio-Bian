"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface AchievementModalData {
  id: string;
  title: string;
  organization: string;
  category: string;
  date: string;
  description: string;
  credentialUrl?: string | null;
  imagePath?: string | null;
  credentialId?: string | null;
  tags?: string[];
  podiumRank?: string | null;
  badgeBg?: string;
}

interface CertificateLightboxModalProps {
  isOpen: boolean;
  data: AchievementModalData | null;
  onClose: () => void;
  locale?: string;
}

export function CertificateLightboxModal({
  isOpen,
  data,
  onClose,
}: CertificateLightboxModalProps) {
  const t = useTranslations("achievementsPage");

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c19]/55 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#ded8cb] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f0eee8] hover:bg-[#eae8e2] flex items-center justify-center text-[#222222] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          aria-label={t("closeModal")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="space-y-5">
          {/* Top Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap pr-10">
            <span className="px-3 py-0.5 rounded-full bg-[#dbeafe] text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider">
              {data.category}
            </span>
            <span className="font-mono text-xs text-[#686660] font-medium">
              {data.organization} • {data.date}
            </span>
            {data.podiumRank && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#f3b9a7] text-[#222222] font-mono text-[10px] font-bold uppercase tracking-wider">
                {data.podiumRank}
              </span>
            )}
          </div>

          {/* Certificate Frame Preview */}
          <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] p-4 flex flex-col justify-between shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f3b9a7]/20 via-transparent to-[#bfdbfe]/20 pointer-events-none" />

            {data.imagePath ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={data.imagePath}
                  alt={data.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            ) : (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-white/90 backdrop-blur-xs font-mono text-xs font-bold text-[#222222] uppercase border border-[#ded8cb]">
                    {data.organization}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2563eb] shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                  </div>
                </div>

                <div className="my-auto text-center px-4">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#222222] leading-snug">
                    {data.title}
                  </div>
                  {data.credentialId && (
                    <div className="font-mono text-xs text-[#686660] mt-1.5 font-medium">
                      No. Sertifikat: {data.credentialId}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between font-mono text-[11px] text-[#686660]">
                  <span>Status: Terverifikasi</span>
                  <span className="text-[#2563eb] font-bold">Resmi</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-2xl text-[#222222] font-bold mb-2">
              {data.title}
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#444748] leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-[#f5f2ea] font-mono text-xs text-[#686660] border border-[#ded8cb]"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Modal Footer with Verification Link & Close Button */}
          <div className="pt-4 border-t border-[#ded8cb] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-xs text-[#2563eb] font-bold flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>{t("verifiedPill")}</span>
            </span>

            <div className="flex items-center gap-2">
              {data.credentialUrl && (
                <a
                  href={data.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-mono text-xs hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>{t("verifyAction")}</span>
                  <span className="text-[11px]">↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-all shadow-xs"
              >
                {t("closeModal")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
