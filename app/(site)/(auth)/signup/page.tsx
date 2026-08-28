import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center px-4 py-16">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
