import Link from "next/link";
import { PortalSwitcher } from "@/components/site/portal-switcher";
import { SignOutButton } from "@/components/site/sign-out-button";
import type { Portal } from "@/lib/auth/portal-cookie";

export function MentorHeader({ activePortal }: { activePortal: Portal }) {
  return (
    <header className="border-border/80 bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/dashboard" className="font-heading shrink-0 text-base tracking-tight sm:text-lg">
          Hobby Engineer Deck
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <PortalSwitcher activePortal={activePortal} />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
