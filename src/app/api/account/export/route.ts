import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 3 exports per hour
  const { allowed } = await checkRateLimit(`export:${user.id}`, {
    windowMs: 3_600_000,
    maxRequests: 3,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many export requests. Please try again later." },
      { status: 429 }
    );
  }

  // Fetch all user data
  const [profileResult, providersResult, eventsResult, metricsResult, publicPageResult] =
    await Promise.allSettled([
      supabase.from("users").select("*").eq("id", user.id).single(),
      supabase
        .from("providers")
        .select("id, type, stripe_account_id, display_name, last_synced_at, is_active, created_at")
        .eq("user_id", user.id),
      supabase
        .from("events")
        .select("type, amount_cents, currency, customer_email, customer_name, description, event_at")
        .eq("user_id", user.id)
        .order("event_at", { ascending: false }),
      supabase
        .from("metrics_daily")
        .select("date, mrr_cents, revenue_cents, refund_cents, new_customers, churned_customers, active_subscriptions")
        .eq("user_id", user.id)
        .order("date", { ascending: true }),
      supabase
        .from("public_pages")
        .select("slug, is_enabled, show_mrr, show_revenue, show_customers, show_chart, theme, custom_title, custom_description")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    profile:
      profileResult.status === "fulfilled" ? profileResult.value.data : null,
    providers:
      providersResult.status === "fulfilled"
        ? providersResult.value.data
        : [],
    events:
      eventsResult.status === "fulfilled" ? eventsResult.value.data : [],
    metrics_daily:
      metricsResult.status === "fulfilled" ? metricsResult.value.data : [],
    public_page:
      publicPageResult.status === "fulfilled"
        ? publicPageResult.value.data
        : null,
  };

  // Remove sensitive fields from profile
  if (exportData.profile) {
    const { stripe_customer_id: _, ...safeProfile } = exportData.profile as Record<string, unknown> & { stripe_customer_id?: string };
    exportData.profile = safeProfile;
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="revenue-hub-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
