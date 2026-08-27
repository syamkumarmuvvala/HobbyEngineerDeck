import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAuthor, syncUser } from "@/lib/auth/sync-user";

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

export async function requireAuthor() {
  const appUser = await requireAppUser();
  if (!canAuthor(appUser.role)) {
    return { appUser, allowed: false as const };
  }
  return { appUser, allowed: true as const };
}
