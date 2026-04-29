import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRecentEvents } from "@/lib/metrics/aggregate";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = await checkRateLimit(`dashboard:${user.id}`, {
    windowMs: 60_000,
    maxRequests: 30,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const events = await getRecentEvents(user.id, 20);

  return NextResponse.json({ data: { events } });
}
