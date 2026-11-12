"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CrossingTickerRibbons } from "@/components/home/CrossingTickerRibbons";
import { ScrollReveal } from "@/components/motion/MotionProviders";

interface ContactSectionProps {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export function ContactSection({
  email = "firwanto.debian@gmail.com",
  githubUrl = "https://github.com/biannihgenk",
  linkedinUrl = "https://www.linkedin.com/in/debian-firwanto-49728635a/",
  instagramUrl = "https://instagram.com",
}: ContactSectionProps) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState<boolean>(false);

  function handleCopyEmail() {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section id="contact" className="relative w-full pt-8 pb-16 sm:pt-12 sm:pb-24 bg-transparent overflow-x-clip scroll-mt-24">
      {/* Dual Crossing Animated Ribbons */}
      <div className="mb-10 sm:mb-14">
        <CrossingTickerRibbons />
      </div>

      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-20 border border-[#ded8cb] shadow-sm overflow-hidden text-center">
          {/* Top Postage Badge */}
          <div className="absolute top-6 right-6 bg-[#f5f3ee] px-3.5 py-1.5 rounded-xl border border-[#ded8cb] font-mono text-[10px] sm:text-[11px] font-bold text-[#686660] uppercase tracking-widest hidden md:block">
            {t("postageStamp")}
          </div>

          {/* Live Availability Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f3ee] border border-[#ded8cb] font-mono text-xs uppercase tracking-wider text-blue-700 font-bold shadow-2xs mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>{t("collaborateBadge")}</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b0c0c] tracking-tight leading-[1.12] max-w-4xl mx-auto">
            {t("headingMain")}
          </h2>

          {/* Subtitle Description */}
          <p className="font-sans text-base sm:text-lg lg:text-xl text-[#686660] leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
            {t("headingSub")}
          </p>

          {/* Interactive Action Hub */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0b0c0c] text-white font-sans font-bold text-sm sm:text-base hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t("emailDirectAction")}</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-[#f5f3ee] hover:bg-[#eae8e2] text-[#222222] font-mono text-xs sm:text-sm border border-[#ded8cb] shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
              title="Salin email ke clipboard"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{email}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-sans text-[11px] font-bold transition-all ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-[#686660] border border-[#ded8cb]"
                }`}
              >
                {copied ? t("copiedToast") : t("copyEmailAction")}
              </span>
            </button>
          </div>

          {/* Bento Grid of Verified Channels */}
          <div className="mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-[#ded8cb]/80 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <span className="font-mono text-xs uppercase font-bold text-blue-700 tracking-widest">
                {t("verifiedChannels")}
              </span>
              <span className="font-sans text-xs text-[#686660] italic">
                {t("verifiedNote")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* GitHub Card */}
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#0b0c0c] group-hover:text-white flex items-center justify-center text-[#222222] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelGithubTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelGithubSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>@biannihgenk</span>
                  <span className="text-blue-600">Open Source</span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#0a66c2] group-hover:text-white flex items-center justify-center text-[#0a66c2] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelLinkedinTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelLinkedinSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>Debian Firwanto</span>
                  <span className="text-blue-600">Network &amp; Web</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#e1306c] group-hover:text-white flex items-center justify-center text-[#e1306c] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelInstagramTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelInstagramSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>@debianxyzz</span>
                  <span className="text-blue-600">Vocational &amp; Life</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Floating Back to Top Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-full bg-white hover:bg-[#0b0c0c] text-[#222222] hover:text-white border border-[#ded8cb] shadow-sm hover:shadow-lg transition-all duration-300 font-mono text-xs font-bold active:scale-95 cursor-pointer"
            title={t("backToTop")}
            aria-label={t("backToTop")}
          >
            <span>{t("backToTop")}</span>
            <span className="w-6 h-6 rounded-full bg-[#f5f3ee] group-hover:bg-white/20 flex items-center justify-center transition-colors">
              ↑
            </span>
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
