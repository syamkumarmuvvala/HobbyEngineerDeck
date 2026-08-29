import type { ReactNode } from "react";
import { MentorHeader } from "@/components/mentor/mentor-header";
import { MentorSidebar } from "@/components/mentor/mentor-sidebar";
import type { Portal } from "@/lib/auth/portal-cookie";

export function MentorShell({
  activePortal,
  children,
}: {
  activePortal: Portal;
  children: ReactNode;
}) {
  return (
    <div className="bg-muted/30 flex min-h-full flex-1 flex-col">
      <MentorHeader activePortal={activePortal} />
      <MentorSidebar className="border-border bg-background flex-row overflow-x-auto border-b px-3 py-2 md:hidden" />
      <div className="flex min-h-0 flex-1">
        <aside className="border-border bg-background hidden w-[220px] shrink-0 border-r md:block">
          <MentorSidebar className="sticky top-14 flex-col p-3" />
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
