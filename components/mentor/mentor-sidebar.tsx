"use client";

import { LayoutDashboard, Newspaper } from "lucide-react";
import { MentorNavLink } from "@/components/mentor/mentor-nav-link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/blog", label: "My Blogs", icon: Newspaper, exact: false },
] as const;

export function MentorSidebar({ className }: { className?: string }) {
  return (
    <nav className={cn("flex gap-1", className)} aria-label="Mentor portal">
      {navItems.map((item) => (
        <MentorNavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}
