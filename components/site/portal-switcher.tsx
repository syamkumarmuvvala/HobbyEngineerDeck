"use client";

import { setPortal } from "@/lib/auth/portal-actions";
import type { Portal } from "@/lib/auth/portal";
import { cn } from "@/lib/utils";

export function PortalSwitcher({
  activePortal,
  className,
}: {
  activePortal: Portal;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted inline-flex items-center rounded-full p-0.5 text-xs font-semibold",
        className,
      )}
      role="group"
      aria-label="Switch portal"
    >
      <form action={() => setPortal("learner")}>
        <button
          type="submit"
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            activePortal === "learner"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Learner
        </button>
      </form>
      <form action={() => setPortal("mentor")}>
        <button
          type="submit"
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            activePortal === "mentor"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Mentor
        </button>
      </form>
    </div>
  );
}
