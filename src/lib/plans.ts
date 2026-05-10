import { PLAN_LIMITS, type PlanType } from "./constants";

export function canAccessFeature(
  plan: PlanType,
  feature: keyof (typeof PLAN_LIMITS)["free"]
): boolean {
  const limits = PLAN_LIMITS[plan];
  const value = limits[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  return false;
}

export function getMaxDaysHistory(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxDaysHistory;
}

export function getMaxProviders(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxProviders;
}

export function getPlanLimits(plan: PlanType) {
  return PLAN_LIMITS[plan];
}
