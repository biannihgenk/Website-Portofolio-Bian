import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings, getGalleryItems } from "@/lib/content/queries";
import type { SiteSetting, GalleryItem } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryContainer } from "@/components/gallery/GalleryContainer";
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
    path: "/gallery",
    title: isId
      ? "Galeri Foto & Scrapbook Memori — Debian (Bian) Portfolio"
      : "Photo Gallery & Memory Scrapbook — Debian (Bian) Portfolio",
    description: isId
      ? "Dokumentasi visual perjalanan akademik di SMK Telkom Malang, kegiatan laboratorium jaringan, dan kolaborasi pengembangan proyek bersama rekan tim."
      : "Visual documentation of academic milestones at SMK Telkom Malang, network laboratory sessions, and collaborative engineering projects with peers.",
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [dbGalleryItems, profile, siteSettings] = await Promise.all([
    getGalleryItems().catch(() => [] as GalleryItem[]),
    getProfile().catch(() => null),
    getSiteSettings().catch(() => [] as SiteSetting[]),
  ]);

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

      <main className="w-full pt-16 sm:pt-20 bg-transparent overflow-hidden min-h-screen">
        {/* Subtle Ambient Background Accents */}
        <div className="w-full relative overflow-hidden py-4 sm:py-6">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#dbeafe]/30 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#f3b9a7]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-[#bfdbfe]/20 blur-3xl pointer-events-none" />

          {/* MAIN GALLERY CONTAINER */}
          <div className="relative z-10">
            <GalleryContainer locale={locale} dbGalleryItems={dbGalleryItems} />
          </div>

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
