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

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  { label: "Overview", href: "/admin", icon: IconOverview, exact: true },
  { label: "Projects", href: "/admin/projects", icon: IconProjects },
  { label: "Achievements", href: "/admin/achievements", icon: IconAchievements },
  { label: "Education", href: "/admin/education", icon: IconEducation },
  { label: "Blog", href: "/admin/blog", icon: IconBlog },
  { label: "Gallery", href: "/admin/gallery", icon: IconGallery },
  { label: "Profile", href: "/admin/profile", icon: IconProfile },
  { label: "Site Settings", href: "/admin/settings", icon: IconSettings },
  { label: "Media Assets", href: "/admin/media", icon: IconMedia },
];

interface AdminSidebarNavProps {
  onNavigate?: () => void;
}

export function AdminSidebarNav({ onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Admin Navigation">
      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Portfolio CMS Modules
      </div>
      {ADMIN_NAV_ITEMS.map((item) => {
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
    </nav>
  );
}
