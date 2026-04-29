import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    slug,
    is_enabled,
    show_mrr,
    show_revenue,
    show_customers,
    show_chart,
    theme,
    custom_title,
    custom_description,
  } = body;

  // Validate slug
  if (!slug || typeof slug !== "string" || slug.length < 3) {
    return NextResponse.json(
      { error: "Slug must be at least 3 characters" },
      { status: 400 }
    );
  }
  if (slug.length > 60) {
    return NextResponse.json(
      { error: "Slug must be 60 characters or less" },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
      { status: 400 }
    );
  }

  // Validate theme
  if (theme && !["light", "dark", "system"].includes(theme)) {
    return NextResponse.json(
      { error: "Invalid theme" },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("public_pages")
    .select("id, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.user_id !== user.id) {
    return NextResponse.json(
      { error: "Slug is already taken" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("public_pages")
    .upsert(
      {
        user_id: user.id,
        slug,
        is_enabled,
        show_mrr,
        show_revenue,
        show_customers,
        show_chart,
        theme,
        custom_title,
        custom_description,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("public_pages")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
