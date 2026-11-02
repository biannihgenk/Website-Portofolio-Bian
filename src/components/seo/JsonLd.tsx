import React from "react";

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

/**
 * Generates Schema.org Person & WebSite JSON-LD for portfolio homepage/profile.
 */
export function buildPersonJsonLd(options: {
  name: string;
  url: string;
  jobTitle: string;
  school: string;
  sameAs: string[];
  imageUrl?: string | null;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${options.url}/#website`,
        url: options.url,
        name: `${options.name} Portfolio`,
        description: options.description || "Portfolio and process notes of Debian Firwanto",
        inLanguage: ["id-ID", "en-US"],
      },
      {
        "@type": "Person",
        "@id": `${options.url}/#person`,
        name: options.name,
        alternateName: ["Bian", "Naufal Nizar De Bian Setyo Firwanto"],
        url: options.url,
        jobTitle: options.jobTitle,
        description: options.description,
        ...(options.imageUrl ? { image: options.imageUrl } : {}),
        alumniOf: {
          "@type": "EducationalOrganization",
          name: options.school,
        },
        knowsAbout: [
          "Computer Networks",
          "Web Development",
          "Next.js",
          "TypeScript",
          "MikroTik",
          "Debian Linux",
          "PostgreSQL",
          "Cisco Networking",
        ],
        sameAs: options.sameAs.filter(Boolean),
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
  authorName: string;
  authorUrl: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}) {
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
          name: options.authorName,
          url: options.authorUrl,
        },
        publisher: {
          "@type": "Person",
          name: options.authorName,
          url: options.authorUrl,
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
