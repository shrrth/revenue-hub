"use client";

import { useState, useMemo } from "react";
import { DollarSign, Users, TrendingDown, CreditCard } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MrrChart } from "@/components/dashboard/mrr-chart";
import { CustomerChart } from "@/components/dashboard/customer-chart";
import { EventFeed } from "@/components/dashboard/event-feed";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { MetricsPoint } from "@/types";

// --- Fake data generation ---

// Simple seeded PRNG for deterministic fake data (avoids hydration mismatch)
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateMetrics(days: number): MetricsPoint[] {
  const data: MetricsPoint[] = [];
  const rand = seededRandom(days * 42);
  // Use a fixed reference date to avoid server/client date mismatch
  const now = new Date("2026-03-04T00:00:00Z");
  let mrr = 120000; // $1,200 starting MRR

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate organic growth with some randomness
    const growth = rand() * 0.04 - 0.01; // -1% to +3%
    mrr = Math.round(mrr * (1 + growth));
    const revenue = Math.round(mrr * 0.3 + rand() * 5000);
    const newCust = Math.floor(rand() * 5) + 1;
    const churned = rand() > 0.7 ? Math.floor(rand() * 2) + 1 : 0;

    data.push({
      date: date.toISOString().split("T")[0],
      mrr_cents: mrr,
      revenue_cents: revenue,
      new_customers: newCust,
      churned_customers: churned,
      active_subscriptions: 42 + Math.floor(rand() * 10),
    });
  }
  return data;
}

const fakeEvents = [
  {
    id: "1",
    type: "charge.succeeded",
    amount_cents: 4900,
    currency: "usd",
    customer_email: "alice@example.com",
    customer_name: null,
    description: "Pro plan - monthly",
    event_at: "2026-03-03T23:30:00Z",
  },
  {
    id: "2",
    type: "customer.subscription.created",
    amount_cents: 2900,
    currency: "usd",
    customer_email: "bob@startup.io",
    customer_name: null,
    description: "Subscription created",
    event_at: "2026-03-03T22:00:00Z",
  },
  {
    id: "3",
    type: "charge.succeeded",
    amount_cents: 9900,
    currency: "usd",
    customer_email: "charlie@devtools.com",
    customer_name: null,
    description: "Team plan - monthly",
    event_at: "2026-03-03T19:00:00Z",
  },
  {
    id: "4",
    type: "charge.refunded",
    amount_cents: 2900,
    currency: "usd",
    customer_email: "dave@mail.com",
    customer_name: null,
    description: "Refund",
    event_at: "2026-03-03T16:00:00Z",
  },
  {
    id: "5",
    type: "customer.subscription.deleted",
    amount_cents: 900,
    currency: "usd",
    customer_email: "eve@company.co",
    customer_name: null,
    description: "Subscription deleted",
    event_at: "2026-03-03T00:00:00Z",
  },
  {
    id: "6",
    type: "charge.succeeded",
    amount_cents: 4900,
    currency: "usd",
    customer_email: "frank@saas.dev",
    customer_name: null,
    description: "Pro plan - monthly",
    event_at: "2026-03-02T22:00:00Z",
  },
  {
    id: "7",
    type: "customer.subscription.updated",
    amount_cents: 9900,
    currency: "usd",
    customer_email: "grace@agency.com",
    customer_name: null,
    description: "Subscription updated",
    event_at: "2026-03-02T18:00:00Z",
  },
];

const fakeUser = {
  id: "demo",
  email: "demo@revenuehub.app",
  display_name: "Demo User",
  avatar_url: null,
  plan: "pro" as const,
  stripe_customer_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function DemoPage() {
  const [days, setDays] = useState(30);
  const metrics = useMemo(() => generateMetrics(days), [days]);

  // Calculate dashboard data from fake metrics
  const latestMrr = metrics[metrics.length - 1]?.mrr_cents ?? 0;
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue_cents, 0);
  const totalCustomers = metrics.reduce((s, m) => s + m.new_customers, 0);
  const totalChurned = metrics.reduce((s, m) => s + m.churned_customers, 0);
  const churnRate = totalCustomers > 0 ? (totalChurned / totalCustomers) * 100 : 0;

  // Calculate period-over-period changes
  const mid = Math.floor(metrics.length / 2);
  const firstHalf = metrics.slice(0, mid);
  const secondHalf = metrics.slice(mid);
  const firstMrr = firstHalf[firstHalf.length - 1]?.mrr_cents ?? 1;
  const mrrChange = ((latestMrr - firstMrr) / firstMrr) * 100;
  const firstRev = firstHalf.reduce((s, m) => s + m.revenue_cents, 0) || 1;
  const secondRev = secondHalf.reduce((s, m) => s + m.revenue_cents, 0);
  const revenueChange = ((secondRev - firstRev) / firstRev) * 100;
  const firstCust = firstHalf.reduce((s, m) => s + m.new_customers, 0) || 1;
  const secondCust = secondHalf.reduce((s, m) => s + m.new_customers, 0);
  const customerChange = ((secondCust - firstCust) / firstCust) * 100;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar user={fakeUser} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={fakeUser} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <PeriodSelector selected={days} maxDays={365} onChange={setDays} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                title="MRR"
                value={formatCurrency(latestMrr)}
                change={mrrChange}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                change={revenueChange}
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Customers"
                value={formatNumber(totalCustomers)}
                change={customerChange}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Churn Rate"
                value={`${churnRate.toFixed(1)}%`}
                icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <MrrChart data={metrics} />
              <CustomerChart data={metrics} />
            </div>

            <EventFeed events={fakeEvents} />
          </div>
        </main>
      </div>
    </div>
  );
}
