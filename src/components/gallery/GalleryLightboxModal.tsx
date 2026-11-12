"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface GalleryItemData {
  id: string;
  title: string;
  caption: string;
  image_path: string;
  alt_text: string;
  category: "everyday" | "school" | "events" | "bts";
  categoryLabel: string;
  date: string;
  location: string;
  aspectRatio?: string;
  featured?: boolean;
}

interface GalleryLightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItemData[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  locale?: string;
}

export function GalleryLightboxModal({
  isOpen,
  currentIndex,
  items,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxModalProps) {
  const t = useTranslations("galleryPage");
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("bian_gallery_favorites");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const item = items[currentIndex];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("bian_gallery_favorites", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleClose = useCallback(() => {
    setIsZoomed(false);
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        setIsZoomed(false);
        onPrev();
      } else if (e.key === "ArrowRight") {
        setIsZoomed(false);
        onNext();
      } else if (e.key === "z" || e.key === "Z" || e.key === "+") {
        setIsZoomed((prev) => !prev);
      }
    },
    [isOpen, handleClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const copyPhotoLink = () => {
    if (!item) return;
    try {
      navigator.clipboard.writeText(item.image_path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!isOpen || !item) return null;

  const isFavorited = !!favorites[item.id];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 bg-[#0b0c0c]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-[#ded8cb]">
        {/* Lightbox Header Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#f5f2ea] flex items-center justify-between border-b border-[#ded8cb] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-mono text-[11px] font-bold uppercase tracking-wider border border-[#1e40af]/20 shadow-xs">
              {item.categoryLabel}
            </span>
            <span className="font-mono text-xs text-[#686660]">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Favorite / Heart Button */}
            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                isFavorited
                  ? "bg-[#f3b9a7] text-[#ba1a1a]"
                  : "bg-white text-[#444748] hover:bg-[#f5f3ee]"
              }`}
              title={isFavorited ? t("heartedReaction") : t("heartReaction")}
              aria-label={t("heartReaction")}
            >
              <svg
                className={`w-4 h-4 transition-transform ${isFavorited ? "scale-110 fill-current" : ""}`}
                viewBox="0 0 24 24"
                fill={isFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Zoom toggle button */}
            <button
              type="button"
              onClick={() => setIsZoomed((prev) => !prev)}
              className="p-2 rounded-full bg-white text-[#1b1c19] hover:bg-[#f0eee8] transition-all shadow-xs flex items-center justify-center border border-[#ded8cb] cursor-pointer"
              title={isZoomed ? t("lightboxZoomOut") : t("lightboxZoom")}
              aria-label={t("lightboxZoom")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isZoomed ? (
                  <>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </>
                ) : (
                  <>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </>
                )}
              </svg>
            </button>

            {/* Prev button */}
            <button
              type="button"
              onClick={() => {
                setIsZoomed(false);
                onPrev();
              }}
              className="p-2 rounded-full bg-white text-[#1b1c19] hover:bg-[#0b0c0c] hover:text-white transition-all shadow-xs flex items-center justify-center border border-[#ded8cb] cursor-pointer"
              title={t("lightboxPrev")}
              aria-label={t("lightboxPrev")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={() => {
                setIsZoomed(false);
                onNext();
              }}
              className="p-2 rounded-full bg-white text-[#1b1c19] hover:bg-[#0b0c0c] hover:text-white transition-all shadow-xs flex items-center justify-center border border-[#ded8cb] cursor-pointer"
              title={t("lightboxNext")}
              aria-label={t("lightboxNext")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white text-[#1b1c19] hover:bg-[#ba1a1a] hover:text-white transition-all shadow-xs ml-1 border border-[#ded8cb] cursor-pointer"
              title={t("lightboxClose")}
              aria-label={t("lightboxClose")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lightbox Center Image Viewport */}
        <div className="relative flex-1 bg-[#121313] flex items-center justify-center overflow-auto min-h-[320px] max-h-[64vh] select-none p-2 sm:p-4">
          <div
            className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? "scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed((prev) => !prev)}
          >
            <Image
              src={item.image_path}
              alt={item.alt_text || item.title}
              width={1400}
              height={1000}
              unoptimized
              priority
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg pointer-events-none"
            />
          </div>

          {/* Prev/Next overlay hotzones on sides for mouse click */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
              onPrev();
            }}
            aria-label={t("lightboxPrev")}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-opacity shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
              onNext();
            }}
            aria-label={t("lightboxNext")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-opacity shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Lightbox Footer Bar with Narrative, Dates, and Link */}
        <div className="p-4 sm:px-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#ded8cb] shrink-0">
          <div className="max-w-2xl">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0b0c0c] tracking-tight">
              {item.title}
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#444748] mt-1 leading-relaxed">
              {item.caption}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-[#686660]">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {item.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {item.location}
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={copyPhotoLink}
              className="text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer"
              title="Copy photo URL"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copied ? "Tersalin!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
