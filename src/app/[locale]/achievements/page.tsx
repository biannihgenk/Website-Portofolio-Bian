import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings, getAchievements } from "@/lib/content/queries";
import type { SiteSetting, Achievement } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import { AchievementsDirectory } from "@/components/achievements/AchievementsDirectory";
import { TechStackMotionBar } from "@/components/home/TechStackMotionBar";
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
    path: "/achievements",
    title: isId
      ? "Pencapaian & Rekam Jejak — Debian (Bian) Portfolio"
      : "Achievements & Milestones — Debian (Bian) Portfolio",
    description: isId
      ? "Arsip rekam jejak, sertifikasi kompetensi, dan tonggak kompetisi vokasi TKJ SMK Telkom Malang oleh Debian (Bian) Firwanto."
      : "Milestone archives, competence certifications, and vocational competition achievements of Debian (Bian) Firwanto at SMK Telkom Malang.",
  });
}

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [achievements, profile, siteSettings] = await Promise.all([
    getAchievements().catch(() => [] as Achievement[]),
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

      <main className="w-full pt-20 sm:pt-24 bg-transparent overflow-x-clip">
        {/* Subtle warm glow circles */}
        <div className="relative w-full">
          <div
            className="absolute -top-32 -left-20 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(243,185,167,0.22) 0%, rgba(243,185,167,0) 70%)",
            }}
          />
          <div
            className="absolute top-48 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(191,219,254,0.32) 0%, rgba(191,219,254,0) 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 relative z-10">
            {/* SECTION 1: HERO - JEJAK PROSES SCRAPBOOK */}
            <AchievementsHero />

            {/* SECTION 2: DIRECTORY / FILTER & SEARCH & CARDS */}
            <AchievementsDirectory achievements={achievements} locale={locale} />
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
