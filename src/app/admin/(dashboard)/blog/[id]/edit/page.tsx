import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminBlogPostById, getAdminBlogCategories } from "@/lib/content/queries";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

interface AdminEditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPostPage({
  params,
}: AdminEditBlogPostPageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getAdminBlogPostById(id),
    getAdminBlogCategories().catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
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
          <span className="text-xs text-zinc-300">Edit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Edit Artikel: {post.title_id}
        </h1>
        <p className="mt-1 text-xs text-zinc-400 font-mono">
          ID: {post.id} • Slug: /{post.slug}
        </p>
      </div>

      <BlogPostForm post={post} categories={categories} mode="edit" />
    </div>
  );
}
