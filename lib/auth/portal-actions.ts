"use server";

import { redirect } from "next/navigation";
import { canAuthor } from "@/lib/auth/capabilities";
import { writePortalCookie, type Portal } from "@/lib/auth/portal";
import { requireAppUser } from "@/lib/auth/session";

export async function setPortal(portal: Portal) {
  const appUser = await requireAppUser();
  const nextPortal: Portal = portal === "mentor" && canAuthor(appUser) ? "mentor" : "learner";

  await writePortalCookie(nextPortal);
  redirect(nextPortal === "mentor" ? "/dashboard" : "/blog");
}
