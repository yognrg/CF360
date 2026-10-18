"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  SquarePen,
  Video,
  CircleCheckBig,
  Globe,
  Send,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/nav";

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  LayoutGrid,
  SquarePen,
  Video,
  CircleCheckBig,
  Globe,
  Send,
  Activity,
};

export function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // Wide screens: a fixed side column. Narrow screens: a scrolling strip above the content.
  return (
    <nav
      aria-label="Main"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-surface p-2 lg:w-sidenav lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        // section-active: match the first path segment
        const section = "/" + (item.href.split("/")[1] ?? "");
        const active = pathname === item.href || pathname.startsWith(section);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-control px-3 py-2 text-label transition-colors",
              active
                ? "bg-primary-soft font-medium text-primary"
                : "text-text-sub hover:bg-bg hover:text-text",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
