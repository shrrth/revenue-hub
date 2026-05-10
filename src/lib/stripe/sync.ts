import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { SYNC_DAYS } from "@/lib/constants";
import type { StripeSyncResult } from "@/types";

export async function syncStripeHistory(
  providerId: string,
  userId: string,
  accessToken: string
): Promise<StripeSyncResult> {
  const result: StripeSyncResult = {
    chargesProcessed: 0,
    subscriptionsProcessed: 0,
    errors: [],
  };

  const stripe = new Stripe(accessToken, {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createAdminClient();
  const sinceTimestamp = Math.floor(
    Date.now() / 1000 - SYNC_DAYS * 24 * 60 * 60
  );

  // Sync charges
  try {
    for await (const charge of stripe.charges.list({
      created: { gte: sinceTimestamp },
      limit: 100,
    })) {
      const eventId = `sync_charge_${charge.id}`;
      const type =
        charge.refunded || (charge.amount_refunded ?? 0) > 0
          ? "charge.refunded"
          : "charge.succeeded";

      const { error } = await supabase.from("events").upsert(
        {
          user_id: userId,
          provider_id: providerId,
          stripe_event_id: eventId,
          type,
          amount_cents:
            type === "charge.refunded"
              ? charge.amount_refunded ?? 0
              : charge.amount,
          currency: charge.currency,
          customer_email:
            typeof charge.receipt_email === "string"
              ? charge.receipt_email
              : null,
          description: typeof charge.description === "string" ? charge.description : null,
          event_at: new Date(charge.created * 1000).toISOString(),
        },
        { onConflict: "stripe_event_id" }
      );

      if (error) {
        result.errors.push(`Charge ${charge.id}: ${error.message}`);
      } else {
        result.chargesProcessed++;
      }
    }
  } catch (err) {
    result.errors.push(
      `Charges sync error: ${err instanceof Error ? err.message : "Unknown"}`
    );
  }

  // Sync subscriptions
  try {
    for await (const sub of stripe.subscriptions.list({
      created: { gte: sinceTimestamp },
      limit: 100,
      status: "all",
    })) {
      const amount = sub.items.data[0]?.price?.unit_amount || 0;
      const type =
        sub.status === "canceled"
          ? "customer.subscription.deleted"
          : "customer.subscription.created";
      const eventId = `sync_sub_${sub.id}`;

      const { error } = await supabase.from("events").upsert(
        {
          user_id: userId,
          provider_id: providerId,
          stripe_event_id: eventId,
          type,
          amount_cents: amount,
          currency: sub.currency,
          description: `Subscription ${sub.status}`,
          event_at: new Date(sub.created * 1000).toISOString(),
        },
        { onConflict: "stripe_event_id" }
      );

      if (error) {
        result.errors.push(`Subscription ${sub.id}: ${error.message}`);
      } else {
        result.subscriptionsProcessed++;
      }
    }
  } catch (err) {
    result.errors.push(
      `Subscriptions sync error: ${err instanceof Error ? err.message : "Unknown"}`
    );
  }

  // Re-aggregate daily metrics for the sync period (batched, 10 concurrent)
  const startDate = new Date(sinceTimestamp * 1000);
  const today = new Date();
  const dates: string[] = [];
  for (
    let d = new Date(startDate);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    dates.push(d.toISOString().split("T")[0]);
  }

  const BATCH_SIZE = 10;
  for (let i = 0; i < dates.length; i += BATCH_SIZE) {
    const batch = dates.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(
      batch.map((dateStr) =>
        supabase.rpc("aggregate_daily_metrics", {
          p_user_id: userId,
          p_provider_id: providerId,
          p_date: dateStr,
        })
      )
    );
    for (const [idx, outcome] of settled.entries()) {
      if (outcome.status === "rejected") {
        result.errors.push(`Aggregation ${batch[idx]}: ${outcome.reason}`);
      } else if (outcome.value.error) {
        result.errors.push(`Aggregation ${batch[idx]}: ${outcome.value.error.message}`);
      }
    }
  }

  // Update last_synced_at
  await supabase
    .from("providers")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", providerId);

  return result;
}
