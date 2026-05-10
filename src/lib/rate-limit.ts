import { createAdminClient } from "@/lib/supabase/admin";

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

/**
 * Distributed rate limiter backed by Supabase.
 * Safe for serverless / multi-instance environments.
 */
export async function checkRateLimit(
  key: string,
  { windowMs = 60_000, maxRequests = 10 }: RateLimitOptions = {}
): Promise<{ allowed: boolean }> {
  const supabase = createAdminClient();
  const windowSeconds = Math.ceil(windowMs / 1000);

  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  });

  if (error) {
    // Fail open: allow request if rate limit check fails
    console.error("Rate limit check failed:", error);
    return { allowed: true };
  }

  return { allowed: data as boolean };
}
