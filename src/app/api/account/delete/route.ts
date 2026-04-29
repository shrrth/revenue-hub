import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // 1. Cancel active Stripe subscription if exists
  const { data: userData } = await adminClient
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (userData?.stripe_customer_id) {
    try {
      const stripe = getStripe();
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripe_customer_id,
        status: "active",
      });
      for (const sub of subscriptions.data) {
        await stripe.subscriptions.cancel(sub.id);
      }
    } catch (err) {
      console.error("Failed to cancel Stripe subscriptions:", err);
      // Continue with deletion even if Stripe cleanup fails
    }
  }

  // 2. Deactivate all providers
  await adminClient
    .from("providers")
    .update({ is_active: false })
    .eq("user_id", user.id);

  // 3. Delete user data (cascading FKs will handle events, metrics, etc.)
  const { error: deleteError } = await adminClient
    .from("users")
    .delete()
    .eq("id", user.id);

  if (deleteError) {
    console.error("Failed to delete user data:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  // 4. Delete auth user (requires admin client)
  const { error: authError } =
    await adminClient.auth.admin.deleteUser(user.id);

  if (authError) {
    console.error("Failed to delete auth user:", authError);
    // Data is already deleted, auth cleanup failure is non-critical
  }

  return NextResponse.json({ success: true });
}
