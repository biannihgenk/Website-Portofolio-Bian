import { getClientEnv } from "@/lib/env";

export const PORTFOLIO_BUCKET = "portfolio-public";
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit per migration

/**
 * Returns the public CDN URL for an asset stored in the portfolio-public bucket.
 * Handles full URLs, relative paths, or nulls safely.
 */
export function getStoragePublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const env = getClientEnv();
  const cleanBase = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  // If path already includes bucket prefix, normalize
  if (cleanPath.startsWith(`${PORTFOLIO_BUCKET}/`)) {
    return `${cleanBase}/storage/v1/object/public/${cleanPath}`;
  }

  return `${cleanBase}/storage/v1/object/public/${PORTFOLIO_BUCKET}/${cleanPath}`;
}
