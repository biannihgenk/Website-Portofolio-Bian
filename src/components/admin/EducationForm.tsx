"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Education } from "@/types/content";
import {
  EDUCATION_ENTRY_TYPES,
  type EducationActionState,
} from "@/lib/validations/education";
import { CONTENT_STATUS_OPTIONS } from "@/lib/validations/project";
import {
  createEducationAction,
  updateEducationAction,
} from "@/lib/actions/education";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface EducationFormProps {
  education?: Education | null;
  mode: "create" | "edit";
}

export function EducationForm({ education, mode }: EducationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [institution, setInstitution] = useState(education?.institution ?? "");
  const [program, setProgram] = useState(education?.program ?? "");
  const [entryType, setEntryType] = useState<string>(
    education?.entry_type ?? "education"
  );
  const [startDate, setStartDate] = useState(education?.start_date ?? "");
  const [endDate, setEndDate] = useState(education?.end_date ?? "");
  const [isCurrent, setIsCurrent] = useState(education?.is_current ?? false);
  const [descriptionId, setDescriptionId] = useState(
    education?.description_id ?? ""
  );
  const [descriptionEn, setDescriptionEn] = useState(
    education?.description_en ?? ""
  );
  const [credentialUrl, setCredentialUrl] = useState(
    education?.credential_url ?? ""
  );
  const [imagePath, setImagePath] = useState<string | null>(
    education?.image_path ?? null
  );
  const [sortOrder, setSortOrder] = useState<number>(education?.sort_order ?? 0);
  const [status, setStatus] = useState<string>(education?.status ?? "draft");

  const [actionState, setActionState] = useState<EducationActionState>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("institution", institution);
      formData.append("program", program);
      formData.append("entry_type", entryType);
      formData.append("start_date", startDate);
      formData.append("end_date", isCurrent ? "" : endDate);
      formData.append("is_current", isCurrent ? "true" : "false");
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("credential_url", credentialUrl);
      formData.append("image_path", imagePath || "");
      formData.append("sort_order", sortOrder.toString());
      formData.append("status", status);

      let res: EducationActionState;
      if (mode === "create") {
        res = await createEducationAction({}, formData);
      } else if (education?.id) {
        res = await updateEducationAction(education.id, {}, formData);
      } else {
        res = { success: false, message: "ID riwayat pendidikan tidak valid." };
      }

      setActionState(res);

      if (res.success) {
        router.push("/admin/education");
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

      {/* Basic Info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Informasi Institusi & Kualifikasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Nama Institusi / Penyelenggara <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Contoh: Universitas Gadjah Mada"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.institution && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.institution[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Program / Jurusan / Sertifikasi
            </label>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Contoh: Sarjana Teknik Informatika"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.program && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.program[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tipe Riwayat <span className="text-rose-400">*</span>
            </label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            >
              {EDUCATION_ENTRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              URL Kredensial / Bukti Digital
            </label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.credential_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.credential_url[0]}</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              disabled={isCurrent}
              value={isCurrent ? "" : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none disabled:opacity-40"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_current"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0"
              />
              <label htmlFor="is_current" className="text-xs text-zinc-400 cursor-pointer">
                Masih berlangsung / Aktif saat ini
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Deskripsi & Aktivitas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Deskripsi (Bahasa Indonesia)
            </label>
            <textarea
              rows={4}
              value={descriptionId}
              onChange={(e) => setDescriptionId(e.target.value)}
              placeholder="Fokus studi, mata kuliah utama, atau pencapaian kelulusan..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Deskripsi (English)
            </label>
            <textarea
              rows={4}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Study focus, major coursework, or graduation honors..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Logo / Image */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Logo Institusi / Dokumen
        </h3>
        <MediaUploader
          value={imagePath}
          onChange={(path) => setImagePath(path)}
          folder="education"
          label="Logo Institusi / Sertifikat Kelulusan"
          description="Format: JPG, PNG, WebP, AVIF. Maks 5 MB."
        />
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
          href="/admin/education"
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
            ? "Tambah Riwayat Pendidikan"
            : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
