import type { MetricsPoint, DashboardData } from "@/types";

export function calculateDashboardData(
  metrics: MetricsPoint[]
): DashboardData {
  if (metrics.length === 0) {
    return {
      mrr: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      churnRate: 0,
      mrrChange: 0,
      revenueChange: 0,
      customerChange: 0,
    };
  }

  const latest = metrics[metrics.length - 1];
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue_cents, 0);
  const totalCustomers = metrics.reduce(
    (sum, m) => sum + m.new_customers,
    0
  );

  // Calculate changes (compare last half vs first half of period)
  const mid = Math.floor(metrics.length / 2);
  const firstHalf = metrics.slice(0, mid);
  const secondHalf = metrics.slice(mid);

  const firstRevenue = firstHalf.reduce((s, m) => s + m.revenue_cents, 0);
  const secondRevenue = secondHalf.reduce((s, m) => s + m.revenue_cents, 0);
  const revenueChange =
    firstRevenue > 0
      ? ((secondRevenue - firstRevenue) / firstRevenue) * 100
      : 0;

  const firstCustomers = firstHalf.reduce((s, m) => s + m.new_customers, 0);
  const secondCustomers = secondHalf.reduce(
    (s, m) => s + m.new_customers,
    0
  );
  const customerChange =
    firstCustomers > 0
      ? ((secondCustomers - firstCustomers) / firstCustomers) * 100
      : 0;

  // MRR change: compare latest vs earliest
  const firstMrr = metrics[0].mrr_cents;
  const latestMrr = latest.mrr_cents;
  const mrrChange =
    firstMrr > 0 ? ((latestMrr - firstMrr) / firstMrr) * 100 : 0;

  // Churn rate
  const totalChurned = metrics.reduce(
    (s, m) => s + m.churned_customers,
    0
  );
  const avgSubs =
    metrics.reduce((s, m) => s + m.active_subscriptions, 0) / metrics.length;
  const churnRate = avgSubs > 0 ? (totalChurned / avgSubs) * 100 : 0;

  return {
    mrr: latest.mrr_cents,
    totalRevenue,
    totalCustomers,
    churnRate,
    mrrChange,
    revenueChange,
    customerChange,
  };
}
