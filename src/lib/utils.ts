import { type ClassValue, clsx } from "clsx";

/**
 * Utility to merge class names conditionally.
 * Accepts strings, arrays, and objects.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generates a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Replace spaces with -
    .replace(/[^\w-]+/g, "")    // Remove non-word chars (except -)
    .replace(/--+/g, "-")       // Replace multiple - with single -
    .replace(/^-+/, "")         // Trim - from start
    .replace(/-+$/, "");        // Trim - from end
}

/**
 * Formats a date string according to the given locale.
 */
export function formatDate(
  dateString: string,
  locale: "id" | "en" = "id",
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncates text to a specified length, adding ellipsis if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Estimates reading time in minutes based on word count.
 * Uses an average of 200 words per minute.
 */
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
