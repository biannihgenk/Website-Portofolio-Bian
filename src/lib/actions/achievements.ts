"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  achievementFormSchema,
  type AchievementActionState,
} from "@/lib/validations/achievement";
import { deleteMediaAction } from "@/lib/actions/media";

export async function createAchievementAction(
  prevState: AchievementActionState,
  formData: FormData
): Promise<AchievementActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    organization: (formData.get("organization") as string)?.trim() || null,
    achievement_date: (formData.get("achievement_date") as string)?.trim() || null,
    category: (formData.get("category") as string)?.trim(),
    image_path: (formData.get("image_path") as string)?.trim() || null,
    credential_url: (formData.get("credential_url") as string)?.trim() || null,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = achievementFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data penghargaan tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  // Enforce slug uniqueness
  const { data: existing } = await supabase
    .from("achievements")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug ini sudah digunakan oleh penghargaan lain."] },
      message: `Slug '${data.slug}' sudah ada.`,
    };
  }

  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error: insertError } = await supabase
    .from("achievements")
    .insert({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      description_id: data.description_id,
      description_en: data.description_en,
      organization: data.organization,
      achievement_date: data.achievement_date || null,
      category: data.category,
      image_path: data.image_path,
      credential_url: data.credential_url,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Gagal menyimpan: ${insertError.message}` };
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    achievementId: inserted.id,
    message: "Penghargaan berhasil ditambahkan.",
  };
}

export async function updateAchievementAction(
  id: string,
  prevState: AchievementActionState,
  formData: FormData
): Promise<AchievementActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    organization: (formData.get("organization") as string)?.trim() || null,
    achievement_date: (formData.get("achievement_date") as string)?.trim() || null,
    category: (formData.get("category") as string)?.trim(),
    image_path: (formData.get("image_path") as string)?.trim() || null,
    credential_url: (formData.get("credential_url") as string)?.trim() || null,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = achievementFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data penghargaan tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  // Slug check excluding this item
  const { data: existing } = await supabase
    .from("achievements")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug ini sudah digunakan oleh penghargaan lain."] },
      message: `Slug '${data.slug}' bentrok dengan item lain.`,
    };
  }

  const { data: current } = await supabase
    .from("achievements")
    .select("status, published_at")
    .eq("id", id)
    .single();

  let publishedAt = current?.published_at;
  if (data.status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  } else if (data.status === "draft" && current?.status !== "published") {
    publishedAt = null;
  }

  const { error: updateError } = await supabase
    .from("achievements")
    .update({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      description_id: data.description_id,
      description_en: data.description_en,
      organization: data.organization,
      achievement_date: data.achievement_date || null,
      category: data.category,
      image_path: data.image_path,
      credential_url: data.credential_url,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    return { success: false, message: `Gagal memperbarui: ${updateError.message}` };
  }

  revalidatePath("/admin/achievements");
  revalidatePath(`/admin/achievements/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    achievementId: id,
    message: "Penghargaan berhasil diperbarui.",
  };
}

export async function deleteAchievementAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("achievements")
    .select("id, image_path")
    .eq("id", id)
    .single();

  if (!current) {
    return { success: false, error: "Data penghargaan tidak ditemukan." };
  }

  const { error: deleteError } = await supabase
    .from("achievements")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Attempt safe image cleanup if present
  if (current.image_path) {
    await deleteMediaAction(current.image_path).catch(() => {});
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}
