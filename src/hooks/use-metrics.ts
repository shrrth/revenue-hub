"use client";

import { useState, useEffect } from "react";
import type { MetricsPoint } from "@/types";

export function useMetrics(days: number) {
  const [data, setData] = useState<MetricsPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/metrics?days=${days}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [days]);

  return { data, loading };
}
