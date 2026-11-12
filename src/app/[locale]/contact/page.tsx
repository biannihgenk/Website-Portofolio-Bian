import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getProfile, getSiteSettings } from "@/lib/content/queries";
import type { SiteSetting } from "@/types/content";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";
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

          {/* EXECUTIVE SUB-PAGE HERO FOR CONTACT */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-8">
            <SubpageBreadcrumb
              sectionIndex={isId ? "07 / KONTAK" : "07 / CONTACT"}
              sectionLabel="Kontak & Kolaborasi"
              sectionLabelEn="Contact & Collaboration"
              rightMeta="MALANG, ID"
            />

            <div className="bg-white/95 rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column (7 Cols): Authoritative Headline & Collaboration Scope */}
                <div className="lg:col-span-7 flex flex-col items-start gap-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f5f3ee] border border-[#ded8cb] rounded-full font-mono text-[11px] uppercase tracking-wider text-[#111827] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>
                      {isId
                        ? "TERBUKA UNTUK KOLABORASI & MAGANG"
                        : "OPEN FOR COLLABORATION & INTERNSHIP"}
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#0b0c0c] tracking-tight leading-[1.12]">
                    {isId ? (
                      <>
                        Mari Terhubung &amp;{" "}
                        <span className="italic font-normal text-[#2563eb] block sm:inline">
                          Berdiskusi.
                        </span>
                      </>
                    ) : (
                      <>
                        Let&apos;s Connect &amp;{" "}
                        <span className="italic font-normal text-[#2563eb] block sm:inline">
                          Collaborate.
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-2xl leading-relaxed">
                    {isId
                      ? "Terbuka untuk diskusi arsitektur jaringan komputer, pengembangan aplikasi web modern, proyek riset berbasis teknologi, maupun peluang magang industri 2025/2026."
                      : "Available for discussions on computer network architecture, modern full-stack web engineering, technical research projects, and 2025/2026 industry internship opportunities."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b0c0c] hover:bg-[#2563eb] text-white font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all"
                    >
                      <span>{isId ? "Kirim Email Langsung" : "Send Direct Email"}</span>
                      <span>↗</span>
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fbf9f3] hover:bg-white text-[#111827] border border-[#ded8cb] hover:border-[#2563eb]/50 font-sans text-xs sm:text-sm font-semibold transition-all"
                    >
                      <span>{isId ? "Lihat Kanal Kontak" : "View All Channels"}</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>

                {/* Right Column (5 Cols): Direct Dispatch Dossier Card */}
                <div className="lg:col-span-5">
                  <div className="bg-[#fbf9f3] rounded-2xl border border-[#ded8cb] p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#ded8cb]/80">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                        DIRECT DISPATCH • 2026
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#ded8cb] font-mono text-[10px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {isId ? "Aktif" : "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                          {isId ? "Email Utama" : "Primary Email"}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#111827] mt-0.5 block break-all">
                          {contactEmail}
                        </span>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                          {isId ? "Waktu Respons" : "Response Window"}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#2563eb] mt-0.5 block">
                          &lt; 24 {isId ? "Jam (WIB)" : "Hours (WIB)"}
                        </span>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                          {isId ? "Topik Diskusi" : "Focus Topics"}
                        </span>
                        <span className="font-sans text-xs font-semibold text-[#111827] mt-0.5 block">
                          Network Infra &amp; Web Systems
                        </span>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] block">
                          {isId ? "Domisili" : "Base"}
                        </span>
                        <span className="font-sans text-xs font-semibold text-[#111827] mt-0.5 block">
                          Malang, East Java (ID)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#ded8cb]/80 flex items-center justify-between font-mono text-[11px] text-[#6b6863]">
                      <span>SMK Telkom Malang</span>
                      <span className="text-[#2563eb] font-bold">Moklet A&apos;35</span>
                    </div>
                  </div>
                </div>
              </div>
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
