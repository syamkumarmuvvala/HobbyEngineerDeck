"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, SignInLink } from "@/components/auth/auth-shell";
import { ConfirmPasswordField, PasswordField } from "@/components/auth/password-field";
import { PhoneField, PHONE_COUNTRY_CODES } from "@/components/auth/phone-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordValid, passwordsMatch } from "@/lib/auth/password";
import { createClient } from "@/lib/supabase/client";

export function SignupStepOneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/blog";
  const profileNext = `/signup/profile${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>(PHONE_COUNTRY_CODES[0].value);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    if (!isPasswordValid(password)) {
      toast.error("Password does not meet all requirements");
      return;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const trimmedPhone = phoneNumber.trim();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          ...(trimmedPhone
            ? { phone_country_code: phoneCountryCode, phone_number: trimmedPhone }
            : {}),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(profileNext)}`,
      },
    });

    if (error) {
      setPending(false);
      toast.error(error.message);
      return;
    }

    const params = new URLSearchParams({ email: email.trim() });
    router.push(`/signup/verify-email?${params.toString()}`);
  }

  async function onGoogle() {
    setGooglePending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(profileNext)}`,
      },
    });
    if (error) {
      setGooglePending(false);
      toast.error(error.message);
    }
  }

  return (
    <AuthShell
      step="Step 1 of 2"
      title="Create an account"
      description="Join HobbyEngineerDeck as a member. Mentors are invited separately."
      footer={<SignInLink />}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <PhoneField
          countryCode={phoneCountryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setPhoneCountryCode}
          onPhoneNumberChange={setPhoneNumber}
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          showRequirements
        />
        <ConfirmPasswordField
          password={password}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <Button type="submit" className="w-full" loading={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        loading={googlePending}
        onClick={onGoogle}
      >
        Continue with Google
      </Button>
    </AuthShell>
  );
}
