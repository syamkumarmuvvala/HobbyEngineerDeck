import type { User } from "@/lib/generated/prisma/client";

export type UserCapabilities = Pick<User, "isMember" | "isMentor" | "isAdmin">;

export function canAuthor(user: UserCapabilities) {
  return user.isMentor || user.isAdmin;
}

export function isMember(user: Pick<User, "isMember">) {
  return user.isMember;
}

export function isAdmin(user: Pick<User, "isAdmin">) {
  return user.isAdmin;
}
