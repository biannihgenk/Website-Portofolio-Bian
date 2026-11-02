import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings, getProjects } from "@/lib/content/queries";
import type { SiteSetting, Project } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WorkbenchHero } from "@/components/projects/WorkbenchHero";
import { ProjectsDirectory } from "@/components/projects/ProjectsDirectory";
import { TechStackMotionBar } from "@/components/home/TechStackMotionBar";
import { ContactSection } from "@/components/home/ContactSection";

import { buildPageMetadata } from "@/lib/seo";

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
      ? "Proyek & Lab Digital — Debian (Bian) Portfolio"
      : "Projects & Digital Workbench — Debian (Bian) Portfolio",
    description: isId
      ? "Koleksi proyek rekayasa perangkat lunak, infrastruktur jaringan TKJ SMK Telkom Malang, dan implementasi sistem yang dirancang dengan standar performa teruji."
      : "A curated collection of software engineering projects, vocational TKJ network infrastructures at SMK Telkom Malang, and benchmarked system implementations.",
    locale,
    path: "/projects",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, profile, siteSettings] = await Promise.all([
    getProjects().catch(() => [] as Project[]),
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

      <main className="w-full pt-20 sm:pt-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 sm:pb-20">
          {/* SECTION 1: Workbench Hero & Mode Switcher */}
          <WorkbenchHero />

          {/* SECTION 2: Interactive Directory & Filtering Grid */}
          <ProjectsDirectory projects={projects} locale={locale} />
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
