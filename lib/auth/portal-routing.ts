import type { UserCapabilities } from "@/lib/auth/capabilities";
import { canAuthor } from "@/lib/auth/capabilities";
import type { Portal } from "@/lib/auth/portal-cookie";

export function homeForUser(user: UserCapabilities) {
  return canAuthor(user) ? "/dashboard" : "/blog";
}

export function portalForUser(user: UserCapabilities): Portal {
  return canAuthor(user) ? "mentor" : "learner";
}

export function isSafeNextPath(path: string, user: UserCapabilities) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return false;
  }

  if (canAuthor(user)) {
    return path === "/dashboard" || path.startsWith("/dashboard/");
  }

  return path === "/blog" || path.startsWith("/blog/");
}

export function destinationForUser(user: UserCapabilities, next?: string | null) {
  if (next && isSafeNextPath(next, user)) {
    return next;
  }
  return homeForUser(user);
}
