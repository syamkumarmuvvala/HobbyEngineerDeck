import type { User as AuthUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma/client";
import type { Role } from "@/lib/generated/prisma/client";

function displayName(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  const name = meta.full_name ?? meta.name ?? meta.user_name;
  return typeof name === "string" && name.length > 0 ? name : null;
}

function avatarUrl(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  const url = meta.avatar_url ?? meta.picture;
  return typeof url === "string" && url.length > 0 ? url : null;
}

export async function syncUser(authUser: AuthUser) {
  if (!authUser.email) {
    throw new Error("Authenticated user is missing an email");
  }

  return prisma.user.upsert({
    where: { id: authUser.id },
    create: {
      id: authUser.id,
      email: authUser.email,
      name: displayName(authUser),
      avatarUrl: avatarUrl(authUser),
      role: "MEMBER",
    },
    update: {
      email: authUser.email,
      name: displayName(authUser) ?? undefined,
      avatarUrl: avatarUrl(authUser) ?? undefined,
    },
  });
}

export function canAuthor(role: Role) {
  return role === "MENTOR" || role === "ADMIN";
}
