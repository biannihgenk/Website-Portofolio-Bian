"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/types/content";
import {
  GALLERY_CATEGORIES,
  type GalleryActionState,
} from "@/lib/validations/gallery";
import { CONTENT_STATUS_OPTIONS } from "@/lib/validations/project";
import {
  createGalleryItemAction,
  updateGalleryItemAction,
} from "@/lib/actions/gallery";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface GalleryFormProps {
  item?: GalleryItem | null;
  mode: "create" | "edit";
}

export function GalleryForm({ item, mode }: GalleryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? GALLERY_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(
    item?.category
      ? !GALLERY_CATEGORIES.includes(item.category as (typeof GALLERY_CATEGORIES)[number])
      : false
  );
  const [imagePath, setImagePath] = useState<string | null>(item?.image_path ?? null);
  const [altText, setAltText] = useState(item?.alt_text ?? "");
  const [captionId, setCaptionId] = useState(item?.caption_id ?? "");
  const [captionEn, setCaptionEn] = useState(item?.caption_en ?? "");
  const [capturedAt, setCapturedAt] = useState(item?.captured_at ?? "");
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState<number>(item?.sort_order ?? 0);
  const [status, setStatus] = useState<string>(item?.status ?? "draft");

  const [actionState, setActionState] = useState<GalleryActionState>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const selectedCategory = isCustomCategory ? customCategory.trim() : category;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", selectedCategory);
      formData.append("image_path", imagePath || "");
      formData.append("alt_text", altText);
      formData.append("caption_id", captionId);
      formData.append("caption_en", captionEn);
      formData.append("captured_at", capturedAt);
      formData.append("is_featured", isFeatured ? "true" : "false");
      formData.append("sort_order", sortOrder.toString());
      formData.append("status", status);

      let res: GalleryActionState;
      if (mode === "create") {
        res = await createGalleryItemAction({}, formData);
      } else if (item?.id) {
        res = await updateGalleryItemAction(item.id, {}, formData);
      } else {
        res = { success: false, message: "ID item galeri tidak valid." };
      }

      setActionState(res);

      if (res.success) {
        router.push("/admin/gallery");
        router.refresh();
      }
    });
  };

  const errors = actionState.errors || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {actionState.message && !actionState.success && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          <p className="font-semibold text-rose-200">Perhatian</p>
          <p className="mt-0.5">{actionState.message}</p>
        </div>
      )}

      {/* Image Upload - Critical for Gallery */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Media Gambar <span className="text-rose-400">*</span>
        </h3>
        <MediaUploader
          value={imagePath}
          onChange={(path) => setImagePath(path)}
          folder="gallery"
          label="Foto Utama Galeri"
          description="Pilih foto berkualitas tinggi. Format: JPG, PNG, WebP, AVIF. Maks 5 MB."
        />
        {errors.image_path && (
          <p className="text-[11px] text-rose-400">{errors.image_path[0]}</p>
        )}

        <div className="pt-2">
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Alt Text (Deskripsi Aksesibilitas Gambar) <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Contoh: Suasana sesi presentasi technical workshop di hadapan 50 mahasiswa"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
          {errors.alt_text && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.alt_text[0]}</p>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Informasi & Kategori
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Judul Karya / Momen <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pembicara Google I/O Extended 2024"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Kategori <span className="text-rose-400">*</span>
            </label>
            {!isCustomCategory ? (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                >
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__custom__">+ Kategori Kustom...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ketik kategori baru..."
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Pilihan
                </button>
              </div>
            )}
            {errors.category && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.category[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tanggal Diambil / Terjadi
            </label>
            <input
              type="date"
              value={capturedAt}
              onChange={(e) => setCapturedAt(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0"
            />
            <label htmlFor="is_featured" className="text-xs text-zinc-300 cursor-pointer">
              Sorot foto ini sebagai <span className="font-semibold text-amber-300">Featured</span> di galeri publik
            </label>
          </div>
        </div>
      </div>

      {/* Captions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Takarir (Caption)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Caption (Bahasa Indonesia)
            </label>
            <textarea
              rows={3}
              value={captionId}
              onChange={(e) => setCaptionId(e.target.value)}
              placeholder="Ceritakan momen di balik foto ini..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Caption (English)
            </label>
            <textarea
              rows={3}
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              placeholder="Tell the story behind this moment..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visibility & Ordering */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Publikasi & Urutan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Status Publikasi
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            >
              {CONTENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Urutan Tampilan (Sort Order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-zinc-500">Angka lebih kecil tampil lebih awal.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Link
          href="/admin/gallery"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
        >
          {isPending
            ? "Menyimpan..."
            : mode === "create"
            ? "Tambah Foto Galeri"
            : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
