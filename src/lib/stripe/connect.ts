import { getStripe } from "./client";

export function buildConnectUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.STRIPE_CONNECT_CLIENT_ID!,
    scope: "read_only",
    state,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/providers/stripe/callback`,
  });
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const stripe = getStripe();
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code,
  });
  return {
    accessToken: response.access_token!,
    refreshToken: response.refresh_token ?? null,
    stripeAccountId: response.stripe_user_id!,
  };
}

export async function getAccountDisplayName(
  stripeAccountId: string
): Promise<string | null> {
  const stripe = getStripe();
  try {
    const account = await stripe.accounts.retrieve(stripeAccountId);
    return (
      account.settings?.dashboard?.display_name ??
      account.business_profile?.name ??
      null
    );
  } catch {
    return null;
  }
}
