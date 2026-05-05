import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMetrics } from "@/lib/metrics/aggregate";
import { PublicDashboard } from "@/components/public/public-dashboard";
import type { Metadata } from "next";
import type { PublicPage, MetricsPoint } from "@/types";
import { absoluteUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPublicPage(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("public_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_enabled", true)
    .single();
  return data as PublicPage | null;
}

async function getPublicMetrics(userId: string) {
  const metrics = await getMetrics(userId, 90, undefined, { useAdmin: true });
  return metrics as MetricsPoint[];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPage(slug);

  if (!page) {
    return { title: "Not Found" };
  }

  const title = page.custom_title || "Revenue Dashboard";
  const description =
    page.custom_description || "Open revenue metrics powered by Revenue Hub";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/p/${slug}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublicPage(slug);

  if (!page) {
    notFound();
  }

  const metrics = await getPublicMetrics(page.user_id);

  const latestMrr =
    metrics.length > 0 ? metrics[metrics.length - 1].mrr_cents : 0;
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue_cents, 0);
  const totalCustomers = metrics.reduce((s, m) => s + m.new_customers, 0);

  const title = page.custom_title || "Revenue Dashboard";
  const description = page.custom_description || "Open revenue metrics powered by Revenue Hub";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(`/p/${slug}`),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicDashboard
        page={page}
        metrics={metrics}
        latestMrr={latestMrr}
        totalRevenue={totalRevenue}
        totalCustomers={totalCustomers}
      />
    </div>
  );
}
