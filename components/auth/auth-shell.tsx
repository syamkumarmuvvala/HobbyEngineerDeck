"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  step?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ step, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {step ? <p className="text-muted-foreground text-xs font-medium uppercase">{step}</p> : null}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      {footer}
    </div>
  );
}

export function SignInLink() {
  return (
    <p className="text-muted-foreground text-center text-sm">
      Already have an account?{" "}
      <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
        Sign in
      </Link>
    </p>
  );
}

export function SignUpLink() {
  return (
    <p className="text-muted-foreground text-center text-sm">
      New here?{" "}
      <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
        Create an account
      </Link>
    </p>
  );
}
