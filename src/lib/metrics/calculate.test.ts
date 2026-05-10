import { describe, it, expect } from "vitest";
import { calculateDashboardData } from "./calculate";
import type { MetricsPoint } from "@/types";

function makePoint(overrides: Partial<MetricsPoint> = {}): MetricsPoint {
  return {
    date: "2024-01-01",
    mrr_cents: 0,
    revenue_cents: 0,
    new_customers: 0,
    churned_customers: 0,
    active_subscriptions: 0,
    ...overrides,
  };
}

describe("calculateDashboardData", () => {
  it("returns zeros for empty metrics", () => {
    const result = calculateDashboardData([]);
    expect(result.mrr).toBe(0);
    expect(result.totalRevenue).toBe(0);
    expect(result.totalCustomers).toBe(0);
    expect(result.churnRate).toBe(0);
  });

  it("calculates MRR from latest entry", () => {
    const metrics = [
      makePoint({ mrr_cents: 1000 }),
      makePoint({ mrr_cents: 2000 }),
      makePoint({ mrr_cents: 3000 }),
    ];
    const result = calculateDashboardData(metrics);
    expect(result.mrr).toBe(3000);
  });

  it("sums total revenue", () => {
    const metrics = [
      makePoint({ revenue_cents: 1000 }),
      makePoint({ revenue_cents: 2000 }),
      makePoint({ revenue_cents: 500 }),
    ];
    const result = calculateDashboardData(metrics);
    expect(result.totalRevenue).toBe(3500);
  });

  it("sums total customers", () => {
    const metrics = [
      makePoint({ new_customers: 5 }),
      makePoint({ new_customers: 3 }),
      makePoint({ new_customers: 2 }),
    ];
    const result = calculateDashboardData(metrics);
    expect(result.totalCustomers).toBe(10);
  });

  it("calculates churn rate", () => {
    const metrics = [
      makePoint({ churned_customers: 1, active_subscriptions: 100 }),
      makePoint({ churned_customers: 1, active_subscriptions: 99 }),
    ];
    const result = calculateDashboardData(metrics);
    expect(result.churnRate).toBeGreaterThan(0);
  });

  it("calculates MRR change percentage", () => {
    const metrics = [
      makePoint({ mrr_cents: 1000 }),
      makePoint({ mrr_cents: 1500 }),
    ];
    const result = calculateDashboardData(metrics);
    expect(result.mrrChange).toBe(50);
  });
});
