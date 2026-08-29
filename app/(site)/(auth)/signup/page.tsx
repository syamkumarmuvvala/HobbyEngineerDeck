import { Suspense } from "react";
import { SignupStepOneForm } from "@/components/auth/signup-step-one-form";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center px-4 py-16">
      <Suspense>
        <SignupStepOneForm />
      </Suspense>
    </main>
  );
}
