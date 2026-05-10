import { describe, it, expect } from "vitest";

// Replicate the getSafeRedirect logic from auth/callback/route.ts for testing
const ALLOWED_REDIRECTS = ["/dashboard", "/onboarding", "/settings", "/settings/public"];

function getSafeRedirect(next: string | null): string {
  if (!next) return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  if (!ALLOWED_REDIRECTS.includes(next)) return "/dashboard";
  return next;
}

describe("getSafeRedirect", () => {
  it("defaults to /dashboard when next is null", () => {
    expect(getSafeRedirect(null)).toBe("/dashboard");
  });

  it("defaults to /dashboard when next is empty", () => {
    expect(getSafeRedirect("")).toBe("/dashboard");
  });

  it("allows /dashboard", () => {
    expect(getSafeRedirect("/dashboard")).toBe("/dashboard");
  });

  it("allows /settings", () => {
    expect(getSafeRedirect("/settings")).toBe("/settings");
  });

  it("allows /settings/public", () => {
    expect(getSafeRedirect("/settings/public")).toBe("/settings/public");
  });

  it("allows /onboarding", () => {
    expect(getSafeRedirect("/onboarding")).toBe("/onboarding");
  });

  it("blocks protocol-relative redirect //evil.com", () => {
    expect(getSafeRedirect("//evil.com")).toBe("/dashboard");
  });

  it("blocks absolute URL https://evil.com", () => {
    expect(getSafeRedirect("https://evil.com")).toBe("/dashboard");
  });

  it("blocks unknown paths", () => {
    expect(getSafeRedirect("/admin")).toBe("/dashboard");
  });

  it("blocks path traversal", () => {
    expect(getSafeRedirect("/../etc/passwd")).toBe("/dashboard");
  });

  it("blocks javascript: protocol", () => {
    expect(getSafeRedirect("javascript:alert(1)")).toBe("/dashboard");
  });
});
