import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings, getEducation, getAchievements } from "@/lib/content/queries";
import type { SiteSetting, Education, Achievement } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EducationHero } from "@/components/education/EducationHero";
import { EducationTimeline } from "@/components/education/EducationTimeline";
import { CertificatesRepository } from "@/components/education/CertificatesRepository";
import { CurrentlyExploringBento } from "@/components/education/CurrentlyExploringBento";
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
    path: "/education",
    title: isId
      ? "Pendidikan & Jejak Belajar — Debian (Bian) Portfolio"
      : "Education & Learning Journey — Debian (Bian) Portfolio",
    description: isId
      ? "Jejak pendidikan kejuruan TKJ di SMK Telkom Malang, riwayat formal, sertifikasi teknis, dan catatan eksplorasi homelab Debian (Bian) Firwanto."
      : "Vocational TKJ education at SMK Telkom Malang, formal timeline, technical certifications, and homelab exploration records of Debian (Bian) Firwanto.",
  });
}

export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [educationList, achievements, profile, siteSettings] = await Promise.all([
    getEducation().catch(() => [] as Education[]),
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

      <main className="w-full pt-20 sm:pt-24 bg-transparent overflow-hidden min-h-screen">
        {/* Subtle Background Ambient Accents */}
        <div className="w-full relative overflow-hidden py-6 sm:py-10">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#dbeafe]/30 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#f3b9a7]/20 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col gap-16 md:gap-24">
            {/* 1. HERO SECTION: "My Learning Journey" */}
            <EducationHero />

            {/* 2. FORMAL EDUCATION TIMELINE */}
            <EducationTimeline educationList={educationList} locale={locale} />

            {/* 3. CERTIFICATES & TRAINING REPOSITORY */}
            <CertificatesRepository
              achievements={achievements}
              educationList={educationList}
              locale={locale}
            />

            {/* 4. "CURRENTLY EXPLORING" (Honest Skill Tracker Bento) */}
            <CurrentlyExploringBento />
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
