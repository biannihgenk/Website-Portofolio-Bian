import { z } from "zod";

export const ACHIEVEMENT_CATEGORIES = [
  "Competition",
  "Certification",
  "Award & Honor",
  "Scholarship",
  "Hackathon",
  "Conference",
  "Open Source Contribution",
];

export const achievementFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"
    ),
  title_id: z.string().min(2, "Judul (ID) wajib diisi").max(200),
  title_en: z.string().min(2, "Title (EN) wajib diisi").max(200),
  description_id: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  organization: z.string().max(150).optional().nullable(),
  achievement_date: z.string().optional().nullable(),
  category: z.string().min(2, "Kategori wajib diisi").max(100),
  image_path: z.string().optional().nullable(),
  credential_url: z
    .string()
    .url("URL sertifikat/kredensial tidak valid")
    .or(z.literal(""))
    .optional()
    .nullable(),
  sort_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]),
});

export type AchievementFormData = z.infer<typeof achievementFormSchema>;

export interface AchievementActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  achievementId?: string;
}
