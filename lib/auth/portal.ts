import { cookies } from "next/headers";
import type { UserCapabilities } from "@/lib/auth/capabilities";
import { canAuthor } from "@/lib/auth/capabilities";
import {
  applyPortalCookie,
  PORTAL_COOKIE,
  type Portal,
} from "@/lib/auth/portal-cookie";

export {
  applyPortalCookie,
  PORTAL_COOKIE,
  portalCookieOptions,
  portalForPath,
  type Portal,
} from "@/lib/auth/portal-cookie";

export {
  destinationForUser,
  homeForUser,
  isSafeNextPath,
  portalForUser,
} from "@/lib/auth/portal-routing";

export async function writePortalCookie(portal: Portal) {
  const cookieStore = await cookies();
  applyPortalCookie(cookieStore, portal);
}

export async function getActivePortal(user: UserCapabilities): Promise<Portal> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PORTAL_COOKIE)?.value;

  if (value === "mentor" && canAuthor(user)) {
    return "mentor";
  }

  return "learner";
}
