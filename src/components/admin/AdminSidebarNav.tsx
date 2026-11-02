"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconOverview,
  IconProjects,
  IconAchievements,
  IconEducation,
  IconBlog,
  IconGallery,
  IconProfile,
  IconSettings,
  IconMedia,
} from "./AdminIcons";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: IconOverview, exact: true },
    ],
  },
  {
    title: "Portfolio Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: IconProfile },
      { label: "Projects", href: "/admin/projects", icon: IconProjects },
      { label: "Achievements", href: "/admin/achievements", icon: IconAchievements },
      { label: "Education", href: "/admin/education", icon: IconEducation },
      { label: "Gallery", href: "/admin/gallery", icon: IconGallery },
    ],
  },
  {
    title: "Publishing",
    items: [
      { label: "Blog Posts", href: "/admin/blog", icon: IconBlog },
      { label: "Blog Categories", href: "/admin/blog/categories", icon: IconBlog },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Media Library", href: "/admin/media", icon: IconMedia },
      { label: "Site Settings", href: "/admin/settings", icon: IconSettings },
    ],
  },
];

// Flat list for TopHeader lookup
export const ADMIN_NAV_ITEMS: NavItemConfig[] = ADMIN_NAV_SECTIONS.flatMap(
  (sec) => sec.items
);

interface AdminSidebarNavProps {
  onNavigate?: () => void;
}

export function AdminSidebarNav({ onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6" aria-label="Admin Navigation">
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {section.title}
          </div>
          {section.items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-zinc-400" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
