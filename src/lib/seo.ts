import type { Metadata } from "next";

export const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "https://debianfirwanto.com");

export const DEFAULT_OG_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBNrmoVQbmOgjgzU8fW6x2aFmr_pLmzPu3Ov1C2cUo_cELkM6-3NXEfEOffgUhB9tK56jVTL2sl8uHFX7NHzZE6ZYNLqF9Hk1CYTHk2LrkN0noWPfuShl5gS_-CMJ1pc0pYD2SRPy6xizzAYdTHWkIeQXNnBmPsbyYC0dqA_ePTpb_0ZIS4120TTNt5291kHYqe0gt1BJJKTJyFO1LQTR-sZ0ym-ySndPHyjcZtxCtVS_YUCtoH8GSU";

export interface PageMetadataOptions {
  title: string;
  description: string;
  locale: string;
  path: string; // e.g. "/", "/projects", "/blog", "/blog/slug"
  ogImage?: string | null;
  ogType?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds standard compliant Next.js Metadata with canonicals, language alternates,
 * OpenGraph, Twitter card, and robots directives.
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
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = DEFAULT_SITE_URL.replace(/\/+$/, "");

  // Build localized canonical paths
  const idPath = cleanPath === "/" ? "/id" : `/id${cleanPath}`;
  const enPath = cleanPath === "/" ? "/en" : `/en${cleanPath}`;
  const currentPath = locale === "en" ? enPath : idPath;

  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
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
      siteName: "Debian (Bian) Firwanto Portfolio",
      locale: locale === "en" ? "en_US" : "id_ID",
      type: ogType,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(ogType === "article" && publishedTime
        ? {
            publishedTime,
            authors: authors || ["Debian Firwanto"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
      creator: "@biannihgenk",
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
