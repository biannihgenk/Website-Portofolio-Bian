import type { Metadata } from "next";
import { DEFAULT_SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default: "Debian (Bian) Firwanto — Vocational TKJ & Software Engineer",
    template: "%s | Debian Firwanto",
  },
  description:
    "Portfolio pribadi dan jurnal proses belajar Debian (Bian) Firwanto — Siswa TKJ SMK Telkom Malang yang menjelajahi rekayasa perangkat lunak, infrastruktur jaringan, homelab, dan sistem digital.",
  keywords: [
    "Debian Firwanto",
    "Bian",
    "SMK Telkom Malang",
    "TKJ",
    "Teknik Komputer dan Jaringan",
    "Vocational Portfolio",
    "Next.js",
    "MikroTik",
    "Debian Linux",
    "Cisco",
    "Fullstack Engineer",
  ],
  authors: [{ name: "Debian Firwanto", url: DEFAULT_SITE_URL }],
  creator: "Debian Firwanto",
  publisher: "Debian Firwanto",
  openGraph: {
    title: "Debian (Bian) Firwanto — Vocational TKJ & Software Engineer",
    description:
      "Portfolio pribadi dan jurnal proses belajar Debian (Bian) Firwanto — Siswa TKJ SMK Telkom Malang.",
    url: DEFAULT_SITE_URL,
    siteName: "Debian Firwanto Portfolio",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Debian Firwanto Portfolio",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debian (Bian) Firwanto — Vocational TKJ & Software Engineer",
    description: "Portfolio pribadi dan jurnal proses belajar Debian (Bian) Firwanto.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@biannihgenk",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
