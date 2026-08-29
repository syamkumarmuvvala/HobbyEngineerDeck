import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignupStepTwoForm } from "@/components/auth/signup-step-two-form";
import { needsOnboarding } from "@/lib/auth/onboarding";
import { destinationForUser } from "@/lib/auth/portal";
import { requireAppUser } from "@/lib/auth/session";

type ProfilePageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupProfilePage({ searchParams }: ProfilePageProps) {
  const appUser = await requireAppUser();
  const { next } = await searchParams;

  if (!needsOnboarding(appUser)) {
    redirect(destinationForUser(appUser, next));
  }

  return (
    <main className="flex flex-1 items-center px-4 py-16">
      <Suspense>
        <SignupStepTwoForm />
      </Suspense>
    </main>
  );
}
