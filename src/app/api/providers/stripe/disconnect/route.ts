import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const providerId = body.providerId as string | undefined;

  if (!providerId) {
    return NextResponse.json(
      { error: "providerId is required" },
      { status: 400 }
    );
  }

  // Verify provider belongs to user
  const { data: provider } = await supabase
    .from("providers")
    .select("id, stripe_account_id")
    .eq("id", providerId)
    .eq("user_id", user.id)
    .single();

  if (!provider) {
    return NextResponse.json(
      { error: "Provider not found" },
      { status: 404 }
    );
  }

  // Deauthorize on Stripe side
  try {
    const stripe = getStripe();
    await stripe.oauth.deauthorize({
      client_id: process.env.STRIPE_CONNECT_CLIENT_ID!,
      stripe_user_id: provider.stripe_account_id,
    });
  } catch (err) {
    console.error("Stripe deauthorize error (continuing):", err);
    // Continue even if Stripe call fails — still remove from our DB
  }

  // Soft-delete: mark inactive
  const { error } = await supabase
    .from("providers")
    .update({ is_active: false })
    .eq("id", providerId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to disconnect provider" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
