import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  getProfile,
  getSiteSettings,
  getBlogPosts,
  getBlogPostBySlug,
} from "@/lib/content/queries";
import type { SiteSetting, BlogPost } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleReadingView } from "@/components/blog/ArticleReadingView";
import { ContactSection } from "@/components/home/ContactSection";

interface GeneralSettingValue {
  site_name?: string;
  site_tagline?: string;
  contact_email?: string;
}

interface SocialsSettingValue {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

import { DEFAULT_SITE_URL, buildPageMetadata } from "@/lib/seo";
import { JsonLd, buildArticleJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isId = locale === "id";

  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post || post.status !== "published") {
    return {
      title: isId ? "Catatan Tidak Ditemukan" : "Note Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = isId ? post.seo_title_id || post.title_id : post.seo_title_en || post.title_en;
  const desc = isId ? post.seo_description_id || post.excerpt_id : post.seo_description_en || post.excerpt_en;

  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${title} — Debian (Bian) Notes`,
    description: desc,
    ogImage: post.cover_image_path || undefined,
    ogType: "article",
    publishedTime: post.published_at || undefined,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [dbPost, dbAllPosts, profile, siteSettings] = await Promise.all([
    getBlogPostBySlug(slug).catch(() => null),
    getBlogPosts().catch(() => [] as BlogPost[]),
    getProfile().catch(() => null),
    getSiteSettings().catch(() => [] as SiteSetting[]),
  ]);

  const post = dbPost;

  if (!post || post.status !== "published") {
    notFound();
  }

  const relatedPosts = dbAllPosts.filter((p) => p.status === "published" && p.slug !== slug);

  const generalSetting = siteSettings.find((s) => s.key === "general")?.value as
    | GeneralSettingValue
    | undefined;
  const socialsSetting = siteSettings.find((s) => s.key === "socials")?.value as
    | SocialsSettingValue
    | undefined;

  const displayName =
    profile?.full_name || generalSetting?.site_name || "Naufal Nizar De Bian Setyo Firwanto";
  const githubUrl =
    profile?.github_url || socialsSetting?.github || "https://github.com/biannihgenk";
  const linkedinUrl =
    profile?.linkedin_url ||
    socialsSetting?.linkedin ||
    "https://www.linkedin.com/in/debian-firwanto-49728635a/";
  const instagramUrl =
    profile?.instagram_url || socialsSetting?.instagram || "https://instagram.com";
  const contactEmail =
    profile?.email_public ||
    generalSetting?.contact_email ||
    "firwanto.debian@gmail.com";

  const isId = locale === "id";
  const siteUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const blogListUrl = `${siteUrl}/${locale}/blog`;

  const articleJsonLd = buildArticleJsonLd({
    title: isId ? post.title_id : post.title_en,
    description: isId ? post.excerpt_id : post.excerpt_en,
    url: articleUrl,
    imageUrl: post.cover_image_path,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    authorName: displayName,
    authorUrl: siteUrl,
    breadcrumbs: [
      { name: isId ? "Beranda" : "Home", url: `${siteUrl}/${locale}` },
      { name: isId ? "Catatan Proses" : "Process Notes", url: blogListUrl },
      { name: isId ? post.title_id : post.title_en, url: articleUrl },
    ],
  });

  return (
    <div className="min-h-screen bg-transparent text-[#222222] font-sans antialiased relative selection:bg-[#dbeafe] selection:text-[#222222]">
      {/* STRUCTURED DATA FOR SEARCH ENGINES */}
      <JsonLd data={articleJsonLd} />

      {/* GLOBAL TOP NAVIGATION */}
      <Navbar
        locale={locale}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        email={contactEmail}
      />

      <main className="w-full pt-20 sm:pt-24 bg-transparent min-h-screen">
        {/* Subtle Ambient Background Gradients */}
        <div className="w-full relative overflow-x-clip py-4 sm:py-6">
          <div
            className="absolute -top-24 -right-20 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(219,234,254,0.35) 0%, rgba(219,234,254,0) 70%)",
            }}
          />
          <div
            className="absolute top-1/3 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(243,185,167,0.22) 0%, rgba(243,185,167,0) 70%)",
            }}
          />

          {/* ARTICLE READING VIEW */}
          <ArticleReadingView
            post={post}
            relatedPosts={relatedPosts}
            locale={locale}
          />

          {/* Revamped Modern Get In Touch Section */}
          <ContactSection
            email={contactEmail}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            instagramUrl={instagramUrl}
          />
        </div>
      </main>

      {/* SHARED FOOTER */}
      <Footer
        displayName={displayName}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
      />
    </div>
  );
}
