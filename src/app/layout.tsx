import type { Metadata, Viewport } from "next";
import {
  DEFAULT_SITE_URL,
  DEFAULT_OG_IMAGE,
  AUTHOR_NAME,
  AUTHOR_PREFERRED_NAME,
  DEFAULT_SEO_KEYWORDS,
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#fbf9f3",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default:
      "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer | SMK Telkom Malang",
    template: "%s | Naufal Nizar De Bian (Debian Firwanto)",
  },
  description:
    "Portofolio resmi Naufal Nizar De Bian Setyo Firwanto (Debian Firwanto) — Siswa SMK Telkom Malang spesialisasi Teknik Komputer dan Jaringan (TKJ). Berfokus pada Web Engineering (Next.js, TypeScript, PostgreSQL) dan Network Infrastructure (MikroTik RouterOS, Cisco, Linux Debian SysAdmin).",
  keywords: DEFAULT_SEO_KEYWORDS,
  authors: [
    {
      name: `${AUTHOR_NAME} (${AUTHOR_PREFERRED_NAME})`,
      url: DEFAULT_SITE_URL,
    },
  ],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: DEFAULT_SITE_URL,
    languages: {
      "id-ID": `${DEFAULT_SITE_URL}/id`,
      "en-US": `${DEFAULT_SITE_URL}/en`,
      "x-default": `${DEFAULT_SITE_URL}/id`,
    },
  },
  openGraph: {
    title:
      "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer | SMK Telkom Malang",
    description:
      "Portofolio resmi Naufal Nizar De Bian (Debian Firwanto) — Siswa SMK Telkom Malang spesialisasi TKJ. Rekayasa Web Modern (Next.js, TypeScript), arsitektur jaringan MikroTik/Cisco, dan Linux SysAdmin.",
    url: DEFAULT_SITE_URL,
    siteName: "Naufal Nizar De Bian (Debian Firwanto) — Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Naufal Nizar De Bian (Debian Firwanto) — Web & Network Engineer | SMK Telkom Malang",
    description:
      "Portofolio resmi Naufal Nizar De Bian (Debian Firwanto) — Siswa SMK Telkom Malang (TKJ). Web & Network Engineer.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@biannihgenk",
    site: "@biannihgenk",
  },
  robots: {
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
