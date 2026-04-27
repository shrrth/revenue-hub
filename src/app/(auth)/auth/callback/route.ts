import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_REDIRECTS = ["/dashboard", "/onboarding", "/settings", "/settings/public"];

function getSafeRedirect(next: string | null): string {
  if (!next) return "/dashboard";
  // Must start with "/" and not "//" (prevent protocol-relative redirect)
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  // Only allow known paths
  if (!ALLOWED_REDIRECTS.includes(next)) return "/dashboard";
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has any providers connected
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: providers } = await supabase
          .from("providers")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        // Redirect to onboarding if no providers connected
        if (!providers || providers.length === 0) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
