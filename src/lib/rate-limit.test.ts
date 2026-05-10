import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase admin client
const mockRpc = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    rpc: mockRpc,
  }),
}));

import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  it("returns allowed when RPC returns true", async () => {
    mockRpc.mockResolvedValue({ data: true, error: null });
    const result = await checkRateLimit("test-key", { maxRequests: 3, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith("check_rate_limit", {
      p_key: "test-key",
      p_window_seconds: 60,
      p_max_requests: 3,
    });
  });

  it("returns not allowed when RPC returns false", async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });
    const result = await checkRateLimit("test-key", { maxRequests: 2 });
    expect(result.allowed).toBe(false);
  });

  it("fails open on RPC error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "DB error" } });
    const result = await checkRateLimit("test-key");
    expect(result.allowed).toBe(true);
  });
});
