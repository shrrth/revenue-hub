import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface EventItem {
  id: string;
  type: string;
  amount_cents: number;
  currency: string;
  customer_email: string | null;
  description: string | null;
  event_at: string;
}

interface EventFeedProps {
  events: EventItem[];
}

const typeLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  "charge.succeeded": { label: "Payment", variant: "default" },
  "charge.refunded": { label: "Refund", variant: "destructive" },
  "customer.subscription.created": { label: "New Sub", variant: "secondary" },
  "customer.subscription.updated": { label: "Sub Update", variant: "secondary" },
  "customer.subscription.deleted": { label: "Churn", variant: "destructive" },
};

export function EventFeed({ events }: EventFeedProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No events yet. Connect Stripe and sync your data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => {
            const typeInfo = typeLabels[event.type] || {
              label: event.type,
              variant: "secondary" as const,
            };
            return (
              <div
                key={event.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant={typeInfo.variant} className="shrink-0 text-xs">
                    {typeInfo.label}
                  </Badge>
                  <span className="truncate text-sm text-muted-foreground">
                    {event.customer_email || event.description || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium tabular-nums">
                    {event.type === "charge.refunded" ? "-" : ""}
                    {formatCurrency(event.amount_cents, event.currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.event_at).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
