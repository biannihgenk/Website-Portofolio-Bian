"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  blogCategoryFormSchema,
  blogPostFormSchema,
  type BlogCategoryActionState,
  type BlogPostActionState,
} from "@/lib/validations/blog";
import { deleteMediaAction } from "@/lib/actions/media";

// ==========================================
// BLOG CATEGORIES ACTIONS
// ==========================================

export async function createBlogCategoryAction(
  prevState: BlogCategoryActionState,
  formData: FormData
): Promise<BlogCategoryActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    name_id: (formData.get("name_id") as string)?.trim(),
    name_en: (formData.get("name_en") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    sort_order: formData.get("sort_order") || 0,
  };

  const validation = blogCategoryFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data kategori tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  // Check unique slug
  const { data: existing } = await supabase
    .from("blog_categories")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug kategori ini sudah digunakan."] },
      message: "Slug kategori sudah digunakan.",
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("blog_categories")
    .insert(data)
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Gagal menyimpan kategori: ${insertError.message}` };
  }

  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    categoryId: inserted.id,
    message: "Kategori artikel berhasil dibuat.",
  };
}

export async function updateBlogCategoryAction(
  id: string,
  prevState: BlogCategoryActionState,
  formData: FormData
): Promise<BlogCategoryActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    name_id: (formData.get("name_id") as string)?.trim(),
    name_en: (formData.get("name_en") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    sort_order: formData.get("sort_order") || 0,
  };

  const validation = blogCategoryFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data kategori tidak valid.",
    };
  }

  const data = validation.data;

  // Check unique slug excluding current
  const { data: existing } = await supabase
    .from("blog_categories")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug kategori ini sudah digunakan oleh kategori lain."] },
      message: "Slug kategori sudah digunakan.",
    };
  }

  const { error: updateError } = await supabase
    .from("blog_categories")
    .update(data)
    .eq("id", id);

  if (updateError) {
    return { success: false, message: `Gagal memperbarui: ${updateError.message}` };
  }

  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    categoryId: id,
    message: "Kategori berhasil diperbarui.",
  };
}

export async function deleteBlogCategoryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  // Reassign posts using this category to null before deletion
  const { count } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    await supabase
      .from("blog_posts")
      .update({ category_id: null })
      .eq("category_id", id);
  }

  const { error: deleteError } = await supabase
    .from("blog_categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}

// ==========================================
// BLOG POSTS ACTIONS
// ==========================================

export async function createBlogPostAction(
  prevState: BlogPostActionState,
  formData: FormData
): Promise<BlogPostActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const tagsRaw = formData.get("tags") as string;
  let parsedTags: string[] = [];
  if (tagsRaw) {
    try {
      parsedTags = JSON.parse(tagsRaw);
    } catch {
      parsedTags = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    excerpt_id: (formData.get("excerpt_id") as string)?.trim(),
    excerpt_en: (formData.get("excerpt_en") as string)?.trim(),
    content_id: (formData.get("content_id") as string)?.trim() || null,
    content_en: (formData.get("content_en") as string)?.trim() || null,
    cover_image_path: (formData.get("cover_image_path") as string)?.trim() || null,
    category_id: (formData.get("category_id") as string)?.trim() || null,
    tags: parsedTags,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    reading_time_minutes: formData.get("reading_time_minutes") || 5,
    seo_title_id: (formData.get("seo_title_id") as string)?.trim() || null,
    seo_title_en: (formData.get("seo_title_en") as string)?.trim() || null,
    seo_description_id: (formData.get("seo_description_id") as string)?.trim() || null,
    seo_description_en: (formData.get("seo_description_en") as string)?.trim() || null,
    status: formData.get("status") as string,
  };

  const validation = blogPostFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data artikel tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  // Check unique slug
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug ini sudah digunakan artikel lain."] },
      message: "Slug artikel sudah digunakan. Pilih slug yang unik.",
    };
  }

  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error: insertError } = await supabase
    .from("blog_posts")
    .insert({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      excerpt_id: data.excerpt_id,
      excerpt_en: data.excerpt_en,
      content_id: data.content_id,
      content_en: data.content_en,
      cover_image_path: data.cover_image_path,
      category_id: data.category_id || null,
      tags: data.tags,
      is_featured: data.is_featured,
      reading_time_minutes: data.reading_time_minutes,
      seo_title_id: data.seo_title_id,
      seo_title_en: data.seo_title_en,
      seo_description_id: data.seo_description_id,
      seo_description_en: data.seo_description_en,
      status: data.status,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Gagal menyimpan artikel: ${insertError.message}` };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    postId: inserted.id,
    message: "Artikel blog berhasil dibuat.",
  };
}

export async function updateBlogPostAction(
  id: string,
  prevState: BlogPostActionState,
  formData: FormData
): Promise<BlogPostActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const tagsRaw = formData.get("tags") as string;
  let parsedTags: string[] = [];
  if (tagsRaw) {
    try {
      parsedTags = JSON.parse(tagsRaw);
    } catch {
      parsedTags = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    excerpt_id: (formData.get("excerpt_id") as string)?.trim(),
    excerpt_en: (formData.get("excerpt_en") as string)?.trim(),
    content_id: (formData.get("content_id") as string)?.trim() || null,
    content_en: (formData.get("content_en") as string)?.trim() || null,
    cover_image_path: (formData.get("cover_image_path") as string)?.trim() || null,
    category_id: (formData.get("category_id") as string)?.trim() || null,
    tags: parsedTags,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    reading_time_minutes: formData.get("reading_time_minutes") || 5,
    seo_title_id: (formData.get("seo_title_id") as string)?.trim() || null,
    seo_title_en: (formData.get("seo_title_en") as string)?.trim() || null,
    seo_description_id: (formData.get("seo_description_id") as string)?.trim() || null,
    seo_description_en: (formData.get("seo_description_en") as string)?.trim() || null,
    status: formData.get("status") as string,
  };

  const validation = blogPostFormSchema.safeParse(raw);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(validation.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) fieldErrors[key] = issues;
    }
    return {
      success: false,
      errors: fieldErrors,
      message: "Data artikel tidak valid. Periksa kolom yang ditandai.",
    };
  }

  const data = validation.data;

  // Check unique slug excluding current
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      errors: { slug: ["Slug ini sudah digunakan artikel lain."] },
      message: "Slug artikel sudah digunakan. Pilih slug yang unik.",
    };
  }

  const { data: current } = await supabase
    .from("blog_posts")
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
    .from("blog_posts")
    .update({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      excerpt_id: data.excerpt_id,
      excerpt_en: data.excerpt_en,
      content_id: data.content_id,
      content_en: data.content_en,
      cover_image_path: data.cover_image_path,
      category_id: data.category_id || null,
      tags: data.tags,
      is_featured: data.is_featured,
      reading_time_minutes: data.reading_time_minutes,
      seo_title_id: data.seo_title_id,
      seo_title_en: data.seo_title_en,
      seo_description_id: data.seo_description_id,
      seo_description_en: data.seo_description_en,
      status: data.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    return { success: false, message: `Gagal memperbarui: ${updateError.message}` };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    postId: id,
    message: "Artikel blog berhasil diperbarui.",
  };
}

export async function deleteBlogPostAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("blog_posts")
    .select("id, cover_image_path")
    .eq("id", id)
    .single();

  if (!current) {
    return { success: false, error: "Artikel blog tidak ditemukan." };
  }

  const { error: deleteError } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (current.cover_image_path) {
    await deleteMediaAction(current.cover_image_path).catch(() => {});
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}
