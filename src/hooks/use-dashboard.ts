"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { MetricsPoint, DashboardData, Event } from "@/types";
import { calculateDashboardData } from "@/lib/metrics/calculate";

type DashboardEvent = Pick<
  Event,
  "id" | "type" | "amount_cents" | "currency" | "customer_email" | "customer_name" | "description" | "event_at"
>;

interface UseDashboardOptions {
  initialDays?: number;
}

interface DashboardState {
  metrics: MetricsPoint[];
  dashboard: DashboardData;
  events: DashboardEvent[];
  loading: boolean;
  error: string | null;
  days: number;
  setDays: (days: number) => void;
  retry: () => void;
}

export function useDashboard({ initialDays = 30 }: UseDashboardOptions = {}): DashboardState {
  const [days, setDays] = useState(initialDays);
  const [metrics, setMetrics] = useState<MetricsPoint[]>([]);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, eventsRes] = await Promise.all([
        fetch(`/api/metrics?days=${days}`),
        fetch(`/api/dashboard`),
      ]);

      if (!metricsRes.ok) throw new Error("Failed to fetch metrics");
      if (!eventsRes.ok) throw new Error("Failed to fetch events");

      const metricsData = await metricsRes.json();
      const eventsData = await eventsRes.json();

      setMetrics(metricsData.data || []);
      setEvents(eventsData.data?.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dashboard = useMemo(() => calculateDashboardData(metrics), [metrics]);

  return { metrics, dashboard, events, loading, error, days, setDays, retry: fetchData };
}
