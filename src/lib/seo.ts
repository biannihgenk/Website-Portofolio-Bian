import type { Metadata } from "next";

export const CANONICAL_SITE_URL = "https://debianxyz.my.id";

export const AUTHOR_NAME = "Naufal Nizar De Bian Setyo Firwanto";
export const AUTHOR_PREFERRED_NAME = "Debian Firwanto";
export const AUTHOR_SCHOOL = "SMK Telkom Malang";
export const AUTHOR_ROLE = "Web & Network Engineer";
export const AUTHOR_EMAIL = "debian.bian@student.telkomschools.sch.id";

export const SOCIAL_LINKS = {
  github: "https://github.com/biannihgenk",
  linkedin: "https://linkedin.com/in/debian-firwanto-49728635a/",
  instagram: "https://instagram.com/debianxyzz",
};

/**
 * Resolves site URL prioritizing the production canonical domain https://debianxyz.my.id.
 * Falls back to localhost in local development if explicitly running locally without production env.
 */
export const getSiteUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`.replace(/\/+$/, "");
  }
  return CANONICAL_SITE_URL;
};

export const DEFAULT_SITE_URL = getSiteUrl();

export const DEFAULT_OG_IMAGE = `${CANONICAL_SITE_URL}/images/projects_hero_workspace.jpg`;

export const DEFAULT_SEO_KEYWORDS: string[] = [
  "Naufal Nizar De Bian",
  "Naufal Nizar De Bian Setyo Firwanto",
  "Debian Firwanto",
  "Bian",
  "debianxyz",
  "biannihgenk",
  "SMK Telkom Malang",
  "Moklet Malang",
  "Moklet A'35",
  "TKJ SMK Telkom",
  "Teknik Komputer dan Jaringan",
  "Web Engineer",
  "Network Engineer",
  "Full Stack Developer",
  "Next.js 15",
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Supabase",
  "MikroTik",
  "MikroTik RouterOS",
  "Cisco",
  "Cisco Packet Tracer",
  "Linux SysAdmin",
  "Debian Linux",
  "Homelab",
  "Vokasi",
  "Portofolio Vokasi",
  "IT Infrastructure",
];

export interface PageMetadataOptions {
  title: string;
  description: string;
  locale: string;
  path: string; // e.g. "/", "/projects", "/blog", "/blog/slug"
  ogImage?: string | null;
  ogType?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Builds standard compliant Next.js 15 Metadata with canonicals, language alternates,
 * OpenGraph (WhatsApp, LinkedIn, Twitter/X), Twitter card, keywords, and robots directives.
 */
export function buildPageMetadata({
  title,
  description,
  locale,
  path,
  ogImage,
  ogType = "website",
  publishedTime,
  authors,
  keywords,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");

  // Build localized canonical paths
  const idPath = cleanPath === "/" ? "/id" : `/id${cleanPath}`;
  const enPath = cleanPath === "/" ? "/en" : `/en${cleanPath}`;
  const currentPath = locale === "en" ? enPath : idPath;

  // Ensure absolute OG image URL for scrapers (WhatsApp, LinkedIn, Twitter)
  let resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
  if (resolvedOgImage.startsWith("/")) {
    resolvedOgImage = `${baseUrl}${resolvedOgImage}`;
  }

  const mergedKeywords = Array.from(
    new Set([...(keywords || []), ...DEFAULT_SEO_KEYWORDS])
  );

  return {
    title,
    description,
    keywords: mergedKeywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}${currentPath}`,
      languages: {
        "id-ID": `${baseUrl}${idPath}`,
        "en-US": `${baseUrl}${enPath}`,
        "x-default": `${baseUrl}${idPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${currentPath}`,
      siteName: "Naufal Nizar De Bian (Debian Firwanto) — Portfolio",
      locale: locale === "en" ? "en_US" : "id_ID",
      type: ogType,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(ogType === "article" && publishedTime
        ? {
            publishedTime,
            authors: authors || [AUTHOR_NAME],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
      creator: "@biannihgenk",
      site: "@biannihgenk",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
