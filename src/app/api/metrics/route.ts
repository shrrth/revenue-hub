import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMetrics } from "@/lib/metrics/aggregate";
import { getMaxDaysHistory } from "@/lib/plans";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Plan } from "@/types";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = await checkRateLimit(`metrics:${user.id}`, {
    windowMs: 60_000,
    maxRequests: 30,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const requestedDays = parseInt(searchParams.get("days") || "30", 10);

  // Get user's plan
  const { data: userData } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (userData?.plan as Plan) || "free";
  const MAX_ABSOLUTE_DAYS = 3650; // 10 years hard cap
  const maxDays = getMaxDaysHistory(plan);
  const days = Math.min(requestedDays, maxDays, MAX_ABSOLUTE_DAYS);

  const data = await getMetrics(user.id, days);

  return NextResponse.json({ data });
}
