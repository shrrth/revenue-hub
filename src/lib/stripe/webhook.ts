import type Stripe from "stripe";

export interface ParsedEvent {
  type: string;
  amountCents: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  description: string | null;
  eventAt: string;
}

export function parseStripeEvent(event: Stripe.Event): ParsedEvent | null {
  const obj = event.data.object as unknown as Record<string, unknown>;

  switch (event.type) {
    case "charge.succeeded":
      return {
        type: event.type,
        amountCents: (obj.amount as number) || 0,
        currency: (obj.currency as string) || "usd",
        customerEmail: (obj.receipt_email as string) || null,
        customerName: null,
        description: (obj.description as string) || null,
        eventAt: new Date((obj.created as number) * 1000).toISOString(),
      };

    case "charge.refunded": {
      const refundAmount = (obj.amount_refunded as number) || 0;
      return {
        type: event.type,
        amountCents: refundAmount,
        currency: (obj.currency as string) || "usd",
        customerEmail: (obj.receipt_email as string) || null,
        customerName: null,
        description: "Refund",
        eventAt: new Date((obj.created as number) * 1000).toISOString(),
      };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const items = obj.items as { data?: Array<{ price?: { unit_amount?: number } }> } | undefined;
      const amount = items?.data?.[0]?.price?.unit_amount || 0;
      return {
        type: event.type,
        amountCents: amount,
        currency: (obj.currency as string) || "usd",
        customerEmail: null,
        customerName: null,
        description: `Subscription ${event.type.split(".").pop()}`,
        eventAt: new Date((obj.created as number) * 1000).toISOString(),
      };
    }

    default:
      return null;
  }
}
