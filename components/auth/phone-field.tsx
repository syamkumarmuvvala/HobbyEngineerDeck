"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const PHONE_COUNTRY_CODES = [
  { value: "+1", label: "US +1" },
  { value: "+44", label: "UK +44" },
  { value: "+91", label: "IN +91" },
  { value: "+61", label: "AU +61" },
  { value: "+49", label: "DE +49" },
  { value: "+33", label: "FR +33" },
  { value: "+81", label: "JP +81" },
  { value: "+86", label: "CN +86" },
  { value: "+971", label: "AE +971" },
  { value: "+65", label: "SG +65" },
  { value: "+55", label: "BR +55" },
  { value: "+52", label: "MX +52" },
  { value: "+27", label: "ZA +27" },
  { value: "+82", label: "KR +82" },
  { value: "+31", label: "NL +31" },
] as const;

type PhoneFieldProps = {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
};

export function PhoneField({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
}: PhoneFieldProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-phone`}>Mobile number (optional)</Label>
      <div className="flex gap-2">
        <Select
          aria-label="Country code"
          className="w-28 shrink-0"
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
        >
          {PHONE_COUNTRY_CODES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(event) => onPhoneNumberChange(event.target.value.replace(/[^\d\s-]/g, ""))}
        />
      </div>
    </div>
  );
}
