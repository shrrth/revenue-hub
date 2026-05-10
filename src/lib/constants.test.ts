import { describe, it, expect } from "vitest";
import { PLAN_LIMITS, SYNC_DAYS, STRIPE_EVENTS_TO_TRACK } from "./constants";

describe("PLAN_LIMITS", () => {
  it("has three plans", () => {
    expect(Object.keys(PLAN_LIMITS)).toEqual(["free", "pro", "team"]);
  });

  it("free plan is cheapest", () => {
    expect(PLAN_LIMITS.free.priceMonthly).toBe(0);
  });

  it("each plan has required fields", () => {
    for (const plan of Object.values(PLAN_LIMITS)) {
      expect(plan).toHaveProperty("label");
      expect(plan).toHaveProperty("maxProviders");
      expect(plan).toHaveProperty("maxDaysHistory");
      expect(plan).toHaveProperty("publicPage");
      expect(plan).toHaveProperty("priceMonthly");
    }
  });
});

describe("SYNC_DAYS", () => {
  it("is 90", () => {
    expect(SYNC_DAYS).toBe(90);
  });
});

describe("STRIPE_EVENTS_TO_TRACK", () => {
  it("includes charge.succeeded", () => {
    expect(STRIPE_EVENTS_TO_TRACK).toContain("charge.succeeded");
  });

  it("includes subscription events", () => {
    expect(STRIPE_EVENTS_TO_TRACK).toContain("customer.subscription.created");
    expect(STRIPE_EVENTS_TO_TRACK).toContain("customer.subscription.deleted");
  });
});
