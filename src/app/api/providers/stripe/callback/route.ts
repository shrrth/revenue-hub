import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForToken, getAccountDisplayName } from "@/lib/stripe/connect";
import { encrypt } from "@/lib/encryption";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=stripe_connect_denied`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=stripe_connect_missing_params`
    );
  }

  // Verify state token
  let stateData: { userId: string; nonce: string };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString());
  } catch {
    return NextResponse.redirect(
      `${appUrl}/settings?error=stripe_connect_invalid_state`
    );
  }

  const cookieStore = await cookies();
  const storedNonce = cookieStore.get("stripe_connect_nonce")?.value;
  cookieStore.delete("stripe_connect_nonce");

  if (!storedNonce || storedNonce !== stateData.nonce) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=stripe_connect_csrf`
    );
  }

  // Verify user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== stateData.userId) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  try {
    // Exchange code for access token
    const { accessToken, refreshToken, stripeAccountId } =
      await exchangeCodeForToken(code);

    // Get account display name
    const displayName = await getAccountDisplayName(stripeAccountId);

    // Save provider
    const { error: dbError } = await supabase.from("providers").upsert(
      {
        user_id: user.id,
        type: "stripe",
        stripe_account_id: stripeAccountId,
        access_token_encrypted: encrypt(accessToken),
        refresh_token_encrypted: refreshToken ? encrypt(refreshToken) : null,
        display_name: displayName,
        is_active: true,
      },
      { onConflict: "user_id,stripe_account_id" }
    );

    if (dbError) {
      console.error("Failed to save provider:", dbError);
      return NextResponse.redirect(
        `${appUrl}/settings?error=stripe_connect_save_failed`
      );
    }

    // Redirect to dashboard (or onboarding sync step)
    return NextResponse.redirect(`${appUrl}/onboarding?step=sync`);
  } catch (err) {
    console.error("Stripe Connect callback error:", err);
    return NextResponse.redirect(
      `${appUrl}/settings?error=stripe_connect_exchange_failed`
    );
  }
}
