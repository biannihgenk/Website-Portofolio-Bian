import Link from "next/link";
import { getAdminBlogPosts, getAdminBlogCategories } from "@/lib/content/queries";
import { BlogPostListTable } from "@/components/admin/BlogPostListTable";
import type { BlogPost, BlogCategory } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  let posts: BlogPost[] = [];
  let categories: BlogCategory[] = [];
  let errorMsg: string | null = null;

  try {
    const [fetchedPosts, fetchedCategories] = await Promise.all([
      getAdminBlogPosts(),
      getAdminBlogCategories(),
    ]);
    posts = fetchedPosts;
    categories = fetchedCategories;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat artikel blog.";
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Blog</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Artikel & Catatan Blog
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Publikasikan artikel teknologi, wawasan rekayasa sistem, dan panduan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog/categories"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Kelola Kategori
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition-colors"
          >
            + Tulis Artikel
          </Link>
        </div>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Blog</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <BlogPostListTable initialPosts={posts} categories={categories} />
      )}
    </div>
  );
}
