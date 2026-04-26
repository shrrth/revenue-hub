"use client";

import { DollarSign, Users, TrendingDown, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MrrChart } from "@/components/dashboard/mrr-chart";
import { CustomerChart } from "@/components/dashboard/customer-chart";
import { EventFeed } from "@/components/dashboard/event-feed";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { useUser } from "@/hooks/use-user";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { getMaxDaysHistory } from "@/lib/plans";

export default function DashboardPage() {
  const { user } = useUser();
  const { metrics, dashboard, events, loading, error, days, setDays, retry } = useDashboard();

  const maxDays = getMaxDaysHistory(user?.plan ?? "free");

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="text-lg font-semibold">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={retry} variant="outline">Try again</Button>
      </div>
    );
  }

  if (metrics.length === 0 && events.length === 0) {
    return (
      <EmptyState
        title="No data yet"
        description="Connect your Stripe account and sync your data to see your dashboard."
        actionLabel="Connect Stripe"
        actionHref="/settings"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <PeriodSelector selected={days} maxDays={maxDays} onChange={setDays} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="MRR"
          value={formatCurrency(dashboard.mrr)}
          change={dashboard.mrrChange}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(dashboard.totalRevenue)}
          change={dashboard.revenueChange}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Customers"
          value={formatNumber(dashboard.totalCustomers)}
          change={dashboard.customerChange}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Churn Rate"
          value={`${dashboard.churnRate.toFixed(1)}%`}
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MrrChart data={metrics} />
        <CustomerChart data={metrics} />
      </div>

      <EventFeed events={events} />
    </div>
  );
}
