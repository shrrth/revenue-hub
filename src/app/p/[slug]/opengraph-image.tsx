import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMetrics } from "@/lib/metrics/aggregate";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: page } = await supabase
    .from("public_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_enabled", true)
    .single();

  if (!page) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  const metrics = await getMetrics(page.user_id, 30, undefined, { useAdmin: true });
  const latestMrr = metrics.length > 0 ? metrics[metrics.length - 1].mrr_cents : 0;
  const totalRevenue = metrics.reduce(
    (s: number, m: { revenue_cents: number }) => s + m.revenue_cents,
    0
  );

  const title = page.custom_title || "Revenue Dashboard";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 16 }}>
          Revenue Hub
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            gap: 60,
          }}
        >
          {page.show_mrr && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, opacity: 0.6 }}>MRR</div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                {formatCurrency(latestMrr)}
              </div>
            </div>
          )}
          {page.show_revenue && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, opacity: 0.6 }}>Total Revenue</div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
