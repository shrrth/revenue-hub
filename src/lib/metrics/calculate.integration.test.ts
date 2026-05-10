import { describe, it, expect } from "vitest";
import { calculateDashboardData } from "./calculate";

describe("calculateDashboardData integration scenarios", () => {
  it("handles empty metrics", () => {
    const result = calculateDashboardData([]);
    expect(result.mrr).toBe(0);
    expect(result.totalRevenue).toBe(0);
    expect(result.totalCustomers).toBe(0);
    expect(result.mrrChange).toBe(0);
    expect(result.revenueChange).toBe(0);
    expect(result.customerChange).toBe(0);
    expect(result.churnRate).toBe(0);
  });

  it("calculates correct metrics from a typical month", () => {
    const today = new Date();
    const metrics = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      metrics.push({
        date: d.toISOString().split("T")[0],
        mrr_cents: 10000 + (29 - i) * 100,
        revenue_cents: 500,
        refund_cents: 0,
        new_customers: i === 29 ? 5 : 1,
        churned_customers: 0,
        active_subscriptions: 10 + (29 - i),
      });
    }

    const result = calculateDashboardData(metrics);
    expect(result.mrr).toBe(12900); // 10000 + 29*100
    expect(result.totalRevenue).toBe(500 * 30);
    expect(result.totalCustomers).toBe(5 + 29);
    expect(result.churnRate).toBe(0);
  });

  it("calculates negative changes when metrics decline", () => {
    const today = new Date();
    const metrics = [];
    // First half: high values
    for (let i = 29; i >= 15; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      metrics.push({
        date: d.toISOString().split("T")[0],
        mrr_cents: 20000,
        revenue_cents: 1000,
        refund_cents: 0,
        new_customers: 3,
        churned_customers: 0,
        active_subscriptions: 20,
      });
    }
    // Second half: lower values
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      metrics.push({
        date: d.toISOString().split("T")[0],
        mrr_cents: 10000,
        revenue_cents: 300,
        refund_cents: 200,
        new_customers: 1,
        churned_customers: 2,
        active_subscriptions: 10,
      });
    }

    const result = calculateDashboardData(metrics);
    expect(result.revenueChange).toBeLessThan(0);
    expect(result.customerChange).toBeLessThan(0);
    expect(result.mrrChange).toBeLessThan(0);
    expect(result.churnRate).toBeGreaterThan(0);
  });

  it("handles single day of data", () => {
    const today = new Date().toISOString().split("T")[0];
    const metrics = [
      {
        date: today,
        mrr_cents: 5000,
        revenue_cents: 5000,
        refund_cents: 0,
        new_customers: 2,
        churned_customers: 0,
        active_subscriptions: 2,
      },
    ];

    const result = calculateDashboardData(metrics);
    expect(result.mrr).toBe(5000);
    expect(result.totalRevenue).toBe(5000);
    expect(result.totalCustomers).toBe(2);
    // Single day: no change possible
    expect(result.mrrChange).toBe(0);
  });

  it("computes churn rate correctly", () => {
    const metrics = Array.from({ length: 10 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, "0")}`,
      mrr_cents: 10000,
      revenue_cents: 1000,
      refund_cents: 0,
      new_customers: 0,
      churned_customers: 1,
      active_subscriptions: 10,
    }));

    const result = calculateDashboardData(metrics);
    // 10 churned / 10 avg subs * 100 = 100%
    expect(result.churnRate).toBe(100);
  });
});
