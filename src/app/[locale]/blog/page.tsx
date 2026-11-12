import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  getProfile,
  getSiteSettings,
  getBlogPosts,
  getBlogCategories,
} from "@/lib/content/queries";
import type { SiteSetting, BlogPost, BlogCategory } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogDirectory } from "@/components/blog/BlogDirectory";
import { ContactSection } from "@/components/home/ContactSection";
import { TechStackMotionBar } from "@/components/home/TechStackMotionBar";

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

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";

  return buildPageMetadata({
    locale,
    path: "/blog",
    title: isId
      ? "Catatan dari Proses — Debian (Bian) Portfolio"
      : "Notes from the Process — Debian (Bian) Portfolio",
    description: isId
      ? "Dokumentasi proses belajar, eksplorasi infrastruktur jaringan TKJ SMK Telkom Malang, eksperimen koding, dan refleksi dari meja kerja Debian (Bian) Firwanto."
      : "Notes on learning, building things, vocational TKJ networking experiments at SMK Telkom Malang, and reflections behind the results by Debian (Bian) Firwanto.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [dbPosts, categories, profile, siteSettings] = await Promise.all([
    getBlogPosts().catch(() => [] as BlogPost[]),
    getBlogCategories().catch(() => [] as BlogCategory[]),
    getProfile().catch(() => null),
    getSiteSettings().catch(() => [] as SiteSetting[]),
  ]);

  // Only use authentic posts published in the database
  const posts: BlogPost[] = dbPosts;

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

  return (
    <div className="min-h-screen bg-transparent text-[#222222] font-sans antialiased relative selection:bg-[#dbeafe] selection:text-[#222222]">
      {/* GLOBAL TOP NAVIGATION */}
      <Navbar
        locale={locale}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        email={contactEmail}
      />

      <main className="w-full pt-20 sm:pt-24 bg-transparent overflow-x-clip min-h-screen">
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
          <div
            className="absolute bottom-10 right-10 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(191,219,254,0.24) 0%, rgba(191,219,254,0) 70%)",
            }}
          />

          {/* 1. DISTINCTIVE EDITORIAL HERO (Magazine Masthead Cover) */}
          <BlogHero />

          {/* 2. THE READING ROOM: CATEGORY FILTERS, SEARCH & CARD ARCHIVES */}
          <BlogDirectory
            posts={posts}
            categories={categories}
            locale={locale}
          />

          {/* Tech Stack Interactive Motion Ticker */}
          <TechStackMotionBar />

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
