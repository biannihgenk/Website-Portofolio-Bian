"use client";

import React, { useState, useMemo } from "react";
import { GalleryHero } from "./GalleryHero";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryLightboxModal, GalleryItemData } from "./GalleryLightboxModal";
import { GalleryClosingSection } from "./GalleryClosingSection";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { GalleryItem } from "@/types/content";

interface GalleryContainerProps {
  locale: string;
  dbGalleryItems: GalleryItem[];
}

export function GalleryContainer({ locale, dbGalleryItems }: GalleryContainerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isEn = locale === "en";
  const isId = locale === "id";

  // Map real items from Supabase CMS
  const allItems: GalleryItemData[] = useMemo(() => {
    if (!dbGalleryItems || dbGalleryItems.length === 0) {
      return [];
    }

    return dbGalleryItems.map((dbItem, idx) => {
      const caption = isEn && dbItem.caption_en ? dbItem.caption_en : dbItem.caption_id || dbItem.title;
      const resolvedUrl = getStoragePublicUrl(dbItem.image_path) || dbItem.image_path;

      let categoryLabel = dbItem.category;
      const catLower = (dbItem.category || "").toLowerCase().trim();
      if (catLower === "activity") {
        categoryLabel = isId ? "Aktivitas Sekolah & Lab" : "School & Lab Activity";
      } else if (catLower === "project") {
        categoryLabel = isId ? "Arsitektur & Proyek" : "Projects & Architecture";
      }

      const dateStr = dbItem.published_at
        ? new Date(dbItem.published_at).toLocaleDateString(isId ? "id-ID" : "en-US", {
            month: "short",
            year: "numeric",
          })
        : "2026";

      return {
        id: dbItem.id,
        title: dbItem.title,
        caption,
        image_path: resolvedUrl,
        alt_text: dbItem.alt_text || dbItem.title,
        category: catLower as "everyday" | "school" | "events" | "bts",
        categoryLabel,
        date: dateStr,
        location: "SMK Telkom Malang",
        aspectRatio: dbItem.image_path.includes("bmc") ? "16/10" : idx === 0 ? "4/5" : "4/3",
        featured: dbItem.is_featured || idx === 0,
      };
    });
  }, [dbGalleryItems, isEn, isId]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev <= 0 ? allItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev >= allItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Hero Section */}
      <GalleryHero />

      {/* Grid Showcase */}
      <GalleryGrid
        initialItems={allItems}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Closing Section */}
      <GalleryClosingSection locale={locale} />

      {/* Interactive Lightbox Modal */}
      {allItems.length > 0 && (
        <GalleryLightboxModal
          isOpen={lightboxOpen}
          currentIndex={lightboxIndex}
          items={allItems}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          locale={locale}
        />
      )}
    </div>
  );
}
