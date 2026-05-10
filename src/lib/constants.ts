export const PLAN_LIMITS = {
  free: {
    label: "Free",
    maxProviders: 1,
    maxDaysHistory: 30,
    publicPage: true,
    customBranding: false,
    embedWidget: false,
    priceMonthly: 0,
  },
  pro: {
    label: "Pro",
    maxProviders: 5,
    maxDaysHistory: 365,
    publicPage: true,
    customBranding: true,
    embedWidget: true,
    priceMonthly: 900, // $9 in cents
  },
  team: {
    label: "Team",
    maxProviders: 20,
    maxDaysHistory: Infinity,
    publicPage: true,
    customBranding: true,
    embedWidget: true,
    priceMonthly: 2900, // $29 in cents
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export const SYNC_DAYS = 90;

export const STRIPE_EVENTS_TO_TRACK = [
  "charge.succeeded",
  "charge.refunded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
] as const;
