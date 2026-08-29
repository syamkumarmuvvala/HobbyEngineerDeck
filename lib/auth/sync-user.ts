import type { User as AuthUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma/client";
import { displayNameFromParts } from "@/lib/auth/onboarding";

function readString(meta: Record<string, unknown>, key: string) {
  const value = meta[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function profileFromMetadata(user: AuthUser) {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const firstName =
    readString(meta, "first_name") ??
    readString(meta, "given_name") ??
    (readString(meta, "full_name")?.split(" ")[0] ?? null);
  const lastName =
    readString(meta, "last_name") ??
    readString(meta, "family_name") ??
    (() => {
      const full = readString(meta, "full_name");
      if (!full) return null;
      const parts = full.split(" ");
      return parts.length > 1 ? parts.slice(1).join(" ") : null;
    })();
  const name =
    readString(meta, "full_name") ??
    readString(meta, "name") ??
    readString(meta, "user_name") ??
    displayNameFromParts(firstName, lastName);
  const avatarUrl = readString(meta, "avatar_url") ?? readString(meta, "picture");
  const phoneCountryCode = readString(meta, "phone_country_code");
  const phoneNumber = readString(meta, "phone_number");

  return {
    firstName,
    lastName,
    name,
    avatarUrl,
    phoneCountryCode,
    phoneNumber,
  };
}

export async function syncUser(authUser: AuthUser) {
  if (!authUser.email) {
    throw new Error("Authenticated user is missing an email");
  }

  const email = authUser.email;
  const fromMeta = profileFromMetadata(authUser);
  const profile = {
    email,
    ...(fromMeta.name ? { name: fromMeta.name } : {}),
    ...(fromMeta.avatarUrl ? { avatarUrl: fromMeta.avatarUrl } : {}),
  };

  const byId = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (byId) {
    return prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...profile,
        ...(byId.firstName ? {} : fromMeta.firstName ? { firstName: fromMeta.firstName } : {}),
        ...(byId.lastName ? {} : fromMeta.lastName ? { lastName: fromMeta.lastName } : {}),
        ...(byId.phoneCountryCode
          ? {}
          : fromMeta.phoneCountryCode
            ? { phoneCountryCode: fromMeta.phoneCountryCode }
            : {}),
        ...(byId.phoneNumber ? {} : fromMeta.phoneNumber ? { phoneNumber: fromMeta.phoneNumber } : {}),
      },
    });
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: byEmail.id },
        data: { email: `migrated+${byEmail.id}@local.invalid` },
      });
      const created = await tx.user.create({
        data: {
          id: authUser.id,
          email,
          name: fromMeta.name ?? byEmail.name,
          firstName: byEmail.firstName ?? fromMeta.firstName,
          lastName: byEmail.lastName ?? fromMeta.lastName,
          avatarUrl: fromMeta.avatarUrl ?? byEmail.avatarUrl,
          phoneCountryCode: byEmail.phoneCountryCode ?? fromMeta.phoneCountryCode,
          phoneNumber: byEmail.phoneNumber ?? fromMeta.phoneNumber,
          memberType: byEmail.memberType,
          fieldOfStudy: byEmail.fieldOfStudy,
          experienceLevel: byEmail.experienceLevel,
          interestAreas: byEmail.interestAreas,
          location: byEmail.location,
          onboardingCompletedAt: byEmail.onboardingCompletedAt,
          isMember: byEmail.isMember,
          isMentor: byEmail.isMentor,
          isAdmin: byEmail.isAdmin,
        },
      });
      await tx.blogPost.updateMany({
        where: { authorId: byEmail.id },
        data: { authorId: created.id },
      });
      await tx.user.delete({ where: { id: byEmail.id } });
      return created;
    });
  }

  return prisma.user.create({
    data: {
      id: authUser.id,
      email,
      name: fromMeta.name,
      firstName: fromMeta.firstName,
      lastName: fromMeta.lastName,
      avatarUrl: fromMeta.avatarUrl,
      phoneCountryCode: fromMeta.phoneCountryCode,
      phoneNumber: fromMeta.phoneNumber,
      isMember: true,
      isMentor: false,
      isAdmin: false,
    },
  });
}

export { canAuthor, isMember, isAdmin } from "@/lib/auth/capabilities";
