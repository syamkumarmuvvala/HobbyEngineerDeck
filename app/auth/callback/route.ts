import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/auth/sync-user";
import { applyPortalCookie, destinationForUser, portalForUser, writePortalCookie } from "@/lib/auth/portal";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const appUser = await syncUser(data.user);
      await writePortalCookie(portalForUser(appUser));
      const response = NextResponse.redirect(new URL(destinationForUser(appUser, next), origin));
      applyPortalCookie(response.cookies, portalForUser(appUser));
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
