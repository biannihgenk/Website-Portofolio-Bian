import Link from "next/link";
import { getAdminBlogPosts } from "@/lib/content/queries";
import type { BlogPost } from "@/types/content";

export default async function AdminBlogPage() {
  let posts: BlogPost[] = [];
  let errorMsg = null;

  try {
    posts = await getAdminBlogPosts();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Database connection pending";
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Blog</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Blog Articles Management
        </h2>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-300">
          <p className="font-medium">Database Notice</p>
          <p className="mt-1 text-xs text-amber-400/80">{errorMsg}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="text-base font-semibold text-zinc-200">No Blog Posts Found</h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            The schema (`public.blog_posts` & `public.blog_categories`) and RLS policies are active.
            Rich article editing will be implemented in subsequent phases.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-sans font-medium text-zinc-200">{p.title_id}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-300">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.is_featured ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
