import { z } from "zod";

/**
 * Shared validation schemas for CMS content.
 * Used by both admin forms and server-side mutation validation.
 */

/** Validates a URL-friendly slug */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens");

/** Validates a URL (for external links) */
export const urlSchema = z.string().url("Must be a valid URL").or(z.literal(""));

/** Content status */
export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

/** Project status */
export const projectStatusSchema = z.enum(["concept", "prototype", "in_development", "completed"]);

/** Education entry type */
export const educationEntryTypeSchema = z.enum(["education", "certificate", "training"]);

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────
export const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(100),
  nickname: z.string().max(50).nullable().optional(),
  headline: z.string().max(200).nullable().optional(),
  bio_id: z.string().max(2000).nullable().optional(),
  bio_en: z.string().max(2000).nullable().optional(),
  school: z.string().max(200).nullable().optional(),
  study_program: z.string().max(200).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  avatar_path: z.string().nullable().optional(),
  email_public: z.string().email().or(z.literal("")).nullable().optional(),
  github_url: urlSchema.nullable().optional(),
  linkedin_url: urlSchema.nullable().optional(),
  instagram_url: urlSchema.nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  random_facts: z.array(z.string()).nullable().optional(),
  character_notes: z.array(z.string()).nullable().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─────────────────────────────────────────────
// Project
// ─────────────────────────────────────────────
export const projectSchema = z.object({
  slug: slugSchema,
  title_id: z.string().min(1, "Indonesian title is required").max(200),
  title_en: z.string().min(1, "English title is required").max(200),
  summary_id: z.string().min(1, "Indonesian summary is required").max(500),
  summary_en: z.string().min(1, "English summary is required").max(500),
  description_id: z.string().max(5000).nullable().optional(),
  description_en: z.string().max(5000).nullable().optional(),
  cover_image_path: z.string().nullable().optional(),
  gallery_paths: z.array(z.string()).nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  project_url: urlSchema.nullable().optional(),
  repository_url: urlSchema.nullable().optional(),
  category: z.string().min(1, "Category is required").max(50),
  project_status: projectStatusSchema,
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: contentStatusSchema.default("draft"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─────────────────────────────────────────────
// Achievement
// ─────────────────────────────────────────────
export const achievementSchema = z.object({
  slug: slugSchema,
  title_id: z.string().min(1, "Indonesian title is required").max(200),
  title_en: z.string().min(1, "English title is required").max(200),
  description_id: z.string().max(2000).nullable().optional(),
  description_en: z.string().max(2000).nullable().optional(),
  organization: z.string().max(200).nullable().optional(),
  achievement_date: z.string().nullable().optional(),
  category: z.string().min(1, "Category is required").max(50),
  image_path: z.string().nullable().optional(),
  credential_url: urlSchema.nullable().optional(),
  sort_order: z.number().int().default(0),
  status: contentStatusSchema.default("draft"),
});

export type AchievementInput = z.infer<typeof achievementSchema>;

// ─────────────────────────────────────────────
// Education
// ─────────────────────────────────────────────
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200),
  program: z.string().max(200).nullable().optional(),
  description_id: z.string().max(2000).nullable().optional(),
  description_en: z.string().max(2000).nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  entry_type: educationEntryTypeSchema.default("education"),
  credential_url: urlSchema.nullable().optional(),
  image_path: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  status: contentStatusSchema.default("draft"),
});

export type EducationInput = z.infer<typeof educationSchema>;

// ─────────────────────────────────────────────
// Gallery Item
// ─────────────────────────────────────────────
export const galleryItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  caption_id: z.string().max(500).nullable().optional(),
  caption_en: z.string().max(500).nullable().optional(),
  image_path: z.string().min(1, "Image is required"),
  alt_text: z.string().min(1, "Alt text is required").max(300),
  category: z.string().min(1, "Category is required").max(50),
  captured_at: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: contentStatusSchema.default("draft"),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

// ─────────────────────────────────────────────
// Blog Post
// ─────────────────────────────────────────────
export const blogPostSchema = z.object({
  slug: slugSchema,
  title_id: z.string().min(1, "Indonesian title is required").max(200),
  title_en: z.string().min(1, "English title is required").max(200),
  excerpt_id: z.string().min(1, "Indonesian excerpt is required").max(500),
  excerpt_en: z.string().min(1, "English excerpt is required").max(500),
  content_id: z.string().max(50000).nullable().optional(),
  content_en: z.string().max(50000).nullable().optional(),
  cover_image_path: z.string().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  is_featured: z.boolean().default(false),
  reading_time_minutes: z.number().int().positive().nullable().optional(),
  seo_title_id: z.string().max(70).nullable().optional(),
  seo_title_en: z.string().max(70).nullable().optional(),
  seo_description_id: z.string().max(160).nullable().optional(),
  seo_description_en: z.string().max(160).nullable().optional(),
  status: contentStatusSchema.default("draft"),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ─────────────────────────────────────────────
// Blog Category
// ─────────────────────────────────────────────
export const blogCategorySchema = z.object({
  name_id: z.string().min(1, "Indonesian name is required").max(50),
  name_en: z.string().min(1, "English name is required").max(50),
  slug: slugSchema,
  sort_order: z.number().int().default(0),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;

// ─────────────────────────────────────────────
// Media Upload
// ─────────────────────────────────────────────
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const mediaUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, "File size must be less than 5MB")
    .refine(
      (file) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
      `File type must be one of: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    ),
  alt_text: z.string().max(300).optional(),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
