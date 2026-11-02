"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  PORTFOLIO_BUCKET,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  getStoragePublicUrl,
} from "@/lib/supabase/storage";

export interface UploadMediaResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

export interface RecordMediaAssetParams {
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
}

const ALLOWED_FOLDERS = [
  "projects",
  "achievements",
  "education",
  "gallery",
  "blog",
  "profiles",
  "settings",
  "general",
];

/**
 * Records an uploaded media file's metadata into public.media_assets.
 * Used after a direct browser-to-Supabase Storage upload completes.
 * Strictly verifies admin authorization and validates metadata.
 */
export async function recordMediaAssetAction(
  params: RecordMediaAssetParams
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { storagePath, originalFilename, mimeType, sizeBytes, altText } = params;

  if (!storagePath || typeof storagePath !== "string") {
    return { success: false, error: "Storage path tidak valid." };
  }

  const folder = storagePath.split("/")[0];
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return { success: false, error: `Direktori '${folder}' tidak diizinkan.` };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return {
      success: false,
      error: `Format '${mimeType}' tidak didukung. Hanya JPEG, PNG, WebP, dan AVIF yang diizinkan.`,
    };
  }

  if (sizeBytes > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `Ukuran file (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB) melebihi batas 5 MB.`,
    };
  }

  const { error: insertError } = await supabase.from("media_assets").upsert(
    {
      storage_path: storagePath,
      original_filename: originalFilename.slice(0, 255),
      mime_type: mimeType,
      size_bytes: sizeBytes,
      alt_text: altText?.slice(0, 255) || null,
    },
    { onConflict: "storage_path" }
  );

  if (insertError) {
    return {
      success: false,
      error: `Gagal mencatat metadata media: ${insertError.message}`,
    };
  }

  revalidatePath("/admin/media");
  return { success: true };
}

/**
 * Cleans up an orphaned storage object if form submission or metadata registration fails.
 */
export async function cleanOrphanStorageAction(storagePath: string): Promise<void> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    await supabase.storage.from(PORTFOLIO_BUCKET).remove([storagePath]);
  } catch (err: unknown) {
    console.error("Failed to remove orphan storage object:", err);
  }
}

/**
 * Universal media upload action for Supabase Storage bucket 'portfolio-public'.
 * Serves as fallback or server-side upload mechanism.
 * Strictly enforces server-side admin authorization and limits.
 */
export async function uploadMediaAction(formData: FormData): Promise<UploadMediaResult> {
  await requireAdmin();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string)?.trim().replace(/^\//, "") || "uploads";
  const prefix = (formData.get("prefix") as string)?.trim() || "asset";

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "Tidak ada file gambar yang dipilih." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Format file '${file.type}' tidak didukung. Hanya JPEG, PNG, WebP, dan AVIF yang diizinkan.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `Ukuran file (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal 5 MB.`,
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const cleanPrefix = prefix.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const storagePath = `${folder}/${cleanPrefix}-${Date.now()}.${ext}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Supabase Storage upload error: ${uploadError.message}`,
      };
    }

    // Register asset in public.media_assets table
    await supabase.from("media_assets").upsert(
      {
        storage_path: storagePath,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text: `${prefix} media asset`,
      },
      { onConflict: "storage_path" }
    );

    const publicUrl = getStoragePublicUrl(storagePath);

    revalidatePath("/admin/media");

    return {
      success: true,
      path: storagePath,
      publicUrl: publicUrl ?? storagePath,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah gambar.",
    };
  }
}

/**
 * Safely deletes a media file from Supabase Storage and media_assets.
 * Verifies that the file is not still in use by any content table.
 */
export async function deleteMediaAction(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  if (!storagePath) {
    return { success: false, error: "Storage path tidak valid." };
  }

  // 1. Check if referenced by projects
  const { data: projectRef } = await supabase
    .from("projects")
    .select("id, title_id")
    .eq("cover_image_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (projectRef) {
    return {
      success: false,
      error: `Gambar tidak dapat dihapus karena masih digunakan sebagai cover proyek '${projectRef.title_id}'.`,
    };
  }

  // 2. Check if referenced by achievements
  const { data: achRef } = await supabase
    .from("achievements")
    .select("id, title_id")
    .eq("image_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (achRef) {
    return {
      success: false,
      error: `Gambar masih digunakan pada sertifikat '${achRef.title_id}'.`,
    };
  }

  // 3. Check if referenced by education
  const { data: eduRef } = await supabase
    .from("education")
    .select("id, institution")
    .eq("image_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (eduRef) {
    return {
      success: false,
      error: `Gambar masih digunakan pada riwayat pendidikan '${eduRef.institution}'.`,
    };
  }

  // 4. Check if referenced by gallery
  const { data: galRef } = await supabase
    .from("gallery_items")
    .select("id, title")
    .eq("image_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (galRef) {
    return {
      success: false,
      error: `Gambar masih digunakan di galeri '${galRef.title}'.`,
    };
  }

  // 5. Check if referenced by blog posts
  const { data: blogRef } = await supabase
    .from("blog_posts")
    .select("id, title_id")
    .eq("cover_image_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (blogRef) {
    return {
      success: false,
      error: `Gambar masih digunakan sebagai cover artikel blog '${blogRef.title_id}'.`,
    };
  }

  // 6. Check if referenced by profile avatar
  const { data: profileRef } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("avatar_path", storagePath)
    .limit(1)
    .maybeSingle();

  if (profileRef) {
    return {
      success: false,
      error: `Gambar masih digunakan sebagai foto avatar profil '${profileRef.full_name}'.`,
    };
  }

  // Safe to delete from storage
  const { error: storageError } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    return { success: false, error: storageError.message };
  }

  // Remove from media_assets
  await supabase.from("media_assets").delete().eq("storage_path", storagePath);

  revalidatePath("/admin/media");

  return { success: true };
}
