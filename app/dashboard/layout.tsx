import type { ReactNode } from "react";
import { requireAppUser } from "@/lib/auth/session";
import { canAuthor } from "@/lib/auth/sync-user";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const appUser = await requireAppUser();
  if (!canAuthor(appUser.role)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight">Authors only</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          You are signed in as a member. Blog publishing is limited to mentors and admins. Ask an
          operator to set your <code className="font-mono text-sm">role</code> to{" "}
          <code className="font-mono text-sm">MENTOR</code> in the database if you should be
          writing here.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
