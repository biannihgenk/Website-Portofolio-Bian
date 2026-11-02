import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/content/queries";
import { DEFAULT_SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");

  // Base public routes
  const staticRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/profile", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/projects", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/achievements", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/education", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/gallery", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // 1. Root redirect entry
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
    alternates: {
      languages: {
        id: `${baseUrl}/id`,
        en: `${baseUrl}/en`,
      },
    },
  });

  // 2. Static localized routes for both Indonesian and English
  for (const route of staticRoutes) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            id: `${baseUrl}/id${route.path}`,
            en: `${baseUrl}/en${route.path}`,
          },
        },
      });
    }
  }

  // 3. Published Blog Posts from Database
  try {
    const dbPosts = await getBlogPosts().catch(() => []);
    const allPosts = dbPosts;

    // Deduplicate by slug and verify published status
    const seenSlugs = new Set<string>();
    for (const post of allPosts) {
      if (!post.slug || seenSlugs.has(post.slug) || post.status !== "published") continue;
      seenSlugs.add(post.slug);

      const lastMod = post.published_at
        ? new Date(post.published_at)
        : new Date();

      for (const locale of ["id", "en"]) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.85,
          alternates: {
            languages: {
              id: `${baseUrl}/id/blog/${post.slug}`,
              en: `${baseUrl}/en/blog/${post.slug}`,
            },
          },
        });
      }
    }
  } catch (err) {
    console.error("Sitemap: Failed to query blog posts:", err);
  }

  return entries;
}
