import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/site/sign-out-button";
import { cn } from "@/lib/utils";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export async function SiteHeader() {
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    user = null;
  }

  return (
    <header className="border-border/80 bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="font-heading shrink-0 text-lg tracking-tight">
          Hobby Engineer Deck
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-1 text-sm">
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(buttonVariants({ variant: "ghost" }), "text-foreground/80")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <>
              <Link
                href="/dashboard/blog"
                className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Log in
              </Link>
              <Link href="/signup" className={cn(buttonVariants(), "pill-cta hidden h-9 px-4 sm:inline-flex")}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
