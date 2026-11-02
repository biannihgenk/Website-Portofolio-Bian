import Link from "next/link";
import { getAdminBlogCategories } from "@/lib/content/queries";
import { BlogCategoryManager } from "@/components/admin/BlogCategoryManager";
import type { BlogCategory } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminBlogCategoriesPage() {
  let categories: BlogCategory[] = [];
  let errorMsg: string | null = null;

  try {
    categories = await getAdminBlogCategories();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat kategori blog.";
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <Link href="/admin/blog" className="text-xs text-zinc-500 hover:text-zinc-300">
            Blog
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Categories</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Kategori Artikel Blog
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Kelola taksonomi kategori untuk pengelompokan artikel dan topik publikasi.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Kategori</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <BlogCategoryManager initialCategories={categories} />
      )}
    </div>
  );
}
