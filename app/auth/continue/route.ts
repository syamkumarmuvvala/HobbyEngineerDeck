import { redirect } from "next/navigation";
import { resolvePostAuthDestination } from "@/lib/auth/onboarding";
import { getAuthUser } from "@/lib/auth/session";
import { syncUser } from "@/lib/auth/sync-user";
import { portalForUser, writePortalCookie } from "@/lib/auth/portal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next");

  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  const appUser = await syncUser(authUser);
  await writePortalCookie(portalForUser(appUser));
  redirect(resolvePostAuthDestination(appUser, next));
}
