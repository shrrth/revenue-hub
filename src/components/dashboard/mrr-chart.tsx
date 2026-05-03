"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricsPoint } from "@/types";

interface MrrChartProps {
  data: MetricsPoint[];
}

export function MrrChart({ data }: MrrChartProps) {
  const chartData = data.map((d) => ({
    date: d.date,
    mrr: d.mrr_cents / 100,
    revenue: d.revenue_cents / 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">MRR & Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
              <YAxis
                className="text-xs"
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                labelFormatter={(label: string) =>
                  new Date(label).toLocaleDateString("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={false}
                name="MRR"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
