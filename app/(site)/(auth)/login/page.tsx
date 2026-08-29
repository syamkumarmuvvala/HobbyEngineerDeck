import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center px-4 py-16">
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}
