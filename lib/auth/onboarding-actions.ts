"use server";

import { redirect } from "next/navigation";
import type { ExperienceLevel, FieldOfStudy, MemberType } from "@/lib/generated/prisma/client";
import {
  displayNameFromParts,
  EXPERIENCE_LEVEL_VALUES,
  FIELD_OF_STUDY_VALUES,
  INTEREST_AREA_SLUGS,
  MEMBER_TYPES,
} from "@/lib/auth/onboarding";
import { destinationForUser } from "@/lib/auth/portal-routing";
import { requireAppUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";

function readNext(formData: FormData) {
  const next = String(formData.get("next") ?? "").trim();
  return next || null;
}

function parseMemberType(value: string): MemberType | null {
  return MEMBER_TYPES.includes(value as MemberType) ? (value as MemberType) : null;
}

function parseFieldOfStudy(value: string): FieldOfStudy | null {
  if (!value) return null;
  return FIELD_OF_STUDY_VALUES.includes(value as FieldOfStudy) ? (value as FieldOfStudy) : null;
}

function parseExperienceLevel(value: string): ExperienceLevel | null {
  if (!value) return null;
  return EXPERIENCE_LEVEL_VALUES.includes(value as ExperienceLevel)
    ? (value as ExperienceLevel)
    : null;
}

function parseInterestAreas(formData: FormData) {
  return INTEREST_AREA_SLUGS.filter((slug) => formData.get(`interest-${slug}`) === "on");
}

export async function saveOnboardingProfile(formData: FormData) {
  const appUser = await requireAppUser();
  const next = readNext(formData);
  const memberType = parseMemberType(String(formData.get("memberType") ?? ""));

  if (!memberType) {
    throw new Error("Please choose what best describes you");
  }

  const fieldOfStudy =
    memberType === "STUDENT"
      ? parseFieldOfStudy(String(formData.get("fieldOfStudy") ?? ""))
      : null;
  const experienceLevel = parseExperienceLevel(String(formData.get("experienceLevel") ?? ""));
  const interestAreas = parseInterestAreas(formData);
  const location = String(formData.get("location") ?? "").trim() || null;

  const updated = await prisma.user.update({
    where: { id: appUser.id },
    data: {
      memberType,
      fieldOfStudy,
      experienceLevel,
      interestAreas,
      location,
      name: displayNameFromParts(appUser.firstName, appUser.lastName) ?? appUser.name,
      onboardingCompletedAt: new Date(),
    },
  });

  redirect(destinationForUser(updated, next));
}

export async function skipOnboarding(formData: FormData) {
  const appUser = await requireAppUser();
  const next = readNext(formData);

  const updated = await prisma.user.update({
    where: { id: appUser.id },
    data: {
      onboardingCompletedAt: new Date(),
    },
  });

  redirect(destinationForUser(updated, next));
}
