import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAuthor } from "@/lib/auth/capabilities";
import { getActivePortal } from "@/lib/auth/portal";
import { syncUser } from "@/lib/auth/sync-user";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAppUser() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return syncUser(user);
}

export async function getAppUser() {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }
  return syncUser(user);
}

export async function requireAuthor() {
  const appUser = await requireAppUser();
  if (!canAuthor(appUser)) {
    return { appUser, allowed: false as const };
  }
  return { appUser, allowed: true as const };
}

export async function getSessionContext() {
  const appUser = await getAppUser();
  if (!appUser) {
    return { appUser: null, activePortal: "learner" as const };
  }

  return {
    appUser,
    activePortal: await getActivePortal(appUser),
  };
}
