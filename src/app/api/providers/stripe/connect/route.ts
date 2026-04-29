import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildConnectUrl } from "@/lib/stripe/connect";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate state token for CSRF protection
  const nonce = crypto.randomBytes(16).toString("hex");
  const state = Buffer.from(
    JSON.stringify({ userId: user.id, nonce })
  ).toString("base64url");

  // Store nonce in cookie for verification
  const cookieStore = await cookies();
  cookieStore.set("stripe_connect_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const url = buildConnectUrl(state);
  return NextResponse.redirect(url);
}
