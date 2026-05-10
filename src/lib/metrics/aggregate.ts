import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getMetrics(
  userId: string,
  days: number,
  providerId?: string,
  options?: { useAdmin?: boolean }
) {
  const supabase = options?.useAdmin
    ? createAdminClient()
    : await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  let query = supabase
    .from("metrics_daily")
    .select("date, mrr_cents, revenue_cents, refund_cents, new_customers, churned_customers, active_subscriptions")
    .eq("user_id", userId)
    .gte("date", startStr)
    .order("date", { ascending: true });

  if (providerId) {
    query = query.eq("provider_id", providerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch metrics:", error);
    return [];
  }

  return data || [];
}

export async function getRecentEvents(
  userId: string,
  limit = 20,
  options?: { useAdmin?: boolean }
) {
  const supabase = options?.useAdmin
    ? createAdminClient()
    : await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, type, amount_cents, currency, customer_email, customer_name, description, event_at")
    .eq("user_id", userId)
    .order("event_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  return data || [];
}
