import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getClientEnv } from "@/lib/env";

export const PUBLIC_BUCKET_NAME = "portfolio-public";
export const PRIVATE_BUCKET_NAME = "portfolio-private";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates an image file before upload.
 * Rejects disallowed MIME types, oversized files, and unsafe extensions.
 */
export function validateImageFile(file: {
  name: string;
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      valid: false,
      error: `Unsupported format (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF.`,
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension .${extension}.`,
    };
  }

  return { valid: true };
}

/**
 * Generates a public URL for a file stored in the portfolio-public bucket.
 */
export function getPublicMediaUrl(storagePath: string): string {
  if (!storagePath) return "";
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  const env = getClientEnv();
  const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PUBLIC_BUCKET_NAME}/${cleanPath}`;
}

/**
 * Uploads a file to Supabase Storage and records metadata in media_assets table.
 * Admin only.
 */
export async function uploadMediaAsset(options: {
  file: File;
  folder?: string;
  altText?: string;
}) {
  await requireAdmin();
  const validation = validateImageFile(options.file);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed");
  }

  const supabase = await createClient();
  const extension = options.file.name.split(".").pop()?.toLowerCase();
  const uniqueId = crypto.randomUUID();
  const folder = options.folder ? `${options.folder.replace(/^\/|\/$/g, "")}/` : "";
  const storagePath = `${folder}${Date.now()}-${uniqueId}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PUBLIC_BUCKET_NAME)
    .upload(storagePath, options.file, {
      contentType: options.file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Record in media_assets table
  const { data: mediaRecord, error: dbError } = await supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      original_filename: options.file.name,
      mime_type: options.file.type,
      size_bytes: options.file.size,
      alt_text: options.altText || null,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt rollback from storage if DB insert fails
    await supabase.storage.from(PUBLIC_BUCKET_NAME).remove([storagePath]);
    throw new Error(`Failed to record media asset metadata: ${dbError.message}`);
  }

  return {
    ...mediaRecord,
    public_url: getPublicMediaUrl(storagePath),
  };
}

/**
 * Deletes a media asset from Supabase Storage and database.
 * Admin only.
 */
export async function deleteMediaAsset(id: string, storagePath: string) {
  await requireAdmin();
  const supabase = await createClient();

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(PUBLIC_BUCKET_NAME)
    .remove([storagePath]);

  if (storageError) {
    console.warn(`Storage delete warning for ${storagePath}:`, storageError.message);
  }

  // Delete from media_assets table
  const { error: dbError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw new Error(`Failed to delete media asset record: ${dbError.message}`);
  }

  return true;
}
