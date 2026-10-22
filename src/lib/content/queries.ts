import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type {
  Profile,
  SiteSetting,
  Project,
  Achievement,
  Education,
  GalleryItem,
  BlogPost,
  BlogCategory,
  MediaAsset,
  PaginatedResponse,
} from "@/types/content";

// ─────────────────────────────────────────────
// PUBLIC READ QUERIES (Safe for anonymous visitors)
// ─────────────────────────────────────────────

/**
 * Fetches the public portfolio profile.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetches public site settings.
 */
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("is_public", true);

  if (error) {
    console.error("Error fetching site settings:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches published projects for the public site.
 */
export async function getProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching published projects:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches a single published project by its slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(`Error fetching project with slug "${slug}":`, error.message);
    return null;
  }
  return data;
}

/**
 * Fetches published achievements.
 */
export async function getAchievements(options?: {
  category?: string;
  limit?: number;
}): Promise<Achievement[]> {
  const supabase = await createClient();
  let query = supabase
    .from("achievements")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("achievement_date", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching published achievements:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches education history.
 */
export async function getEducation(): Promise<Education[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching education records:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches published gallery items.
 */
export async function getGalleryItems(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<GalleryItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching published gallery items:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches all blog categories.
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching blog categories:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches published blog posts.
 */
export async function getBlogPosts(options?: {
  categorySlug?: string;
  tag?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching published blog posts:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches a single published blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error.message);
    return null;
  }
  return data;
}

// ─────────────────────────────────────────────
// ADMIN QUERIES (Protected, includes drafts & archived)
// ─────────────────────────────────────────────

/**
 * Fetches all projects for the admin dashboard (draft, published, archived).
 */
export async function getAdminProjects(options?: {
  status?: "draft" | "published" | "archived";
}): Promise<Project[]> {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load admin projects: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches all blog posts for the admin dashboard.
 */
export async function getAdminBlogPosts(options?: {
  status?: "draft" | "published" | "archived";
}): Promise<BlogPost[]> {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load admin blog posts: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches all gallery items for the admin dashboard.
 */
export async function getAdminGalleryItems(options?: {
  status?: "draft" | "published" | "archived";
}): Promise<GalleryItem[]> {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load admin gallery items: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches all achievements for the admin dashboard.
 */
export async function getAdminAchievements(): Promise<Achievement[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load admin achievements: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches all education records for the admin dashboard.
 */
export async function getAdminEducation(): Promise<Education[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load admin education: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches paginated media assets for the admin media manager.
 */
export async function getAdminMediaAssets(options?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<MediaAsset>> {
  await requireAdmin();
  const supabase = await createClient();
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = options?.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, count, error } = await supabase
    .from("media_assets")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw new Error(`Failed to load media assets: ${error.message}`);

  const total = count ?? 0;
  return {
    data: data ?? [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Fetches summary counts across all content tables for the admin dashboard overview.
 */
export async function getAdminStats() {
  await requireAdmin();
  const supabase = await createClient();

  // Run in parallel for quick overview loading
  const [projectsRes, blogRes, galleryRes, achievementsRes, educationRes, mediaRes] =
    await Promise.all([
      supabase.from("projects").select("status", { count: "exact" }),
      supabase.from("blog_posts").select("status", { count: "exact" }),
      supabase.from("gallery_items").select("status", { count: "exact" }),
      supabase.from("achievements").select("status", { count: "exact" }),
      supabase.from("education").select("id", { count: "exact" }),
      supabase.from("media_assets").select("id", { count: "exact" }),
    ]);

  const countByStatus = (rows: { status?: string }[] | null) => {
    const counts = { published: 0, draft: 0, archived: 0, total: 0 };
    if (!rows) return counts;
    counts.total = rows.length;
    for (const r of rows) {
      if (r.status === "published") counts.published++;
      else if (r.status === "draft") counts.draft++;
      else if (r.status === "archived") counts.archived++;
    }
    return counts;
  };

  return {
    projects: countByStatus(projectsRes.data),
    blogPosts: countByStatus(blogRes.data),
    galleryItems: countByStatus(galleryRes.data),
    achievements: countByStatus(achievementsRes.data),
    educationCount: educationRes.count ?? 0,
    mediaAssetsCount: mediaRes.count ?? 0,
  };
}
