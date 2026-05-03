import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

const demoMetrics = [
  { label: "MRR", value: formatCurrency(485000) },
  { label: "Revenue", value: formatCurrency(1240000) },
  { label: "Customers", value: formatNumber(342) },
  { label: "Churn", value: "2.1%" },
];

const demoChart = [20, 28, 35, 40, 38, 45, 52, 60, 58, 72, 68, 80, 85, 92, 88, 95, 102, 110, 108, 115, 120, 128, 135, 140, 138, 145, 150, 158, 162, 170];

export function DemoDashboard() {
  const maxVal = Math.max(...demoChart);

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          See it in action
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Here&apos;s what your dashboard will look like
        </p>

        <div className="mt-12 rounded-xl border bg-card p-6 shadow-lg">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {demoMetrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">MRR Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-end gap-1">
                {demoChart.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-chart-1/80 transition-all hover:bg-chart-1"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
