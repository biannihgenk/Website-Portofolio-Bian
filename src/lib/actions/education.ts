"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  educationFormSchema,
  type EducationActionState,
} from "@/lib/validations/education";
import { deleteMediaAction } from "@/lib/actions/media";

export async function createEducationAction(
  prevState: EducationActionState,
  formData: FormData
): Promise<EducationActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    institution: (formData.get("institution") as string)?.trim(),
    program: (formData.get("program") as string)?.trim() || null,
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    start_date: (formData.get("start_date") as string)?.trim() || null,
    end_date: (formData.get("end_date") as string)?.trim() || null,
    is_current: formData.get("is_current") === "true" || formData.get("is_current") === "on",
    entry_type: formData.get("entry_type") as string,
    credential_url: (formData.get("credential_url") as string)?.trim() || null,
    image_path: (formData.get("image_path") as string)?.trim() || null,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = educationFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data riwayat pendidikan tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;
  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error: insertError } = await supabase
    .from("education")
    .insert({
      institution: data.institution,
      program: data.program,
      description_id: data.description_id,
      description_en: data.description_en,
      start_date: data.start_date || null,
      end_date: data.is_current ? null : (data.end_date || null),
      is_current: data.is_current,
      entry_type: data.entry_type,
      credential_url: data.credential_url,
      image_path: data.image_path,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Gagal menyimpan: ${insertError.message}` };
  }

  revalidatePath("/admin/education");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    educationId: inserted.id,
    message: "Riwayat pendidikan berhasil ditambahkan.",
  };
}

export async function updateEducationAction(
  id: string,
  prevState: EducationActionState,
  formData: FormData
): Promise<EducationActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    institution: (formData.get("institution") as string)?.trim(),
    program: (formData.get("program") as string)?.trim() || null,
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    start_date: (formData.get("start_date") as string)?.trim() || null,
    end_date: (formData.get("end_date") as string)?.trim() || null,
    is_current: formData.get("is_current") === "true" || formData.get("is_current") === "on",
    entry_type: formData.get("entry_type") as string,
    credential_url: (formData.get("credential_url") as string)?.trim() || null,
    image_path: (formData.get("image_path") as string)?.trim() || null,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = educationFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data riwayat pendidikan tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  const { data: current } = await supabase
    .from("education")
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
    .from("education")
    .update({
      institution: data.institution,
      program: data.program,
      description_id: data.description_id,
      description_en: data.description_en,
      start_date: data.start_date || null,
      end_date: data.is_current ? null : (data.end_date || null),
      is_current: data.is_current,
      entry_type: data.entry_type,
      credential_url: data.credential_url,
      image_path: data.image_path,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    return { success: false, message: `Gagal memperbarui: ${updateError.message}` };
  }

  revalidatePath("/admin/education");
  revalidatePath(`/admin/education/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    educationId: id,
    message: "Riwayat pendidikan berhasil diperbarui.",
  };
}

export async function deleteEducationAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("education")
    .select("id, image_path")
    .eq("id", id)
    .single();

  if (!current) {
    return { success: false, error: "Data pendidikan tidak ditemukan." };
  }

  const { error: deleteError } = await supabase
    .from("education")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (current.image_path) {
    await deleteMediaAction(current.image_path).catch(() => {});
  }

  revalidatePath("/admin/education");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}
