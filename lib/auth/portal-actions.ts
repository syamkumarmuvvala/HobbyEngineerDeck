"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { canAuthor } from "@/lib/auth/capabilities";
import { PORTAL_COOKIE, type Portal } from "@/lib/auth/portal";
import { requireAppUser } from "@/lib/auth/session";

export async function setPortal(portal: Portal) {
  const appUser = await requireAppUser();
  const nextPortal: Portal = portal === "mentor" && canAuthor(appUser) ? "mentor" : "learner";

  const cookieStore = await cookies();
  cookieStore.set(PORTAL_COOKIE, nextPortal, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  redirect(nextPortal === "mentor" ? "/dashboard/blog" : "/blog");
}
