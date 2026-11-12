import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings } from "@/lib/content/queries";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { buildPageMetadata, DEFAULT_SITE_URL } from "@/lib/seo";
import { JsonLd, buildPersonJsonLd } from "@/components/seo/JsonLd";
import type { SiteSetting } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileIntroBanner } from "@/components/profile/ProfileIntroBanner";
import { ProfileGalleryShowcase } from "@/components/profile/ProfileGalleryShowcase";
import { BiodataBoard } from "@/components/profile/BiodataBoard";
import { ProfileFactsAndTraits } from "@/components/profile/ProfileFactsAndTraits";
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
      ? "Profil & Identitas — Debian (Bian) Portfolio"
      : "Profile & Identity — Debian (Bian) Portfolio",
    description: isId
      ? "Kisah personal, etos curious builder, perjalanan vokasi TKJ di SMK Telkom Malang, dan prinsip belajar Debian Firwanto."
      : "Personal story, curious builder ethos, vocational TKJ journey at SMK Telkom Malang, and learning principles of Debian Firwanto.",
    locale,
    path: "/profile",
    ogType: "profile",
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, siteSettings] = await Promise.all([
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
  const nickname = profile?.nickname || "Bian";
  const school = profile?.school || "SMK Telkom Malang";
  const studyProgram = profile?.study_program || "Teknik Komputer dan Jaringan (TKJ)";
  const location = profile?.location || "Malang & Sidoarjo, Jawa Timur";
  const avatarUrl = profile?.avatar_path ? getStoragePublicUrl(profile.avatar_path) : null;

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

  const personJsonLd = buildPersonJsonLd({
    name: displayName,
    url: `${DEFAULT_SITE_URL.replace(/\/+$/, "")}/${locale}/profile`,
    jobTitle: "Web & Network Engineer",
    school,
    sameAs: [githubUrl, linkedinUrl, instagramUrl].filter(Boolean),
    imageUrl: avatarUrl,
    description: profile?.bio_id || profile?.bio_en || "Profil Debian Firwanto",
  });

  const randomFacts = Array.isArray(profile?.random_facts)
    ? (profile.random_facts as string[])
    : null;
  const characterNotes = Array.isArray(profile?.character_notes)
    ? (profile.character_notes as string[])
    : null;

  return (
    <div className="min-h-screen bg-transparent text-[#222222] font-sans antialiased relative selection:bg-[#dbeafe] selection:text-[#222222]">
      {/* Schema.org Structured Data */}
      <JsonLd data={personJsonLd} />

      {/* GLOBAL TOP NAVIGATION */}
      <Navbar
        locale={locale}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        email={contactEmail}
      />

      <main className="w-full pt-20 sm:pt-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
          {/* Subpage Profile Hero & Personal Dossier */}
          <ProfileIntroBanner
            fullName={displayName}
            nickname={nickname}
            school={school}
            studyProgram={studyProgram}
            location={location}
            avatarUrl={avatarUrl}
          />

          {/* Learning Pillars & Field Perspectives */}
          <ProfileGalleryShowcase avatarUrl={avatarUrl} />

          {/* Section 02: The Living Biodata Board */}
          <BiodataBoard
            fullName={displayName}
            nickname={nickname}
            school={school}
            studyProgram={studyProgram}
            location={location}
          />

          {/* Section 03: Fakta Menarik & Catatan Karakter (CMS Synced) */}
          <ProfileFactsAndTraits
            randomFacts={randomFacts}
            characterNotes={characterNotes}
          />
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
