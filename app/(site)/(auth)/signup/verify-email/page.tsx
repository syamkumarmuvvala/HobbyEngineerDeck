import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <main className="flex flex-1 items-center px-4 py-16">
      <AuthShell
        title="Check your email"
        description="We sent a confirmation link to finish creating your account. After confirming, you will continue to a short profile step."
      >
        <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          {email ? (
            <p>
              Look for a message at{" "}
              <span className="text-foreground font-medium">{email}</span>.
            </p>
          ) : (
            <p>Look for a confirmation message in your inbox.</p>
          )}
          <p className="text-muted-foreground">
            Once confirmed, you can sign in and complete your profile—or pick it up later.
          </p>
        </div>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Back to sign in
        </Link>
      </AuthShell>
    </main>
  );
}
