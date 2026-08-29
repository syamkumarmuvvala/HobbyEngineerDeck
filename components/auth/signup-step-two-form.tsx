"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { saveOnboardingProfile, skipOnboarding } from "@/lib/auth/onboarding-actions";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  FIELD_OF_STUDY_OPTIONS,
  INTEREST_AREA_OPTIONS,
  MEMBER_TYPE_OPTIONS,
} from "@/lib/auth/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function SignupStepTwoForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [memberType, setMemberType] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [skipPending, setSkipPending] = useState(false);

  function toggleInterest(slug: string) {
    setSelectedInterests((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberType) return;
    setPending(true);
    try {
      const formData = new FormData(event.currentTarget);
      selectedInterests.forEach((slug) => formData.set(`interest-${slug}`, "on"));
      await saveOnboardingProfile(formData);
    } catch (error) {
      setPending(false);
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    }
  }

  async function onSkip() {
    setSkipPending(true);
    try {
      const formData = new FormData();
      if (next) formData.set("next", next);
      await skipOnboarding(formData);
    } catch (error) {
      setSkipPending(false);
      toast.error(error instanceof Error ? error.message : "Could not skip onboarding");
    }
  }

  return (
    <AuthShell
      step="Step 2 of 2"
      title="Tell us about you"
      description="Help us tailor your experience. You can skip this and complete it later."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}

        <div className="space-y-2">
          <Label htmlFor="memberType">What best describes you?</Label>
          <Select
            id="memberType"
            name="memberType"
            required
            value={memberType}
            onChange={(event) => setMemberType(event.target.value)}
          >
            <option value="" disabled>
              Select one
            </option>
            {MEMBER_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {memberType === "STUDENT" ? (
          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of study (optional)</Label>
            <Select id="fieldOfStudy" name="fieldOfStudy" defaultValue="">
              <option value="">Select one</option>
              {FIELD_OF_STUDY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience level (optional)</Label>
          <Select id="experienceLevel" name="experienceLevel" defaultValue="">
            <option value="">Select one</option>
            {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Primary interest areas (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_AREA_OPTIONS.map((option) => {
              const active = selectedInterests.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleInterest(option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" name="location" placeholder="City, Country" autoComplete="address-level2" />
        </div>

        <Button type="submit" className="w-full" loading={pending} disabled={!memberType || skipPending}>
          Continue
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        loading={skipPending}
        disabled={pending}
        onClick={onSkip}
      >
        Complete later
      </Button>
    </AuthShell>
  );
}
