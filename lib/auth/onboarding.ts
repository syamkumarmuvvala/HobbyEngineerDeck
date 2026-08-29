import type {
  ExperienceLevel,
  FieldOfStudy,
  MemberType,
  User,
} from "@/lib/generated/prisma/client";
import type { UserCapabilities } from "@/lib/auth/capabilities";
import { destinationForUser } from "@/lib/auth/portal-routing";

export type OnboardingUser = Pick<User, "onboardingCompletedAt">;

export function needsOnboarding(user: OnboardingUser) {
  return user.onboardingCompletedAt === null;
}

export function onboardingDestination(next?: string | null) {
  const params = new URLSearchParams();
  if (next) {
    params.set("next", next);
  }
  const query = params.toString();
  return query ? `/signup/profile?${query}` : "/signup/profile";
}

export function resolvePostAuthDestination(user: UserCapabilities & OnboardingUser, next?: string | null) {
  if (needsOnboarding(user)) {
    return onboardingDestination(next);
  }
  return destinationForUser(user, next);
}

export function displayNameFromParts(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || null;
}

export const MEMBER_TYPE_OPTIONS: { value: MemberType; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "SOFTWARE_AI_ENGINEER", label: "Software/AI Engineer" },
  { value: "HARDWARE_ENGINEER", label: "Hardware/Electronics Engineer" },
  { value: "DEVOPS_CLOUD_ENGINEER", label: "DevOps/Cloud Engineer" },
  { value: "DATA_ENGINEER", label: "Data Engineer/Scientist" },
  { value: "OTHER", label: "Other" },
];

export const FIELD_OF_STUDY_OPTIONS: { value: FieldOfStudy; label: string }[] = [
  { value: "COMPUTER_SCIENCE", label: "Computer Science" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "MECHANICAL", label: "Mechanical" },
  { value: "OTHER", label: "Other" },
];

export const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "JUST_STARTING", label: "Just starting out" },
  { value: "COMFORTABLE_BASICS", label: "Comfortable with basics" },
  { value: "BUILDING_PROJECTS", label: "Building real projects" },
];

export const INTEREST_AREA_OPTIONS = [
  { value: "ai-ml", label: "AI/ML" },
  { value: "web-dev", label: "Web Dev" },
  { value: "embedded-hardware", label: "Embedded/Hardware" },
  { value: "cloud-devops", label: "Cloud/DevOps" },
] as const;

export type InterestAreaSlug = (typeof INTEREST_AREA_OPTIONS)[number]["value"];

export const MEMBER_TYPES = MEMBER_TYPE_OPTIONS.map((option) => option.value);
export const FIELD_OF_STUDY_VALUES = FIELD_OF_STUDY_OPTIONS.map((option) => option.value);
export const EXPERIENCE_LEVEL_VALUES = EXPERIENCE_LEVEL_OPTIONS.map((option) => option.value);
export const INTEREST_AREA_SLUGS = INTEREST_AREA_OPTIONS.map((option) => option.value);
