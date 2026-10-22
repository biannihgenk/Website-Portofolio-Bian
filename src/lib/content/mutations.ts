import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

type ContentStatus = "draft" | "published" | "archived";

/**
 * Common cache revalidation helper across locales.
 */
function revalidateContentPaths(section: string) {
  // Invalidate default and English localized routes
  revalidatePath(`/id/${section}`);
  revalidatePath(`/en/${section}`);
  revalidatePath(`/id`);
  revalidatePath(`/en`);
  revalidatePath(`/admin/${section}`);
  revalidatePath(`/admin`);
}

/**
 * Updates the publication status of a project.
 */
export async function updateProjectStatus(id: string, status: ContentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const updatePayload: { status: ContentStatus; published_at?: string | null } = { status };
  if (status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", id);

  if (error) throw new Error(`Failed to update project status: ${error.message}`);
  revalidateContentPaths("projects");
}

/**
 * Updates the publication status of a blog post.
 */
export async function updateBlogPostStatus(id: string, status: ContentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const updatePayload: { status: ContentStatus; published_at?: string | null } = { status };
  if (status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("blog_posts")
    .update(updatePayload)
    .eq("id", id);

  if (error) throw new Error(`Failed to update blog post status: ${error.message}`);
  revalidateContentPaths("blog");
}

/**
 * Updates the publication status of a gallery item.
 */
export async function updateGalleryItemStatus(id: string, status: ContentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery_items")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(`Failed to update gallery item status: ${error.message}`);
  revalidateContentPaths("gallery");
}

/**
 * Updates the publication status of an achievement.
 */
export async function updateAchievementStatus(id: string, status: ContentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("achievements")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(`Failed to update achievement status: ${error.message}`);
  revalidateContentPaths("achievements");
}

/**
 * Updates the publication status of an education entry.
 */
export async function updateEducationStatus(id: string, status: ContentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const updatePayload: { status: ContentStatus; published_at?: string | null } = { status };
  if (status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("education")
    .update(updatePayload)
    .eq("id", id);

  if (error) throw new Error(`Failed to update education status: ${error.message}`);
  revalidateContentPaths("education");
}
