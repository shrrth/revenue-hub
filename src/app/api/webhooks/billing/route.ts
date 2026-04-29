import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
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
      process.env.STRIPE_BILLING_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Billing webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id;
      const sessionCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      if (userId && sessionCustomerId) {
        // Verify customer belongs to this user (defense-in-depth)
        const { data: existingUser } = await supabase
          .from("users")
          .select("stripe_customer_id")
          .eq("id", userId)
          .single();

        if (
          existingUser &&
          existingUser.stripe_customer_id === sessionCustomerId
        ) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ plan: "pro" })
            .eq("id", userId);

          if (updateError) {
            console.error("Failed to update plan after checkout:", updateError);
          }
        } else {
          console.error(
            "Checkout customer mismatch:",
            sessionCustomerId,
            "vs",
            existingUser?.stripe_customer_id
          );
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      if (customerId) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error("Failed to downgrade plan on subscription deleted:", updateError);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
