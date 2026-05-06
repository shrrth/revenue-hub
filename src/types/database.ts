export type Plan = "free" | "pro" | "team";

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  type: "stripe";
  stripe_account_id: string;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  display_name: string | null;
  last_synced_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  provider_id: string;
  stripe_event_id: string;
  type: string;
  amount_cents: number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  event_at: string;
  created_at: string;
}

export interface MetricsDaily {
  id: string;
  user_id: string;
  provider_id: string;
  date: string;
  mrr_cents: number;
  revenue_cents: number;
  refund_cents: number;
  new_customers: number;
  churned_customers: number;
  active_subscriptions: number;
  created_at: string;
}

export interface PublicPage {
  id: string;
  user_id: string;
  slug: string;
  is_enabled: boolean;
  show_mrr: boolean;
  show_revenue: boolean;
  show_customers: boolean;
  show_chart: boolean;
  theme: "light" | "dark" | "system";
  custom_title: string | null;
  custom_description: string | null;
  created_at: string;
  updated_at: string;
}
