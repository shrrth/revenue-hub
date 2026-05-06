export type { User, Provider, Event, MetricsDaily, PublicPage, Plan } from "./database";
export type { StripeConnectState, StripeSyncResult, StripeWebhookEvent } from "./stripe";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface DashboardData {
  mrr: number;
  totalRevenue: number;
  totalCustomers: number;
  churnRate: number;
  mrrChange: number;
  revenueChange: number;
  customerChange: number;
}

export interface MetricsPoint {
  date: string;
  mrr_cents: number;
  revenue_cents: number;
  new_customers: number;
  churned_customers: number;
  active_subscriptions: number;
}
