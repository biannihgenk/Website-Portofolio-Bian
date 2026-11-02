"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Achievement } from "@/types/content";
import {
  ACHIEVEMENT_CATEGORIES,
  type AchievementActionState,
} from "@/lib/validations/achievement";
import { CONTENT_STATUS_OPTIONS } from "@/lib/validations/project";
import {
  createAchievementAction,
  updateAchievementAction,
} from "@/lib/actions/achievements";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface AchievementFormProps {
  achievement?: Achievement | null;
  mode: "create" | "edit";
}

export function AchievementForm({ achievement, mode }: AchievementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [slug, setSlug] = useState(achievement?.slug ?? "");
  const [titleId, setTitleId] = useState(achievement?.title_id ?? "");
  const [titleEn, setTitleEn] = useState(achievement?.title_en ?? "");
  const [descriptionId, setDescriptionId] = useState(achievement?.description_id ?? "");
  const [descriptionEn, setDescriptionEn] = useState(achievement?.description_en ?? "");
  const [organization, setOrganization] = useState(achievement?.organization ?? "");
  const [achievementDate, setAchievementDate] = useState(achievement?.achievement_date ?? "");
  const [category, setCategory] = useState(achievement?.category ?? ACHIEVEMENT_CATEGORIES[0]);
  const [imagePath, setImagePath] = useState<string | null>(achievement?.image_path ?? null);
  const [credentialUrl, setCredentialUrl] = useState(achievement?.credential_url ?? "");
  const [sortOrder, setSortOrder] = useState<number>(achievement?.sort_order ?? 0);
  const [status, setStatus] = useState<string>(achievement?.status ?? "draft");

  const [actionState, setActionState] = useState<AchievementActionState>({});

  const handleGenerateSlug = () => {
    if (!titleId.trim()) return;
    const generated = titleId
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("title_id", titleId);
      formData.append("title_en", titleEn);
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("organization", organization);
      formData.append("achievement_date", achievementDate);
      formData.append("category", category);
      formData.append("image_path", imagePath || "");
      formData.append("credential_url", credentialUrl);
      formData.append("sort_order", sortOrder.toString());
      formData.append("status", status);

      let res: AchievementActionState;
      if (mode === "create") {
        res = await createAchievementAction({}, formData);
      } else if (achievement?.id) {
        res = await updateAchievementAction(achievement.id, {}, formData);
      } else {
        res = { success: false, message: "ID penghargaan tidak valid." };
      }

      setActionState(res);

      if (res.success) {
        router.push("/admin/achievements");
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

      {/* Main Info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Detail Penghargaan / Sertifikasi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Judul Penghargaan (ID) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleId}
              onChange={(e) => setTitleId(e.target.value)}
              placeholder="e.g. Juara 1 Hackathon Nasional"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title_id && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Award Title (EN) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. 1st Place National Hackathon"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title_en && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_en[0]}</p>
            )}
          </div>
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Slug <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
            >
              Generate dari Judul ID
            </button>
          </div>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            placeholder="juara-1-hackathon"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
          />
          {errors.slug && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.slug[0]}</p>
          )}
        </div>

        {/* Organization & Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Penyelenggara / Organisasi
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Google, Kemendikbud, dll."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tanggal Penghargaan
            </label>
            <input
              type="date"
              value={achievementDate}
              onChange={(e) => setAchievementDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Kategori <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ACHIEVEMENT_CATEGORIES.slice(0, 4).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className="rounded px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Credential URL */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            URL Sertifikat / Kredensial Digital <span className="text-zinc-500">(Opsional)</span>
          </label>
          <input
            type="url"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://coursera.org/verify/... atau https://badge..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
          />
          {errors.credential_url && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.credential_url[0]}</p>
          )}
        </div>
      </div>

      {/* Media Upload */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Foto Piagam / Sertifikat
          </h3>
        </div>
        <div className="max-w-xl">
          <MediaUploader
            value={imagePath}
            onChange={setImagePath}
            folder="achievements"
            prefix={slug || "award"}
            label="Foto Piagam / Lencana"
            aspectRatio="video"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Deskripsi Penghargaan (Bilingual)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Deskripsi (ID)
            </label>
            <textarea
              rows={4}
              value={descriptionId}
              onChange={(e) => setDescriptionId(e.target.value)}
              placeholder="Jelaskan signifikansi pencapaian ini..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description (EN)
            </label>
            <textarea
              rows={4}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Explain the significance of this achievement..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status & Sort */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              Urutan Prioritas (Sort Order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <Link
          href="/admin/achievements"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          ← Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : mode === "create" ? "Tambah Penghargaan" : "Perbarui Penghargaan"}
        </button>
      </div>
    </form>
  );
}
