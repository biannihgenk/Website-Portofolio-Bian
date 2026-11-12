"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface EducationModalItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  description: string;
  reflection?: string;
  imagePath?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  codeSnippet?: string | null;
  tags?: string[];
  statusBadge?: string;
  statusColor?: string;
}

interface EducationDetailModalProps {
  isOpen: boolean;
  item: EducationModalItem | null;
  onClose: () => void;
}

export function EducationDetailModal({
  isOpen,
  item,
  onClose,
}: EducationDetailModalProps) {
  const t = useTranslations("educationPage");

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

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
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f0eee8] hover:bg-[#eae8e2] flex items-center justify-center text-[#222222] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer"
          aria-label={t("modalClose")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="space-y-5">
          {/* Header Badges */}
          <div className="flex items-center gap-2 flex-wrap pr-10">
            <span className={`px-3 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${item.statusColor || "bg-[#dbeafe] text-[#222222]"}`}>
              {item.statusBadge || item.category}
            </span>
            <span className="font-mono text-xs text-[#686660]">
              {item.subtitle} • {item.date}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#222222]">
              {item.title}
            </h3>
            {item.credentialId && (
              <p className="font-mono text-xs text-[#2563eb] font-semibold mt-1">
                Credential ID: {item.credentialId}
              </p>
            )}
          </div>

          {/* Optional Image Preview */}
          {item.imagePath && (
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb]">
              <Image
                src={item.imagePath}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}

          {/* Description */}
          <p className="font-sans text-sm sm:text-base text-[#444748] leading-relaxed">
            {item.description}
          </p>

          {/* Reflection Quote Box */}
          {item.reflection && (
            <div className="bg-[#f5f2ea] p-4 sm:p-5 rounded-2xl border border-[#ded8cb] shadow-xs">
              <div className="font-mono text-[11px] text-[#2563eb] uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <span>Catatan Pembelajaran &amp; Refleksi</span>
              </div>
              <p className="font-serif text-xs sm:text-sm text-[#222222] italic leading-relaxed">
                &ldquo;{item.reflection}&rdquo;
              </p>
            </div>
          )}

          {/* Terminal / Code Snippet if technical */}
          {item.codeSnippet && (
            <div className="rounded-xl overflow-hidden bg-[#222222] text-[#fbf9f3] p-4 font-mono text-xs border border-[#3f1407]">
              <div className="text-[#a8a6a0] pb-2 border-b border-white/10 flex items-center justify-between text-[11px]">
                <span>terminal_session.sh</span>
                <span className="text-[#bfdbfe]">● active</span>
              </div>
              <pre className="mt-2 text-[#dbeafe] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {item.codeSnippet}
              </pre>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-[#f5f2ea] font-mono text-xs text-[#686660] border border-[#ded8cb]"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#ded8cb] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-xs text-[#686660] font-medium">
              Dokumentasi Resmi Portofolio
            </span>

            <div className="flex items-center gap-2">
              {item.credentialUrl && (
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-mono text-xs hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Verifikasi Kredensial</span>
                  <span className="text-[11px]">↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-all shadow-xs cursor-pointer"
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
