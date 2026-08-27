import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/site/sign-out-button";
import { cn } from "@/lib/utils";

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
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-lg tracking-tight">
          HobbyEngineerDeck
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
            Blog
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard/blog"
                className={cn(buttonVariants({ variant: "ghost" }))}
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
              <Link href="/signup" className={cn(buttonVariants())}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
