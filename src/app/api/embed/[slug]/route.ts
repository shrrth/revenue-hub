import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMetrics } from "@/lib/metrics/aggregate";
import { checkRateLimit } from "@/lib/rate-limit";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;

  // Rate limit by slug to prevent abuse on popular public pages
  const { allowed } = await checkRateLimit(`embed:${slug}`, {
    windowMs: 60_000,
    maxRequests: 60,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  const supabase = createAdminClient();

  const { data: page } = await supabase
    .from("public_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_enabled", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const metrics = await getMetrics(page.user_id, 30, undefined, { useAdmin: true });
  const latestMrr =
    metrics.length > 0 ? metrics[metrics.length - 1].mrr_cents : 0;
  const totalRevenue = metrics.reduce(
    (s: number, m: { revenue_cents: number }) => s + m.revenue_cents,
    0
  );
  const totalCustomers = metrics.reduce(
    (s: number, m: { new_customers: number }) => s + m.new_customers,
    0
  );

  const data: Record<string, number> = {};
  if (page.show_mrr) data.mrr_cents = latestMrr;
  if (page.show_revenue) data.total_revenue_cents = totalRevenue;
  if (page.show_customers) data.total_customers = totalCustomers;

  return NextResponse.json(
    { data, title: page.custom_title, slug: page.slug },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
