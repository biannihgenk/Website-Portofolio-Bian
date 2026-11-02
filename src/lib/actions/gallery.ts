"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  galleryFormSchema,
  type GalleryActionState,
} from "@/lib/validations/gallery";
import { deleteMediaAction } from "@/lib/actions/media";

export async function createGalleryItemAction(
  prevState: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    title: (formData.get("title") as string)?.trim(),
    caption_id: (formData.get("caption_id") as string)?.trim() || null,
    caption_en: (formData.get("caption_en") as string)?.trim() || null,
    image_path: (formData.get("image_path") as string)?.trim(),
    alt_text: (formData.get("alt_text") as string)?.trim(),
    category: (formData.get("category") as string)?.trim(),
    captured_at: (formData.get("captured_at") as string)?.trim() || null,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = galleryFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data galeri tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;
  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error: insertError } = await supabase
    .from("gallery_items")
    .insert({
      title: data.title,
      caption_id: data.caption_id,
      caption_en: data.caption_en,
      image_path: data.image_path,
      alt_text: data.alt_text,
      category: data.category,
      captured_at: data.captured_at || null,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Gagal menyimpan: ${insertError.message}` };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    galleryItemId: inserted.id,
    message: "Foto/item galeri berhasil ditambahkan.",
  };
}

export async function updateGalleryItemAction(
  id: string,
  prevState: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    title: (formData.get("title") as string)?.trim(),
    caption_id: (formData.get("caption_id") as string)?.trim() || null,
    caption_en: (formData.get("caption_en") as string)?.trim() || null,
    image_path: (formData.get("image_path") as string)?.trim(),
    alt_text: (formData.get("alt_text") as string)?.trim(),
    category: (formData.get("category") as string)?.trim(),
    captured_at: (formData.get("captured_at") as string)?.trim() || null,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status") as string,
  };

  const validation = galleryFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data galeri tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  const { data: current } = await supabase
    .from("gallery_items")
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
    .from("gallery_items")
    .update({
      title: data.title,
      caption_id: data.caption_id,
      caption_en: data.caption_en,
      image_path: data.image_path,
      alt_text: data.alt_text,
      category: data.category,
      captured_at: data.captured_at || null,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      status: data.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    return { success: false, message: `Gagal memperbarui: ${updateError.message}` };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    galleryItemId: id,
    message: "Foto/item galeri berhasil diperbarui.",
  };
}

export async function deleteGalleryItemAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("gallery_items")
    .select("id, image_path")
    .eq("id", id)
    .single();

  if (!current) {
    return { success: false, error: "Data galeri tidak ditemukan." };
  }

  const { error: deleteError } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (current.image_path) {
    await deleteMediaAction(current.image_path).catch(() => {});
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}
