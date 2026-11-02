"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryItem } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

interface GalleryScrapbookProps {
  galleryItems: GalleryItem[];
  locale: string;
}

// Curated authentic vocational & lab moments reference photos (strictly verified)
export const referencePhotos = [
  {
    title: "Moklet Mengajar to MTsN 2 Sidoarjo",
    sub: "Kegiatan Berbagi & Edukasi • 2024",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB7SNCmEF8Ndrbf-_ilT61vgXJ6ks7p2flZgkb9ghE5qAoKgMqwVRIpQwuTlRyhqbfkb7RnfIF9t_AqZCGFF_8J2oDqOiajmtG-FfJsmmT-T63oqXmi7WTAyMY8x0eq2FPUeQuy9hCPo52wYf6iLAg_Jq-3S1eK7VEHiqquGMQZYAqGTAKFvW66ZVBZaMMidJaIvBVIgCgEprgEFnRg2hvbCTp7-AWOv9pDUPJTJl26QpvkhrEyQpF",
    cols: "sm:col-span-1 lg:col-span-4",
    rotate: "rotate-[-1.5deg]",
    tapeColor: "bg-[#d9e8b8]/80",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Diskusi & Brainstorming Proyek Tim",
    sub: "Kolaborasi & Riset Arsitektur • 2024",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxgnvNpG2u5SXqyvHX9vGJz6IoB8YdEAuhkn3UknHeMhdXGtCAv_n-Dz-1Xpvq8qBOzy9bjtpCdb6OGqdqL2tSJ4gwSBNUEWD7GADgklEe3IMg5TgRu0IuQCGdq1IdSAebJ9tJrtlQtkAg9kZ50VygnDqQ2o6P1DJC9eGkjO6kvTpxw7rKqOIbWzTQmuNUKG0ForBom_9nB5QojIbyg0QO69xksvv3766hsDX8VyGZDm4eVRT9YyVK",
    cols: "sm:col-span-1 lg:col-span-4",
    rotate: "rotate-[1deg]",
    tapeColor: "bg-[#f3b9a7]/80",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Business Model Canvas — KontrolSehat",
    sub: "Perencanaan Produk Digital & Inovasi • 2024",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr_FUM27PxaOLM-gfYqL_RiMTeAWEC1pHn5jySH5Elllrn0tOWzHHooDiJUNlgaWI7YT2cnvgZsFq8mzckQ34Nq02iM0ybHFNHVjE7YqkZxz0yf6X_QVa9aaw1IBQ6O7TnISD5oVqILVf8Qm0LFaeXDMb_vhhNE-EoZobNhP3XUHA4oPQkNKTi2sUyyjJ4xfrjYU5ySuWpl9bKSLuZcaVBOVYb6YeNmOY5d02epgl2C2I22CTNgwKu",
    cols: "sm:col-span-2 lg:col-span-4",
    rotate: "rotate-[-0.5deg]",
    tapeColor: "bg-[#d4dec8]/80",
    aspect: "aspect-[4/3]",
  },
];

export function GalleryScrapbook({ galleryItems, locale }: GalleryScrapbookProps) {
  const t = useTranslations("gallery");
  const isId = locale === "id";

  // Only render cards from database if present; otherwise fallback to the 3 verified reference photos
  const tapeColors = ["bg-[#d9e8b8]/80", "bg-[#f3b9a7]/80", "bg-[#d4dec8]/80", "bg-[#bfdbfe]/80"];
  const rotations = ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-0.5deg]", "rotate-[1.5deg]"];

  const activeCards =
    galleryItems && galleryItems.length > 0
      ? galleryItems.map((supabaseItem, idx) => {
          const publicUrl = getStoragePublicUrl(supabaseItem.image_path);
          const title = supabaseItem.title;
          const sub = isId ? supabaseItem.caption_id : supabaseItem.caption_en;
          return {
            title: title || `Dokumentasi ${idx + 1}`,
            sub: sub || "SMK Telkom Malang",
            src: publicUrl || referencePhotos[idx % referencePhotos.length].src,
            cols: "sm:col-span-1 lg:col-span-4",
            rotate: rotations[idx % rotations.length],
            tapeColor: tapeColors[idx % tapeColors.length],
            aspect: "aspect-[4/3]",
          };
        })
      : referencePhotos;

  return (
    <section id="gallery" className="w-full py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-700 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#222222]">
            {t("title")}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6b6863] max-w-lg">
            {t("subtitle")}
          </p>
        </div>

        <a
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] shadow-xs transition-all whitespace-nowrap self-start md:self-auto font-bold"
        >
          <span>{isId ? "Buka Galeri Lengkap" : "Explore Gallery"}</span>
          <span className="text-blue-600">→</span>
        </a>
      </div>

      {/* Balanced 3-Column Scrapbook Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {activeCards.map((card, idx) => (
          <a
            key={idx}
            href={`/${locale}/gallery`}
            className={`${card.cols} block bg-white p-4 pb-6 rounded-2xl border border-[#ded8cb] shadow-scrapbook ${card.rotate} hover:rotate-0 transition-all duration-300 group hover:shadow-scrapbook-lg hover:z-20 relative hover:-translate-y-1`}
          >
            {/* Washi Tape */}
            <div
              className={`w-20 h-4.5 ${card.tapeColor} mx-auto -mt-6 mb-2 rounded-sm shadow-tape rotate-[-1deg] border-t border-b border-[#222222]/10 pointer-events-none`}
            />

            <div className={`${card.aspect} bg-[#f5f3ee] rounded-xl overflow-hidden relative border border-[#ded8cb]`}>
              <Image
                src={card.src}
                alt={card.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="pt-3">
              <p className="font-serif font-bold text-sm sm:text-base text-[#222222] group-hover:text-blue-600 transition-colors truncate">
                {card.title}
              </p>
              <p className="font-mono text-xs text-[#6b6863] truncate mt-0.5">
                {card.sub}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
