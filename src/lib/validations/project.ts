import { z } from "zod";

export const PROJECT_STATUS_OPTIONS = [
  { value: "concept", label: "Concept" },
  { value: "prototype", label: "Prototype" },
  { value: "in_development", label: "In Development" },
  { value: "completed", label: "Completed" },
] as const;

export const CONTENT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
] as const;

export const COMMON_CATEGORIES = [
  "Web Development",
  "Mobile Application",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "UI/UX Design & Architecture",
  "Open Source",
  "Backend & API Engineering",
];

export const projectFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must not exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens (e.g., 'portfolio-web')"
    ),
  title_id: z.string().min(2, "Judul (ID) wajib diisi (minimal 2 karakter)").max(200),
  title_en: z.string().min(2, "Title (EN) is required (min 2 characters)").max(200),
  summary_id: z.string().min(5, "Ringkasan (ID) wajib diisi (minimal 5 karakter)").max(500),
  summary_en: z.string().min(5, "Summary (EN) is required (min 5 characters)").max(500),
  description_id: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  cover_image_path: z.string().optional().nullable(),
  category: z.string().min(2, "Kategori wajib dipilih atau diisi").max(100),
  project_status: z.enum(["concept", "prototype", "in_development", "completed"]),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  technologies: z.array(z.string()).default([]),
  project_url: z
    .string()
    .url("URL proyek tidak valid")
    .or(z.literal(""))
    .optional()
    .nullable(),
  repository_url: z
    .string()
    .url("URL repositori tidak valid")
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export interface ProjectActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  projectId?: string;
}
