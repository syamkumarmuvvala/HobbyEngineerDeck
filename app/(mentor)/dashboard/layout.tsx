import type { ReactNode } from "react";
import { MentorShell } from "@/components/mentor/mentor-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { canAuthor } from "@/lib/auth/capabilities";
import { requireAppUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const appUser = await requireAppUser();

  if (!canAuthor(appUser)) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl tracking-tight">Mentors only</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            You are signed in as a member. Blog publishing is limited to mentors and admins. Ask an
            operator to set <code className="font-mono text-sm">isMentor</code> to{" "}
            <code className="font-mono text-sm">true</code> on your account if you should be writing
            here. You keep member access either way.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return <MentorShell activePortal="mentor">{children}</MentorShell>;
}
