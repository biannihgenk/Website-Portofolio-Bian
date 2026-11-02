import React from "react";
import {
  AUTHOR_NAME,
  AUTHOR_PREFERRED_NAME,
  AUTHOR_SCHOOL,
  AUTHOR_ROLE,
  DEFAULT_SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/seo";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Safely renders JSON-LD structured data script.
 * Escapes closing tags to prevent XSS injection from CMS strings.
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

export interface PersonJsonLdOptions {
  name?: string;
  url?: string;
  jobTitle?: string;
  school?: string;
  sameAs?: string[];
  imageUrl?: string | null;
  description?: string;
}

/**
 * Generates Google-compliant Schema.org Structured Data graph including
 * Person, ProfilePage, and WebSite entities to maximize SEO Knowledge Graph visibility.
 */
export function buildPersonJsonLd(options?: PersonJsonLdOptions) {
  const baseUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");
  const currentUrl = options?.url || baseUrl;
  const officialName = AUTHOR_NAME;
  const preferredName = options?.name || AUTHOR_PREFERRED_NAME;
  const schoolName = options?.school || AUTHOR_SCHOOL;
  const jobTitle = options?.jobTitle || AUTHOR_ROLE;
  const imageUrl =
    options?.imageUrl || `${baseUrl}/images/foto_bian.png`;

  const sameAsList = Array.from(
    new Set([
      ...(options?.sameAs || []),
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.instagram,
    ].filter(Boolean))
  );

  const defaultDescription =
    options?.description ||
    `Portofolio resmi ${officialName} (${preferredName}) — Siswa ${schoolName} spesialisasi Teknik Komputer dan Jaringan (TKJ). Berfokus pada rekayasa Web Modern (Next.js, TypeScript) dan Infrastruktur Jaringan (MikroTik RouterOS, Cisco, Linux Debian SysAdmin).`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: `${officialName} (${preferredName}) — Web & Network Engineer Portfolio`,
        description: defaultDescription,
        inLanguage: ["id-ID", "en-US"],
        publisher: {
          "@id": `${baseUrl}/#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${currentUrl}/#profilepage`,
        url: currentUrl,
        name: `${officialName} — Profile & Portfolio`,
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#person`,
        },
        mainEntity: {
          "@id": `${baseUrl}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: officialName,
        alternateName: [
          preferredName,
          "Naufal Nizar De Bian",
          "Bian",
          "biannihgenk",
          "debianxyz",
        ],
        url: baseUrl,
        image: imageUrl,
        jobTitle,
        description: defaultDescription,
        worksFor: {
          "@type": "EducationalOrganization",
          name: `${schoolName} (Siswa TKJ / Vocational Student)`,
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: schoolName,
          url: "https://smktelkom-mlg.sch.id",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Malang",
            addressRegion: "Jawa Timur",
            addressCountry: "ID",
          },
        },
        knowsAbout: [
          "Computer Networks",
          "Network Engineering",
          "MikroTik RouterOS",
          "Cisco Networking",
          "Debian Linux",
          "Linux Server Administration",
          "Web Engineering",
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "PostgreSQL",
          "Supabase",
          "Homelab Infrastructure",
          "VLAN & Subnetting",
          "REST APIs",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: jobTitle,
          occupationLocation: {
            "@type": "City",
            name: "Malang",
          },
          skills:
            "Next.js, TypeScript, MikroTik RouterOS, Cisco Packet Tracer, Debian Linux, Network Routing, Cloud Architecture",
        },
        sameAs: sameAsList,
      },
    ],
  };
}

/**
 * Generates Schema.org BlogPosting & BreadcrumbList JSON-LD for an article.
 */
export function buildArticleJsonLd(options: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}) {
  const baseUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");
  const author = options.authorName || AUTHOR_NAME;
  const authorUrl = options.authorUrl || baseUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${options.url}/#article`,
        headline: options.title,
        description: options.description,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": options.url,
        },
        url: options.url,
        ...(options.imageUrl ? { image: [options.imageUrl] } : {}),
        ...(options.datePublished ? { datePublished: options.datePublished } : {}),
        ...(options.dateModified
          ? { dateModified: options.dateModified }
          : options.datePublished
          ? { dateModified: options.datePublished }
          : {}),
        author: {
          "@type": "Person",
          name: author,
          url: authorUrl,
        },
        publisher: {
          "@type": "Person",
          name: author,
          url: authorUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${options.url}/#breadcrumb`,
        itemListElement: options.breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      },
    ],
  };
}
