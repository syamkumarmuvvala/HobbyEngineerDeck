import Link from "next/link";
import { Newspaper, PenLine } from "lucide-react";
import { getAuthorPostStats } from "@/lib/blog/author-stats";
import { requireAuthor } from "@/lib/auth/session";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardHomePage() {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) return null;

  const stats = await getAuthorPostStats(appUser.id);
  const firstName = appUser.name?.split(" ")[0] ?? appUser.email.split("@")[0];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <p className="text-muted-foreground text-sm font-medium">Mentor mode</p>
        <h1 className="font-heading mt-1 text-3xl tracking-tight">Welcome back, {firstName}.</h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
          This is your mentor workspace. Write, publish, and keep drafts in one place.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total posts", value: stats.total },
          { label: "Drafts", value: stats.drafts },
          { label: "Scheduled", value: stats.scheduled },
          { label: "Published", value: stats.published },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-muted-foreground text-xs font-medium uppercase">{item.label}</p>
            <p className="font-heading mt-1 text-3xl tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/blog/new" className={cn(buttonVariants(), "pill-cta")}>
          <PenLine className="size-4" />
          New post
        </Link>
        <Link
          href="/dashboard/blog"
          className={cn(buttonVariants({ variant: "outline" }), "pill-cta")}
        >
          <Newspaper className="size-4" />
          My Blogs
        </Link>
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }), "text-foreground")}>
          View public blog
        </Link>
      </div>
    </div>
  );
}
