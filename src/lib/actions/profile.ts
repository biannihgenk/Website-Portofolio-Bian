"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { profileFormSchema, type ProfileActionState } from "@/lib/validations/profile";

/**
 * Saves (inserts or updates) the single personal profile record in public.profiles.
 */
export async function saveProfileAction(
  prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const parseJsonArray = (val: FormDataEntryValue | null): string[] => {
    if (!val || typeof val !== "string" || !val.trim()) return [];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  };

  const raw = {
    full_name: (formData.get("full_name") as string)?.trim(),
    nickname: (formData.get("nickname") as string)?.trim() || null,
    headline: (formData.get("headline") as string)?.trim() || null,
    location: (formData.get("location") as string)?.trim() || null,
    email_public: (formData.get("email_public") as string)?.trim() || null,
    avatar_path: (formData.get("avatar_path") as string)?.trim() || null,
    school: (formData.get("school") as string)?.trim() || null,
    study_program: (formData.get("study_program") as string)?.trim() || null,
    github_url: (formData.get("github_url") as string)?.trim() || null,
    linkedin_url: (formData.get("linkedin_url") as string)?.trim() || null,
    instagram_url: (formData.get("instagram_url") as string)?.trim() || null,
    bio_id: (formData.get("bio_id") as string)?.trim() || null,
    bio_en: (formData.get("bio_en") as string)?.trim() || null,
    interests: parseJsonArray(formData.get("interests")),
    random_facts: parseJsonArray(formData.get("random_facts")),
    character_notes: parseJsonArray(formData.get("character_notes")),
  };

  const validation = profileFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) {
        fieldErrors[key] = issues;
      }
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Terdapat data yang tidak valid. Periksa kolom bertanda merah.",
    };
  }

  const data = validation.data;

  // Single profile check
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        nickname: data.nickname,
        headline: data.headline,
        bio_id: data.bio_id,
        bio_en: data.bio_en,
        school: data.school,
        study_program: data.study_program,
        location: data.location,
        avatar_path: data.avatar_path,
        email_public: data.email_public,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        instagram_url: data.instagram_url,
        interests: data.interests,
        random_facts: data.random_facts,
        character_notes: data.character_notes,
      })
      .eq("id", existing.id);

    if (updateError) {
      return { success: false, message: `Gagal memperbarui profil: ${updateError.message}` };
    }
  } else {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        full_name: data.full_name,
        nickname: data.nickname,
        headline: data.headline,
        bio_id: data.bio_id,
        bio_en: data.bio_en,
        school: data.school,
        study_program: data.study_program,
        location: data.location,
        avatar_path: data.avatar_path,
        email_public: data.email_public,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        instagram_url: data.instagram_url,
        interests: data.interests,
        random_facts: data.random_facts,
        character_notes: data.character_notes,
      });

    if (insertError) {
      return { success: false, message: `Gagal membuat profil: ${insertError.message}` };
    }
  }

  revalidatePath("/admin/profile");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    message: "Profil personal berhasil disimpan ke database.",
  };
}
