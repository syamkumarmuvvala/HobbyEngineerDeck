import type { ReactNode } from "react";
import { requireAppUser } from "@/lib/auth/session";
import { canAuthor } from "@/lib/auth/capabilities";
import { getActivePortal } from "@/lib/auth/portal";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const appUser = await requireAppUser();

  if (!canAuthor(appUser)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight">Mentors only</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          You are signed in as a member. Blog publishing is limited to mentors and admins. Ask an
          operator to set <code className="font-mono text-sm">isMentor</code> to{" "}
          <code className="font-mono text-sm">true</code> on your account if you should be writing
          here. You keep member access either way.
        </p>
      </main>
    );
  }

  const activePortal = await getActivePortal(appUser);

  return (
    <div>
      {activePortal === "mentor" ? (
        <div className="border-border/80 bg-primary/15 border-b">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <p className="text-sm font-medium">Mentor portal</p>
            <Badge variant="secondary" className="bg-primary/30 text-[#171717]">
              Mentor mode
            </Badge>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
