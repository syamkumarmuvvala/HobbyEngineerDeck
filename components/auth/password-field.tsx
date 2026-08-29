"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_REQUIREMENTS } from "@/lib/auth/password";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  showRequirements?: boolean;
};

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete = "new-password",
  showRequirements = false,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      {showRequirements ? (
        <ul className="space-y-1">
          {PASSWORD_REQUIREMENTS.map((requirement) => {
            const met = requirement.test(value);
            return (
              <li
                key={requirement.id}
                className={cn(
                  "text-xs",
                  met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                )}
              >
                {met ? "✓" : "○"} {requirement.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

type ConfirmPasswordFieldProps = {
  password: string;
  value: string;
  onChange: (value: string) => void;
};

export function ConfirmPasswordField({ password, value, onChange }: ConfirmPasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const matches = value.length > 0 && password === value;
  const mismatch = value.length > 0 && password !== value;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Confirm password</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          aria-invalid={mismatch || undefined}
          onChange={(event) => onChange(event.target.value)}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      {matches ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">Passwords match</p>
      ) : null}
      {mismatch ? (
        <p className="text-destructive text-xs">Passwords do not match</p>
      ) : null}
    </div>
  );
}
