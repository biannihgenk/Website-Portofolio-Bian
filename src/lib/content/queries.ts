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
 * Fetches all projects for the admin dashboard with optional status, category, and search filters.
 */
export async function getAdminProjects(options?: {
  status?: "draft" | "published" | "archived" | "all";
  category?: string;
  search?: string;
}): Promise<Project[]> {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.search && options.search.trim() !== "") {
    const s = options.search.trim();
    query = query.or(`title_id.ilike.%${s}%,title_en.ilike.%${s}%,slug.ilike.%${s}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load admin projects: ${error.message}`);
  return data ?? [];
}

/**
 * Fetches a single project by ID for editing in the admin dashboard.
 */
export async function getAdminProjectById(id: string): Promise<Project | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load project: ${error.message}`);
  return data;
}

/**
 * Fetches distinct categories across all projects for filtering.
 */
export async function getDistinctProjectCategories(): Promise<string[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("category");

  if (error || !data) return [];
  const unique = Array.from(new Set(data.map((r) => r.category).filter(Boolean)));
  return unique.sort();
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

export interface TableStats {
  published: number;
  draft: number;
  archived: number;
  total: number;
}

export interface ModuleStatResult {
  stats: TableStats | null;
  error: string | null;
}

export interface CountStatResult {
  count: number | null;
  error: string | null;
}

export interface AdminStatsResponse {
  projects: ModuleStatResult;
  blogPosts: ModuleStatResult;
  galleryItems: ModuleStatResult;
  achievements: ModuleStatResult;
  education: CountStatResult;
  mediaAssets: CountStatResult;
}

export interface RecentContentItem {
  id: string;
  type: "project" | "blog" | "achievement";
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  href: string;
}

export interface RecentContentResponse {
  items: RecentContentItem[];
  error: string | null;
}

/**
 * Fetches summary counts across all content tables for the admin dashboard overview.
 * Does not fabricate counts: returns specific error states if any query fails.
 */
export async function getAdminStats(): Promise<AdminStatsResponse> {
  await requireAdmin();
  const supabase = await createClient();

  const [projectsRes, blogRes, galleryRes, achievementsRes, educationRes, mediaRes] =
    await Promise.all([
      supabase.from("projects").select("status"),
      supabase.from("blog_posts").select("status"),
      supabase.from("gallery_items").select("status"),
      supabase.from("achievements").select("status"),
      supabase.from("education").select("id", { count: "exact", head: true }),
      supabase.from("media_assets").select("id", { count: "exact", head: true }),
    ]);

  const parseModuleResult = (
    data: { status: string }[] | null,
    error: { message: string } | null
  ): ModuleStatResult => {
    if (error) {
      return { stats: null, error: error.message };
    }
    const rows = data ?? [];
    const stats: TableStats = { published: 0, draft: 0, archived: 0, total: rows.length };
    for (const r of rows) {
      if (r.status === "published") stats.published++;
      else if (r.status === "draft") stats.draft++;
      else if (r.status === "archived") stats.archived++;
    }
    return { stats, error: null };
  };

  const parseCountResult = (
    count: number | null,
    error: { message: string } | null
  ): CountStatResult => {
    if (error) {
      return { count: null, error: error.message };
    }
    return { count: count ?? 0, error: null };
  };

  return {
    projects: parseModuleResult(projectsRes.data, projectsRes.error),
    blogPosts: parseModuleResult(blogRes.data, blogRes.error),
    galleryItems: parseModuleResult(galleryRes.data, galleryRes.error),
    achievements: parseModuleResult(achievementsRes.data, achievementsRes.error),
    education: parseCountResult(educationRes.count, educationRes.error),
    mediaAssets: parseCountResult(mediaRes.count, mediaRes.error),
  };
}

/**
 * Fetches the most recent content records across projects, blog posts, and achievements.
 * Returns empty array if no records exist yet.
 */
export async function getAdminRecentContent(): Promise<RecentContentResponse> {
  await requireAdmin();
  const supabase = await createClient();

  try {
    const [projectsRes, blogRes, achievementsRes] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("blog_posts")
        .select("id, title_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("achievements")
        .select("id, title_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    const errors: string[] = [];
    if (projectsRes.error) errors.push(`Projects: ${projectsRes.error.message}`);
    if (blogRes.error) errors.push(`Blog: ${blogRes.error.message}`);
    if (achievementsRes.error) errors.push(`Achievements: ${achievementsRes.error.message}`);

    // If all failed, return top-level error
    if (errors.length === 3) {
      return { items: [], error: errors.join(" • ") };
    }

    const items: RecentContentItem[] = [];

    (projectsRes.data ?? []).forEach((p) => {
      items.push({
        id: p.id,
        type: "project",
        title: p.title_id,
        status: p.status as "draft" | "published" | "archived",
        createdAt: p.created_at,
        href: "/admin/projects",
      });
    });

    (blogRes.data ?? []).forEach((b) => {
      items.push({
        id: b.id,
        type: "blog",
        title: b.title_id,
        status: b.status as "draft" | "published" | "archived",
        createdAt: b.created_at,
        href: "/admin/blog",
      });
    });

    (achievementsRes.data ?? []).forEach((a) => {
      items.push({
        id: a.id,
        type: "achievement",
        title: a.title_id,
        status: a.status as "draft" | "published" | "archived",
        createdAt: a.created_at,
        href: "/admin/achievements",
      });
    });

    // Sort combined by created_at descending
    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      items: items.slice(0, 5),
      error: errors.length > 0 ? errors.join(" • ") : null,
    };
  } catch (err: unknown) {
    return {
      items: [],
      error: err instanceof Error ? err.message : "Failed to load recent content",
    };
  }
}

