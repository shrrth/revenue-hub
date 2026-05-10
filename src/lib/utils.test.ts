import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatNumber, formatPercent, slugify } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatCurrency", () => {
  it("formats cents to dollars", () => {
    expect(formatCurrency(1000)).toBe("$10");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats large amounts", () => {
    expect(formatCurrency(999999)).toBe("$9,999.99");
  });

  it("formats with decimal", () => {
    expect(formatCurrency(1050)).toBe("$10.5");
  });

  it("respects currency", () => {
    const result = formatCurrency(1000, "eur");
    expect(result).toContain("10");
  });
});

describe("formatNumber", () => {
  it("formats integers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  it("formats positive with plus sign", () => {
    expect(formatPercent(12.34)).toBe("+12.3%");
  });

  it("formats negative", () => {
    expect(formatPercent(-5.67)).toBe("-5.7%");
  });

  it("formats zero", () => {
    expect(formatPercent(0)).toBe("+0.0%");
  });
});

describe("slugify", () => {
  it("converts to lowercase slug", () => {
    expect(slugify("My Awesome App")).toBe("my-awesome-app");
  });

  it("removes special characters", () => {
    expect(slugify("Hello World! @#$")).toBe("hello-world");
  });

  it("handles multiple spaces/hyphens", () => {
    expect(slugify("a   b---c")).toBe("a-b-c");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
  });
});
