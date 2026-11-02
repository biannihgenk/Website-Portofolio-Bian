import { z } from "zod";

export const profileFormSchema = z.object({
  full_name: z.string().min(2, "Nama lengkap wajib diisi (minimal 2 karakter)").max(100),
  nickname: z.string().max(50).optional().nullable(),
  headline: z.string().max(200).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  email_public: z.string().email("Format email tidak valid").or(z.literal("")).optional().nullable(),
  avatar_path: z.string().optional().nullable(),
  school: z.string().max(150).optional().nullable(),
  study_program: z.string().max(150).optional().nullable(),
  github_url: z.string().url("URL GitHub tidak valid").or(z.literal("")).optional().nullable(),
  linkedin_url: z.string().url("URL LinkedIn tidak valid").or(z.literal("")).optional().nullable(),
  instagram_url: z.string().url("URL Instagram tidak valid").or(z.literal("")).optional().nullable(),
  bio_id: z.string().optional().nullable(),
  bio_en: z.string().optional().nullable(),
  interests: z.array(z.string()).default([]),
  random_facts: z.array(z.string()).default([]),
  character_notes: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface ProfileActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}
