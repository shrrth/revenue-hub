import { describe, it, expect } from "vitest";
import { canAccessFeature, getMaxDaysHistory, getMaxProviders, getPlanLimits } from "./plans";

describe("canAccessFeature", () => {
  it("free plan has public page", () => {
    expect(canAccessFeature("free", "publicPage")).toBe(true);
  });

  it("free plan lacks custom branding", () => {
    expect(canAccessFeature("free", "customBranding")).toBe(false);
  });

  it("pro plan has embed widget", () => {
    expect(canAccessFeature("pro", "embedWidget")).toBe(true);
  });

  it("free plan lacks embed widget", () => {
    expect(canAccessFeature("free", "embedWidget")).toBe(false);
  });
});

describe("getMaxDaysHistory", () => {
  it("free = 30 days", () => {
    expect(getMaxDaysHistory("free")).toBe(30);
  });

  it("pro = 365 days", () => {
    expect(getMaxDaysHistory("pro")).toBe(365);
  });

  it("team = Infinity", () => {
    expect(getMaxDaysHistory("team")).toBe(Infinity);
  });
});

describe("getMaxProviders", () => {
  it("free = 1", () => {
    expect(getMaxProviders("free")).toBe(1);
  });

  it("pro = 5", () => {
    expect(getMaxProviders("pro")).toBe(5);
  });

  it("team = 20", () => {
    expect(getMaxProviders("team")).toBe(20);
  });
});

describe("getPlanLimits", () => {
  it("returns correct free plan price", () => {
    expect(getPlanLimits("free").priceMonthly).toBe(0);
  });

  it("returns correct pro plan price", () => {
    expect(getPlanLimits("pro").priceMonthly).toBe(900);
  });
});
