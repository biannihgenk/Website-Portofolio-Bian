"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  projectFormSchema,
  type ProjectActionState,
} from "@/lib/validations/project";
import {
  PORTFOLIO_BUCKET,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  getStoragePublicUrl,
} from "@/lib/supabase/storage";

/**
 * Creates a new project in public.projects.
 * Server-enforced single-admin authorization with RLS.
 */
export async function createProjectAction(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await requireAdmin();
  const supabase = await createClient();

  // Extract raw form data
  const rawTechnologies = formData.get("technologies");
  let parsedTechnologies: string[] = [];
  if (typeof rawTechnologies === "string" && rawTechnologies.trim() !== "") {
    try {
      parsedTechnologies = JSON.parse(rawTechnologies);
    } catch {
      parsedTechnologies = rawTechnologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    summary_id: (formData.get("summary_id") as string)?.trim(),
    summary_en: (formData.get("summary_en") as string)?.trim(),
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    cover_image_path: (formData.get("cover_image_path") as string)?.trim() || null,
    category: (formData.get("category") as string)?.trim(),
    project_status: formData.get("project_status") as string,
    status: formData.get("status") as string,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    sort_order: formData.get("sort_order") || 0,
    technologies: parsedTechnologies,
    project_url: (formData.get("project_url") as string)?.trim() || null,
    repository_url: (formData.get("repository_url") as string)?.trim() || null,
  };

  const validation = projectFormSchema.safeParse(raw);
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
      message: "Terdapat data yang tidak valid. Periksa kolom yang ditandai merah.",
    };
  }

  const data = validation.data;

  // Enforce slug uniqueness
  const { data: existingSlug } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      errors: {
        slug: ["Slug ini sudah digunakan oleh proyek lain. Harap gunakan slug yang unik."],
      },
      message: `Slug '${data.slug}' sudah ada dalam database.`,
    };
  }

  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error: insertError } = await supabase
    .from("projects")
    .insert({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      summary_id: data.summary_id,
      summary_en: data.summary_en,
      description_id: data.description_id,
      description_en: data.description_en,
      cover_image_path: data.cover_image_path,
      category: data.category,
      project_status: data.project_status,
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      technologies: data.technologies,
      project_url: data.project_url,
      repository_url: data.repository_url,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      success: false,
      message: `Gagal menyimpan proyek: ${insertError.message}`,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    projectId: inserted.id,
    message: "Proyek berhasil ditambahkan ke database.",
  };
}

/**
 * Updates an existing project in public.projects.
 */
export async function updateProjectAction(
  id: string,
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const rawTechnologies = formData.get("technologies");
  let parsedTechnologies: string[] = [];
  if (typeof rawTechnologies === "string" && rawTechnologies.trim() !== "") {
    try {
      parsedTechnologies = JSON.parse(rawTechnologies);
    } catch {
      parsedTechnologies = rawTechnologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    title_id: (formData.get("title_id") as string)?.trim(),
    title_en: (formData.get("title_en") as string)?.trim(),
    summary_id: (formData.get("summary_id") as string)?.trim(),
    summary_en: (formData.get("summary_en") as string)?.trim(),
    description_id: (formData.get("description_id") as string)?.trim() || null,
    description_en: (formData.get("description_en") as string)?.trim() || null,
    cover_image_path: (formData.get("cover_image_path") as string)?.trim() || null,
    category: (formData.get("category") as string)?.trim(),
    project_status: formData.get("project_status") as string,
    status: formData.get("status") as string,
    is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    sort_order: formData.get("sort_order") || 0,
    technologies: parsedTechnologies,
    project_url: (formData.get("project_url") as string)?.trim() || null,
    repository_url: (formData.get("repository_url") as string)?.trim() || null,
  };

  const validation = projectFormSchema.safeParse(raw);
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
      message: "Terdapat data yang tidak valid. Periksa kolom yang ditandai merah.",
    };
  }

  const data = validation.data;

  // Ensure slug uniqueness against all OTHER projects
  const { data: existingSlug } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      errors: {
        slug: ["Slug ini sudah digunakan oleh proyek lain."],
      },
      message: `Slug '${data.slug}' bentrok dengan proyek lain.`,
    };
  }

  // Determine published_at
  const { data: currentProject } = await supabase
    .from("projects")
    .select("status, published_at")
    .eq("id", id)
    .single();

  let publishedAt = currentProject?.published_at;
  if (data.status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  } else if (data.status === "draft" && currentProject?.status !== "published") {
    publishedAt = null;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      slug: data.slug,
      title_id: data.title_id,
      title_en: data.title_en,
      summary_id: data.summary_id,
      summary_en: data.summary_en,
      description_id: data.description_id,
      description_en: data.description_en,
      cover_image_path: data.cover_image_path,
      category: data.category,
      project_status: data.project_status,
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      technologies: data.technologies,
      project_url: data.project_url,
      repository_url: data.repository_url,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    return {
      success: false,
      message: `Gagal memperbarui proyek: ${updateError.message}`,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    projectId: id,
    message: "Proyek berhasil diperbarui.",
  };
}

/**
 * Permanently deletes a project from public.projects.
 */
export async function deleteProjectAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, title_id, cover_image_path")
    .eq("id", id)
    .single();

  if (fetchError || !project) {
    return { success: false, error: "Proyek tidak ditemukan." };
  }

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}

/**
 * Uploads a project cover image to the portfolio-public Supabase Storage bucket.
 * Validates file type and 5MB limit, and records metadata in public.media_assets.
 */
export async function uploadProjectCoverAction(
  formData: FormData
): Promise<{ success: boolean; path?: string; publicUrl?: string; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  const slug = (formData.get("slug") as string)?.trim() || "project";

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "Tidak ada file gambar yang dipilih." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Tipe file '${file.type}' tidak didukung. Harap gunakan format JPEG, PNG, WebP, atau AVIF.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `Ukuran file melebihi batas 5MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  // Generate safe storage path
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const cleanSlug = slug.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const filename = `projects/${cleanSlug}-${Date.now()}.${ext}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Supabase Storage upload error: ${uploadError.message}`,
      };
    }

    // Register media asset record for traceability
    await supabase.from("media_assets").insert({
      storage_path: filename,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: `Cover image for ${slug}`,
    });

    const publicUrl = getStoragePublicUrl(filename);

    return {
      success: true,
      path: filename,
      publicUrl: publicUrl ?? filename,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal mengunggah gambar ke storage.",
    };
  }
}
