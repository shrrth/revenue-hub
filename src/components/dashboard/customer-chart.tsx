"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricsPoint } from "@/types";

interface CustomerChartProps {
  data: MetricsPoint[];
}

export function CustomerChart({ data }: CustomerChartProps) {
  const chartData = data.map((d) => ({
    date: d.date,
    new: d.new_customers,
    churned: -d.churned_customers,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis className="text-xs" />
              <Tooltip
                labelFormatter={(label: string) =>
                  new Date(label).toLocaleDateString("en", {
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Bar
                dataKey="new"
                fill="var(--color-chart-2)"
                name="New"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="churned"
                fill="var(--color-destructive)"
                name="Churned"
                radius={[0, 0, 2, 2]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
