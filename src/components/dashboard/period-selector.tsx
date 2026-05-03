"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const periods = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: 365 },
] as const;

interface PeriodSelectorProps {
  selected: number;
  maxDays: number;
  onChange: (days: number) => void;
}

export function PeriodSelector({
  selected,
  maxDays,
  onChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex gap-1">
      {periods.map(({ label, days }) => (
        <Button
          key={days}
          variant="ghost"
          size="sm"
          disabled={days > maxDays}
          onClick={() => onChange(days)}
          className={cn(
            "h-8 px-3 text-xs",
            selected === days && "bg-accent text-accent-foreground"
          )}
        >
          {label}
          {days > maxDays && (
            <span className="ml-1 text-[10px] text-muted-foreground">Pro</span>
          )}
        </Button>
      ))}
    </div>
  );
}
