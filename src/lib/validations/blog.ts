import { z } from "zod";

export const blogCategoryFormSchema = z.object({
  name_id: z.string().min(2, "Nama kategori (ID) wajib diisi").max(100),
  name_en: z.string().min(2, "Nama kategori (EN) wajib diisi").max(100),
  slug: z
    .string()
    .min(2, "Slug kategori wajib diisi")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)"),
  sort_order: z.coerce.number().int().default(0),
});

export type BlogCategoryFormData = z.infer<typeof blogCategoryFormSchema>;

export interface BlogCategoryActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  categoryId?: string;
}

export const blogPostFormSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug wajib diisi minimal 3 karakter")
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  title_id: z.string().min(3, "Judul artikel (ID) wajib diisi").max(250),
  title_en: z.string().min(3, "Judul artikel (EN) wajib diisi").max(250),
  excerpt_id: z.string().min(10, "Ringkasan (ID) wajib diisi minimal 10 karakter").max(500),
  excerpt_en: z.string().min(10, "Ringkasan (EN) wajib diisi minimal 10 karakter").max(500),
  content_id: z.string().optional().nullable(),
  content_en: z.string().optional().nullable(),
  cover_image_path: z.string().optional().nullable(),
  category_id: z.string().uuid("Kategori harus dipilih").optional().nullable(),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  reading_time_minutes: z.coerce.number().int().min(1).default(5),
  seo_title_id: z.string().max(250).optional().nullable(),
  seo_title_en: z.string().max(250).optional().nullable(),
  seo_description_id: z.string().max(350).optional().nullable(),
  seo_description_en: z.string().max(350).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export interface BlogPostActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  postId?: string;
}
