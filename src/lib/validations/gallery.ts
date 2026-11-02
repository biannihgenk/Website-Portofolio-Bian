import { z } from "zod";

export const GALLERY_CATEGORIES = [
  "Photography",
  "Events & Conferences",
  "Activities",
  "Speaking",
  "Design & Creative",
  "General",
] as const;

export const galleryFormSchema = z.object({
  title: z.string().min(2, "Judul foto/karya wajib diisi").max(200),
  caption_id: z.string().optional().nullable(),
  caption_en: z.string().optional().nullable(),
  image_path: z.string().min(1, "File gambar wajib diunggah"),
  alt_text: z.string().min(2, "Teks alternatif (alt text) wajib diisi untuk aksesibilitas"),
  category: z.string().min(1, "Kategori wajib dipilih atau diisi"),
  captured_at: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]),
});

export type GalleryFormData = z.infer<typeof galleryFormSchema>;

export interface GalleryActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  galleryItemId?: string;
}
