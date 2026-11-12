"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import type { BlogPost } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

interface ArticleReadingModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onClose: () => void;
  locale: string;
}

export function ArticleReadingModal({
  isOpen,
  post,
  onClose,
  locale,
}: ArticleReadingModalProps) {
  const t = useTranslations("blogPage");
  const isId = locale === "id";

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

  if (!isOpen || !post) return null;

  const title = isId ? post.title_id : post.title_en;
  const excerpt = isId ? post.excerpt_id : post.excerpt_en;
  const rawContent = isId
    ? post.content_id || post.content_en || excerpt
    : post.content_en || post.content_id || excerpt;

  const resolvedCover = post.cover_image_path
    ? post.cover_image_path.startsWith("http")
      ? post.cover_image_path
      : getStoragePublicUrl(post.cover_image_path)
    : null;

  const categoryName = post.category
    ? isId
      ? post.category.name_id
      : post.category.name_en
    : "Catatan";

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isId ? "id-ID" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "2026";

  const paragraphs = (rawContent || "").split("\n\n").filter(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0c0c]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#ded8cb] overflow-hidden z-10 my-6 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="px-6 py-4 bg-[#f5f2ea]/90 backdrop-blur-md border-b border-[#ded8cb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#686660] font-bold">
              {t("modalHeader")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/blog/${post.slug}`}
              className="font-mono text-xs text-[#2563eb] hover:underline font-bold flex items-center gap-1"
            >
              <span>{isId ? "Buka Tab Penuh" : "Open Full Page"}</span>
              <span>↗</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#eae8e2] text-[#222222] flex items-center justify-center transition-colors shadow-xs border border-[#ded8cb] cursor-pointer"
              aria-label="Tutup Catatan"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
          {/* Cover Image */}
          {resolvedCover && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] shadow-inner">
              <Image
                src={resolvedCover}
                alt={title}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="font-mono text-[10px] uppercase px-3 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-bold shadow-xs">
                  {categoryName}
                </span>
              </div>
            </div>
          )}

          {/* Title & Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-[#686660] font-mono text-xs">
              <span className="text-[#222222] font-semibold">{dateStr}</span>
              <span>•</span>
              <span>{post.reading_time_minutes || 5} {t("minRead")}</span>
              <span>•</span>
              <span className="text-[#2563eb] font-semibold">Debian // SMK Telkom Malang</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold leading-snug">
              {title}
            </h2>
          </div>

          {/* Excerpt Highlight / Washi note */}
          <div className="bg-[#f5f2ea] p-4 sm:p-5 rounded-2xl border-l-4 border-[#2563eb] text-sm sm:text-base text-[#222222] font-serif italic leading-relaxed border border-[#ded8cb]">
            &ldquo;{excerpt}&rdquo;
          </div>

          {/* Main Body Text */}
          <div className="prose max-w-none text-xs sm:text-sm text-[#444748] leading-relaxed space-y-4 pt-2">
            {paragraphs.map((p, i) => {
              if (p.startsWith("## ")) {
                return (
                  <h3 key={i} className="font-serif text-lg sm:text-xl text-[#222222] font-bold mt-6 mb-2">
                    {p.replace("## ", "")}
                  </h3>
                );
              }
              if (p.startsWith("```")) {
                const cleaned = p.replace(/```[a-z]*\n?/g, "");
                return (
                  <div key={i} className="rounded-xl overflow-hidden bg-[#222222] text-[#fbf9f3] p-4 font-mono text-xs border border-[#3f1407]">
                    <div className="text-[#8a8989] pb-2 border-b border-white/10 flex items-center justify-between text-[11px]">
                      <span>terminal_session</span>
                      <span className="text-[#bfdbfe]">● running</span>
                    </div>
                    <pre className="mt-2 text-[#dbeafe] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                      {cleaned}
                    </pre>
                  </div>
                );
              }
              if (p.startsWith("> ")) {
                return (
                  <blockquote key={i} className="border-l-2 border-[#2563eb] pl-4 italic text-[#222222] font-serif my-4">
                    {p.replace("> ", "")}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {Array.isArray(post.tags) && (post.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#f0eee8]">
              {(post.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] text-[#2563eb]"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Author Signature & Dismiss */}
          <div className="pt-6 border-t border-[#ded8cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#bfdbfe] text-[#1e40af] flex items-center justify-center font-serif font-bold text-lg shadow-xs">
                B
              </div>
              <div>
                <p className="font-sans text-xs sm:text-sm font-bold text-[#222222]">
                  {t("modalAuthor")}
                </p>
                <p className="font-mono text-[11px] text-[#686660]">
                  {t("modalAuthorSub")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/blog/${post.slug}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs font-bold bg-[#f5f3ee] hover:bg-[#dbeafe] text-[#222222] border border-[#ded8cb] transition-colors"
              >
                <span>Halaman Artikel</span>
                <span>↗</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#222222] text-white px-5 py-2 rounded-full font-mono text-xs uppercase font-bold hover:bg-[#2563eb] transition-colors shadow-xs cursor-pointer"
              >
                <span>✓</span>
                <span>{t("modalDone")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
