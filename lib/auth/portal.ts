import { cookies } from "next/headers";
import type { UserCapabilities } from "@/lib/auth/capabilities";
import { canAuthor } from "@/lib/auth/capabilities";

export const PORTAL_COOKIE = "hed_portal";

export type Portal = "learner" | "mentor";

export async function getActivePortal(user: UserCapabilities): Promise<Portal> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PORTAL_COOKIE)?.value;

  if (value === "mentor" && canAuthor(user)) {
    return "mentor";
  }

  return "learner";
}
