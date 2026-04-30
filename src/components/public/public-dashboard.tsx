import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { MetricsPoint, PublicPage } from "@/types";

interface PublicDashboardProps {
  page: PublicPage;
  metrics: MetricsPoint[];
  latestMrr: number;
  totalRevenue: number;
  totalCustomers: number;
}

export function PublicDashboard({
  page,
  metrics,
  latestMrr,
  totalRevenue,
  totalCustomers,
}: PublicDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {page.custom_title || "Revenue Dashboard"}
        </h1>
        {page.custom_description && (
          <p className="mt-2 text-muted-foreground">
            {page.custom_description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {page.show_mrr && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrency(latestMrr)}
              </div>
            </CardContent>
          </Card>
        )}
        {page.show_revenue && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
        )}
        {page.show_customers && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {formatNumber(totalCustomers)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {page.show_chart && metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <PublicChart metrics={metrics} showMrr={page.show_mrr} />
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <span className="text-xs text-muted-foreground">
          Powered by Revenue Hub
        </span>
      </div>
    </div>
  );
}

function PublicChart({
  metrics,
  showMrr,
}: {
  metrics: MetricsPoint[];
  showMrr: boolean;
}) {
  // Simple bar chart using divs (no client component needed)
  const maxRevenue = Math.max(...metrics.map((m) => m.revenue_cents), 1);

  return (
    <div className="flex h-40 items-end gap-1">
      {metrics.slice(-30).map((m, i) => {
        const height = (m.revenue_cents / maxRevenue) * 100;
        return (
          <div
            key={i}
            className="flex-1 rounded-t bg-chart-1 transition-all hover:bg-chart-2"
            style={{ height: `${Math.max(height, 2)}%` }}
            title={`${m.date}: ${formatCurrency(m.revenue_cents)}${showMrr ? ` (MRR: ${formatCurrency(m.mrr_cents)})` : ""}`}
          />
        );
      })}
    </div>
  );
}
