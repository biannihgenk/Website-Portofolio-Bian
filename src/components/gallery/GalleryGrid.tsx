"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GalleryItemData } from "./GalleryLightboxModal";

interface GalleryGridProps {
  initialItems: GalleryItemData[];
  locale?: string;
  onOpenLightbox: (index: number) => void;
}

type ViewMode = "masonry" | "grid";

export function GalleryGrid({ initialItems, onOpenLightbox }: GalleryGridProps) {
  const t = useTranslations("galleryPage");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [cardFavorites, setCardFavorites] = useState<Record<string, boolean>>({});

  // Dynamic categories derived from actual CMS items
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    initialItems.forEach((item) => {
      const cat = (item.category || "activity").toLowerCase().trim();
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const list: Array<{ key: string; label: string; count: number }> = [
      { key: "all", label: t("filterAll"), count: initialItems.length },
    ];

    map.forEach((count, key) => {
      const match = initialItems.find((it) => (it.category || "").toLowerCase().trim() === key);
      const label = match?.categoryLabel || key.toUpperCase();
      list.push({ key, label, count });
    });

    return list;
  }, [initialItems, t]);

  // Filtered list of items
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return initialItems;
    return initialItems.filter((item) => (item.category || "").toLowerCase().trim() === activeFilter);
  }, [initialItems, activeFilter]);

  const toggleCardFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCardFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("bian_gallery_favorites", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="w-full">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* FILTER, CONTROLS & SCRAPBOOK COUNTER BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="bg-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-scrapbook border border-[#ded8cb] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Dynamic Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveFilter(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-xs ${
                    isActive
                      ? "bg-[#0b0c0c] text-white shadow-sm"
                      : "text-[#444748] hover:text-[#0b0c0c] hover:bg-[#f0eee8]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#f5f3ee] text-[#686660]"
                    }`}
                  >
                    {String(cat.count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Utility: View Toggles & Monospaced Stamp */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            <span className="hidden xl:inline-block font-mono text-[11px] text-[#686660] uppercase tracking-wider">
              {t("utilityStamp")}
            </span>

            {/* Layout Switcher Buttons */}
            <div className="flex items-center gap-1 bg-[#f5f3ee] p-1 rounded-full border border-[#ded8cb]">
              <button
                type="button"
                onClick={() => setViewMode("masonry")}
                className={`p-1.5 sm:p-2 rounded-full transition-all flex items-center justify-center ${
                  viewMode === "masonry"
                    ? "bg-white text-[#0b0c0c] shadow-xs font-bold"
                    : "text-[#686660] hover:text-[#0b0c0c]"
                }`}
                title={t("viewMasonry")}
                aria-label={t("viewMasonry")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 rounded-full transition-all flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-white text-[#0b0c0c] shadow-xs font-bold"
                    : "text-[#686660] hover:text-[#0b0c0c]"
                }`}
                title={t("viewGrid")}
                aria-label={t("viewGrid")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDITORIAL SCRAPBOOK GALLERY SHOWCASE GRID */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {initialItems.length === 0 ? (
          <div className="w-full py-16 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#f5f3ee] flex items-center justify-center text-[#2563eb]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#222222]">
              Album Masih Terbuka
            </h3>
            <p className="font-sans text-sm text-[#444748] max-w-md">
              {t("emptyState")}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="w-full py-12 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-3">
            <p className="font-sans text-sm text-[#686660]">{t("emptyState")}</p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="px-4 py-2 rounded-full bg-[#0b0c0c] text-white text-xs font-mono font-medium hover:bg-[#2563eb] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 lg:gap-8 auto-rows-max items-start transition-all duration-300 ${
              viewMode === "masonry"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {filteredItems.map((item, index) => {
              const globalIndex = initialItems.findIndex((it) => it.id === item.id);
              const isLargePortrait = viewMode === "masonry" && item.featured && index === 0;
              const isFav = !!cardFavorites[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenLightbox(globalIndex >= 0 ? globalIndex : index)}
                  className={`group relative bg-white p-3 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer border border-[#ded8cb] ${
                    isLargePortrait ? "md:row-span-2" : ""
                  } hover:-translate-y-1`}
                >
                  {/* Photo Frame Container */}
                  <div
                    className={`relative w-full overflow-hidden rounded-xl bg-[#f5f3ee] border border-[#ded8cb] ${
                      item.aspectRatio === "16/10"
                        ? "aspect-[16/10]"
                        : item.aspectRatio === "4/3"
                        ? "aspect-[4/3]"
                        : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={item.image_path}
                      alt={item.alt_text || item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Top Right Photo Stamp Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#0b0c0c]/70 backdrop-blur-xs text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>{t("photoBadge")}</span>
                    </div>

                    {/* Bottom Left Category Tag */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#bfdbfe]/95 text-[#1e40af] font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs border border-[#1e40af]/20">
                      {item.categoryLabel}
                    </div>

                    {/* Card Heart / Favorite Quick-Toggle */}
                    <button
                      type="button"
                      onClick={(e) => toggleCardFavorite(e, item.id)}
                      className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-90 ${
                        isFav ? "bg-white text-[#ba1a1a]" : "bg-black/40 text-white hover:bg-black/60"
                      }`}
                      title={isFav ? t("heartedReaction") : t("heartReaction")}
                      aria-label={t("heartReaction")}
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`}
                        viewBox="0 0 24 24"
                        fill={isFav ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Card Description & Information */}
                  <div className="pt-3 pb-1 px-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#0b0c0c] tracking-tight group-hover:text-[#2563eb] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <span className="font-mono text-[11px] text-[#686660] shrink-0">
                        {item.date}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#444748] mt-1 leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>

                    {/* Bottom Metadata & Expand Prompt */}
                    <div className="mt-3 pt-2.5 flex items-center justify-between font-mono text-[11px] text-[#686660] border-t border-[#f0eee8]">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{item.location}</span>
                      </span>

                      <span className="flex items-center gap-1 group-hover:text-[#0b0c0c] transition-colors font-medium">
                        <span>{t("openPhoto")}</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ITEM: Placeholder Scrapbook Note (Album Masih Terbuka) */}
            <div className="relative bg-[#f5f3ee] p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px] border border-dashed border-[#ded8cb] shadow-xs transform -rotate-1 hover:rotate-0 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2563eb] shadow-xs mb-3 border border-[#ded8cb]">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1e40af] px-3 py-0.5 rounded-full bg-[#bfdbfe] border border-[#1e40af]/20">
                {t("moreToComeTag")}
              </span>

              <h3 className="font-serif text-lg font-bold text-[#0b0c0c] mt-2.5">
                {t("moreToComeTitle")}
              </h3>

              <p className="font-sans text-xs text-[#444748] mt-1.5 max-w-xs leading-relaxed">
                {t("moreToComeDesc")}
              </p>

              <div className="mt-5 flex items-center gap-2 text-[#686660] font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-ping" />
                <span>{t("moreToComeStatus")}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
