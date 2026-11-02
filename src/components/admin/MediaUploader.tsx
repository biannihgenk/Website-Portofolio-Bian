"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  recordMediaAssetAction,
  cleanOrphanStorageAction,
  uploadMediaAction,
} from "@/lib/actions/media";
import {
  PORTFOLIO_BUCKET,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  getStoragePublicUrl,
} from "@/lib/supabase/storage";

interface MediaUploaderProps {
  value: string | null;
  onChange: (path: string | null) => void;
  folder: "projects" | "achievements" | "education" | "gallery" | "blog" | "profiles" | "settings" | "general";
  prefix?: string;
  label?: string;
  aspectRatio?: "video" | "square" | "portrait";
  helperText?: string;
  description?: string;
}

export function MediaUploader({
  value,
  onChange,
  folder,
  prefix = "item",
  label = "Gambar / Media",
  aspectRatio = "video",
  helperText,
  description,
}: MediaUploaderProps) {
  const displayHelperText =
    description || helperText || "Maksimal 5 MB • Format JPEG, PNG, WebP, AVIF";
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const previewUrl = value ? getStoragePublicUrl(value) : null;

  const handleFile = async (file: File) => {
    // 1. Client-side MIME validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMsg(
        `Format '${file.type}' tidak didukung. Harap gunakan JPEG, PNG, WebP, atau AVIF.`
      );
      return;
    }

    // 2. Client-side size validation (5 MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(
        `Ukuran file (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal 5 MB.`
      );
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const cleanPrefix = prefix.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const storagePath = `${folder}/${cleanPrefix}-${Date.now()}-${randomSuffix}.${ext}`;

    try {
      // 3. Primary upload mechanism: Direct browser-to-Supabase Storage upload
      // Bypasses Next.js server action payload limits completely.
      const supabase = createClient();
      const { data: uploadData, error: storageError } = await supabase.storage
        .from(PORTFOLIO_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (!storageError && uploadData) {
        // Direct upload succeeded! Register metadata securely on server
        const metaRes = await recordMediaAssetAction({
          storagePath,
          originalFilename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          altText: `${prefix} media asset`,
        });

        if (metaRes.success) {
          onChange(storagePath);
        } else {
          // If metadata registration failed, clean up the storage object to avoid orphan files
          await cleanOrphanStorageAction(storagePath);
          setErrorMsg(metaRes.error || "Gagal mencatat metadata file media.");
        }
      } else {
        // Direct upload returned an error. Fall back to authorized server action
        console.warn(
          "Direct browser upload failed, attempting server action fallback:",
          storageError?.message
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("prefix", prefix);

        const res = await uploadMediaAction(formData);
        if (res.success && res.path) {
          onChange(res.path);
        } else {
          setErrorMsg(res.error || storageError?.message || "Gagal mengunggah file gambar ke storage.");
        }
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      // Fallback attempt via server action in case of unexpected browser-client error
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("prefix", prefix);

        const res = await uploadMediaAction(formData);
        if (res.success && res.path) {
          onChange(res.path);
        } else {
          setErrorMsg(res.error || (err instanceof Error ? err.message : "Terjadi kesalahan upload."));
        }
      } catch (fallbackErr: unknown) {
        setErrorMsg(
          fallbackErr instanceof Error
            ? fallbackErr.message
            : "Terjadi kesalahan saat memproses unggahan."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : "aspect-video";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {showManualInput ? "Sembunyikan Input Manual" : "Input URL / Path Manual"}
        </button>
      </div>

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 space-y-1.5">
          <span className="text-[11px] text-zinc-400 block">
            Path penyimpanan atau URL gambar eksternal:
          </span>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value.trim() || null)}
            placeholder={`${folder}/cover.webp atau https://...`}
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-2.5 text-xs text-rose-300">
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Preview or Drop Area */}
      {previewUrl ? (
        <div className="space-y-2">
          <div
            className={`relative w-full ${aspectClass} max-w-md rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden group`}
          >
            <Image
              src={previewUrl}
              alt="Pratinjau media"
              fill
              unoptimized
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Mengunggah berkas media...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between max-w-md text-xs">
            <span
              className="font-mono text-[11px] text-zinc-500 truncate max-w-[220px]"
              title={value || ""}
            >
              {value}
            </span>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium text-xs">
                <span>Ganti</span>
                <input
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                  }}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-zinc-600">•</span>
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={isUploading}
                className="text-rose-400 hover:text-rose-300 font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/60 p-6 text-center transition-colors hover:border-zinc-700 max-w-md ${
            isUploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
            disabled={isUploading}
            className="hidden"
          />
          <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-2">
            📷
          </div>
          <span className="text-xs font-semibold text-zinc-200">
            {isUploading ? "Mengunggah berkas media..." : "Pilih file atau seret ke sini"}
          </span>
          <span className="text-[11px] text-zinc-500 mt-1">{displayHelperText}</span>
        </label>
      )}
    </div>
  );
}
