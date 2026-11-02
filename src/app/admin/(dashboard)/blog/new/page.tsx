import Link from "next/link";
import { getAdminBlogCategories } from "@/lib/content/queries";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const categories = await getAdminBlogCategories().catch(() => []);

  return (
    <div className="space-y-6 max-w-5xl">
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
          <span className="text-xs text-zinc-300">Baru</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Tulis Artikel Blog Baru
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Buat artikel bilingual dengan dukungan gambar sampul, tag, dan format markdown.
        </p>
      </div>

      <BlogPostForm categories={categories} mode="create" />
    </div>
  );
}
