import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncStripeHistory } from "@/lib/stripe/sync";
import { checkRateLimit } from "@/lib/rate-limit";
import { decrypt } from "@/lib/encryption";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 3 syncs per minute per user
  const { allowed } = await checkRateLimit(`sync:${user.id}`, {
    windowMs: 60_000,
    maxRequests: 3,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many sync requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const providerId = body.providerId as string | undefined;

  // Get provider(s) to sync
  let query = supabase
    .from("providers")
    .select("id, user_id, access_token_encrypted")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (providerId) {
    query = query.eq("id", providerId);
  }

  const { data: providers, error } = await query;

  if (error || !providers?.length) {
    return NextResponse.json(
      { error: "No providers found" },
      { status: 404 }
    );
  }

  const results = [];
  for (const provider of providers) {
    const accessToken = decrypt(provider.access_token_encrypted);
    const result = await syncStripeHistory(
      provider.id,
      provider.user_id,
      accessToken
    );
    results.push({ providerId: provider.id, ...result });
  }

  return NextResponse.json({ data: results });
}
