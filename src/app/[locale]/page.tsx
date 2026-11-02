import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  getProfile,
  getProjects,
  getAchievements,
  getEducation,
  getGalleryItems,
  getBlogPosts,
  getSiteSettings,
} from "@/lib/content/queries";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { buildPageMetadata, DEFAULT_SITE_URL } from "@/lib/seo";
import { JsonLd, buildPersonJsonLd } from "@/components/seo/JsonLd";
import type {
  Project,
  Achievement,
  Education,
  GalleryItem,
  BlogPost,
  SiteSetting,
} from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { KineticCanvasStage } from "@/components/home/KineticCanvasStage";
import { TechStackMotionBar } from "@/components/home/TechStackMotionBar";
import { EditorialHero } from "@/components/home/EditorialHero";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ExploringFocus } from "@/components/home/ExploringFocus";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Milestones } from "@/components/home/Milestones";
import { EducationSection } from "@/components/home/EducationSection";
import { GalleryScrapbook } from "@/components/home/GalleryScrapbook";
import { BlogNotebook } from "@/components/home/BlogNotebook";
import { ContactSection } from "@/components/home/ContactSection";

interface GeneralSettingValue {
  site_name?: string;
  site_tagline?: string;
  contact_email?: string;
  available_for_hire?: boolean;
}

interface SocialsSettingValue {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";

  return buildPageMetadata({
    title: isId
      ? "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer | SMK Telkom Malang"
      : "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer | SMK Telkom Malang",
    description: isId
      ? "Portofolio resmi dan jurnal rekayasa Naufal Nizar De Bian Setyo Firwanto (Debian Firwanto). Siswa TKJ SMK Telkom Malang berfokus pada Modern Web Development (Next.js, TypeScript) dan Network Infrastructure (MikroTik RouterOS, Cisco, Linux Debian SysAdmin)."
      : "Official portfolio and engineering journal of Naufal Nizar De Bian Setyo Firwanto (Debian Firwanto). Vocational TKJ student at SMK Telkom Malang focusing on Modern Web (Next.js, TypeScript) and Network Infrastructure (MikroTik RouterOS, Cisco, Debian Linux SysAdmin).",
    locale,
    path: "/",
    ogType: "profile",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isId = locale === "id";

  // Safely fetch published content from Supabase
  const [profile, projects, achievements, educationList, gallery, posts, siteSettings] =
    await Promise.all([
      getProfile().catch(() => null),
      getProjects({ limit: 6 }).catch(() => [] as Project[]),
      getAchievements({ limit: 6 }).catch(() => [] as Achievement[]),
      getEducation().catch(() => [] as Education[]),
      getGalleryItems({ limit: 8 }).catch(() => [] as GalleryItem[]),
      getBlogPosts({ limit: 4 }).catch(() => [] as BlogPost[]),
      getSiteSettings().catch(() => [] as SiteSetting[]),
    ]);

  const generalSetting = siteSettings.find((s) => s.key === "general")?.value as
    | GeneralSettingValue
    | undefined;
  const socialsSetting = siteSettings.find((s) => s.key === "socials")?.value as
    | SocialsSettingValue
    | undefined;

  const displayName =
    profile?.full_name || generalSetting?.site_name || "Debian Firwanto";
  const bio = isId
    ? profile?.bio_id || undefined
    : profile?.bio_en || undefined;
  const avatarUrl = profile?.avatar_path
    ? getStoragePublicUrl(profile.avatar_path)
    : null;

  const githubUrl =
    profile?.github_url || socialsSetting?.github || "https://github.com";
  const linkedinUrl =
    profile?.linkedin_url || socialsSetting?.linkedin || "https://linkedin.com";
  const instagramUrl =
    profile?.instagram_url || socialsSetting?.instagram || "https://instagram.com";
  const contactEmail =
    profile?.email_public ||
    generalSetting?.contact_email ||
    "debian.bian@student.telkomschools.sch.id";
  const school = profile?.school || "SMK Telkom Malang";

  const personJsonLd = buildPersonJsonLd({
    name: displayName,
    url: `${DEFAULT_SITE_URL.replace(/\/+$/, "")}/${locale}`,
    jobTitle: "Web & Network Engineer",
    school,
    sameAs: [githubUrl, linkedinUrl, instagramUrl].filter(Boolean),
    imageUrl: avatarUrl,
    description: bio,
  });

  return (
    <div className="min-h-screen bg-transparent text-[#222222] font-sans antialiased relative selection:bg-[#dbeafe] selection:text-[#222222]">
      {/* Schema.org Structured Data */}
      <JsonLd data={personJsonLd} />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* GLOBAL TOP NAVIGATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Navbar
        locale={locale}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        email={contactEmail}
      />

      <main className="w-full flex flex-col items-center justify-start">
        {/* 1. KINETIC TYPOGRAPHY & HERO STAGE */}
        <KineticCanvasStage
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
        />

        {/* 2. EDITORIAL HERO & PERSONAL PROFILE POLAROID (Salam kenal ya! + 3D Hanging ID Card) */}
        <EditorialHero
          displayName={displayName}
          avatarUrl={avatarUrl}
          bio={bio}
          school={school}
        />

        {/* 2.5 ACTIVE LAB & PRODUCTION STACK (Interactive Motion Ticker with Tech Logos) */}
        <TechStackMotionBar />

        {/* 3. ABOUT TEASER / THE JOURNEY & PHILOSOPHY */}
        <AboutTeaser />

        {/* 4. CURRENTLY EXPLORING (3 TACTILE PANELS) */}
        <ExploringFocus />

        {/* 5. FEATURED PROJECTS (FLAGSHIP + BENTO GRID) */}
        <FeaturedProjects projects={projects} locale={locale} />

        {/* 6. MILESTONES & RECOGNITIONS */}
        <Milestones achievements={achievements} locale={locale} />

        {/* 7. EDUCATION & HOMELAB GROWTH */}
        <EducationSection educationList={educationList} locale={locale} />

        {/* 8. PERSONAL GALLERY SCRAPBOOK */}
        <GalleryScrapbook galleryItems={gallery} locale={locale} />

        {/* 9. NOTEBOOK & DEVLOGS */}
        <BlogNotebook posts={posts} locale={locale} />

        {/* 10. CONTACT / CLOSING */}
        <ContactSection
          email={contactEmail}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
        />
      </main>

      {/* GLOBAL FOOTER */}
      <Footer
        displayName={displayName}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
      />
    </div>
  );
}
