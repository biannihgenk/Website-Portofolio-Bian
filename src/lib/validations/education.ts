import { z } from "zod";

export const EDUCATION_ENTRY_TYPES = [
  { value: "education", label: "Pendidikan Formal (Degree / School)" },
  { value: "certificate", label: "Sertifikasi Profesional" },
  { value: "training", label: "Pelatihan & Bootcamp" },
] as const;

export const educationFormSchema = z.object({
  institution: z.string().min(2, "Nama institusi wajib diisi").max(200),
  program: z.string().max(200).optional().nullable(),
  description_id: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  entry_type: z.enum(["education", "certificate", "training"]),
  credential_url: z
    .string()
    .url("URL kredensial tidak valid")
    .or(z.literal(""))
    .optional()
    .nullable(),
  image_path: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]),
});

export type EducationFormData = z.infer<typeof educationFormSchema>;

export interface EducationActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  educationId?: string;
}
