import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings } from "@/lib/content/queries";
import type { SiteSetting } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    path: "/contact",
    title: isId
      ? "Kontak & Kolaborasi — Debian (Bian) Portfolio"
      : "Contact & Collaboration — Debian (Bian) Portfolio",
    description: isId
      ? "Hubungi Debian (Bian) Firwanto untuk diskusi proyek web, konfigurasi jaringan TKJ SMK Telkom, kesempatan magang, atau sekadar bertukar pikiran."
      : "Get in touch with Debian (Bian) Firwanto for web projects, vocational TKJ networking, internship opportunities, or tech discussions.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isId = locale === "id";

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

      <main className="w-full pt-20 sm:pt-24 bg-transparent min-h-screen">
        {/* Subtle Ambient Background Gradients */}
        <div className="w-full relative overflow-hidden py-4 sm:py-6">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#dbeafe]/30 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#f3b9a7]/20 blur-3xl pointer-events-none" />

          {/* EDITORIAL HERO FOR CONTACT */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-2">
            <div className="flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#ded8cb] rounded-full font-mono text-xs uppercase tracking-wider text-[#2563eb] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
                <span>{isId ? "RUANG KOMUNIKASI & LAB" : "DISPATCH & INQUIRIES"}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#222222] tracking-tight leading-tight">
                {isId ? "Mari Terhubung & Berdiskusi." : "Let's Connect & Collaborate."}
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#686660] max-w-2xl leading-relaxed">
                {isId
                  ? "Pintu selalu terbuka untuk diskusi teknologi, kolaborasi proyek web, eksplorasi jaringan komputer, atau kesempatan magang industri 2025/2026."
                  : "The door is always open for tech discussions, web project collaborations, computer networking explorations, or 2025/2026 industry internship opportunities."}
              </p>
            </div>
          </section>

          {/* Tech Stack Interactive Motion Ticker */}
          <TechStackMotionBar />

          {/* CONTACT INTERACTIVE SECTION */}
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
