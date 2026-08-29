export const PORTAL_COOKIE = "hed_portal";

export type Portal = "learner" | "mentor";

export const portalCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  httpOnly: true,
};

export function applyPortalCookie(
  store: { set: (name: string, value: string, options?: typeof portalCookieOptions) => void },
  portal: Portal,
) {
  store.set(PORTAL_COOKIE, portal, portalCookieOptions);
}

export function portalForPath(pathname: string): Portal | null {
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "mentor";
  }

  if (
    pathname === "/" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/")
  ) {
    return "learner";
  }

  return null;
}
