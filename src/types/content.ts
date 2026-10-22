import type { Database } from "./database.types";

/** Convenience type aliases for database tables */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type AchievementInsert = Database["public"]["Tables"]["achievements"]["Insert"];
export type AchievementUpdate = Database["public"]["Tables"]["achievements"]["Update"];

export type Education = Database["public"]["Tables"]["education"]["Row"];
export type EducationInsert = Database["public"]["Tables"]["education"]["Insert"];
export type EducationUpdate = Database["public"]["Tables"]["education"]["Update"];

export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];
export type GalleryItemInsert = Database["public"]["Tables"]["gallery_items"]["Insert"];
export type GalleryItemUpdate = Database["public"]["Tables"]["gallery_items"]["Update"];

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];

export type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];

export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];

/** Supported locales */
export type Locale = "id" | "en";

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
