import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { parseStripeEvent } from "@/lib/stripe/webhook";
import { createAdminClient } from "@/lib/supabase/admin";
import { STRIPE_EVENTS_TO_TRACK } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.text(); // CRITICAL: raw body for signature verification
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Only process events we care about
  if (
    !STRIPE_EVENTS_TO_TRACK.includes(
      event.type as (typeof STRIPE_EVENTS_TO_TRACK)[number]
    )
  ) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();
  const stripeAccountId = event.account;

  if (!stripeAccountId) {
    return NextResponse.json({ received: true });
  }

  // Find the provider for this Stripe account
  const { data: provider } = await supabase
    .from("providers")
    .select("id, user_id")
    .eq("stripe_account_id", stripeAccountId)
    .eq("is_active", true)
    .single();

  if (!provider) {
    console.warn(`No provider found for Stripe account: ${stripeAccountId}`);
    return NextResponse.json({ received: true });
  }

  // Parse the event
  const parsed = parseStripeEvent(event);
  if (!parsed) {
    return NextResponse.json({ received: true });
  }

  // Insert event (idempotent via stripe_event_id unique constraint)
  const { error: insertError } = await supabase.from("events").insert({
    user_id: provider.user_id,
    provider_id: provider.id,
    stripe_event_id: event.id,
    type: parsed.type,
    amount_cents: parsed.amountCents,
    currency: parsed.currency,
    customer_email: parsed.customerEmail,
    customer_name: parsed.customerName,
    description: parsed.description,
    event_at: parsed.eventAt,
  });

  if (insertError) {
    // Duplicate event (unique constraint) is OK
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("Failed to insert event:", insertError);
    return NextResponse.json(
      { error: "Failed to save event" },
      { status: 500 }
    );
  }

  // Re-aggregate metrics for the event date (with retry)
  const eventDate = parsed.eventAt.split("T")[0];
  let aggregated = false;

  for (let attempt = 0; attempt < 3; attempt++) {
    const { error: rpcError } = await supabase.rpc("aggregate_daily_metrics", {
      p_user_id: provider.user_id,
      p_provider_id: provider.id,
      p_date: eventDate,
    });

    if (!rpcError) {
      aggregated = true;
      break;
    }

    console.error(
      `Failed to aggregate daily metrics (attempt ${attempt + 1}/3):`,
      rpcError
    );

    // Brief pause before retry
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  return NextResponse.json({ received: true, aggregated });
}
