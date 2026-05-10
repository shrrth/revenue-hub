import { describe, it, expect } from "vitest";
import type Stripe from "stripe";
import { parseStripeEvent } from "./webhook";

function makeEvent(
  type: string,
  obj: Record<string, unknown>
): Stripe.Event {
  return {
    id: `evt_test_${Date.now()}`,
    type,
    data: { object: obj },
    api_version: "2025-08-27.basil",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    object: "event",
    pending_webhooks: 0,
    request: null,
  } as unknown as Stripe.Event;
}

describe("parseStripeEvent", () => {
  it("parses charge.succeeded", () => {
    const event = makeEvent("charge.succeeded", {
      amount: 5000,
      currency: "usd",
      receipt_email: "test@example.com",
      description: "Test charge",
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("charge.succeeded");
    expect(result!.amountCents).toBe(5000);
    expect(result!.currency).toBe("usd");
    expect(result!.customerEmail).toBe("test@example.com");
    expect(result!.description).toBe("Test charge");
  });

  it("parses charge.refunded", () => {
    const event = makeEvent("charge.refunded", {
      amount_refunded: 2500,
      currency: "eur",
      receipt_email: null,
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("charge.refunded");
    expect(result!.amountCents).toBe(2500);
    expect(result!.currency).toBe("eur");
    expect(result!.description).toBe("Refund");
  });

  it("parses customer.subscription.created", () => {
    const event = makeEvent("customer.subscription.created", {
      items: { data: [{ price: { unit_amount: 900 } }] },
      currency: "usd",
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("customer.subscription.created");
    expect(result!.amountCents).toBe(900);
    expect(result!.description).toBe("Subscription created");
  });

  it("parses customer.subscription.deleted", () => {
    const event = makeEvent("customer.subscription.deleted", {
      items: { data: [{ price: { unit_amount: 900 } }] },
      currency: "usd",
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("customer.subscription.deleted");
    expect(result!.description).toBe("Subscription deleted");
  });

  it("parses customer.subscription.updated", () => {
    const event = makeEvent("customer.subscription.updated", {
      items: { data: [{ price: { unit_amount: 1900 } }] },
      currency: "usd",
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("customer.subscription.updated");
    expect(result!.amountCents).toBe(1900);
  });

  it("returns null for unknown event types", () => {
    const event = makeEvent("invoice.payment_succeeded", {
      amount: 5000,
      created: 1700000000,
    });
    expect(parseStripeEvent(event)).toBeNull();
  });

  it("handles missing fields gracefully", () => {
    const event = makeEvent("charge.succeeded", {
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.amountCents).toBe(0);
    expect(result!.currency).toBe("usd");
    expect(result!.customerEmail).toBeNull();
    expect(result!.description).toBeNull();
  });

  it("handles subscription with no items", () => {
    const event = makeEvent("customer.subscription.created", {
      items: { data: [] },
      currency: "gbp",
      created: 1700000000,
    });
    const result = parseStripeEvent(event);
    expect(result).not.toBeNull();
    expect(result!.amountCents).toBe(0);
    expect(result!.currency).toBe("gbp");
  });
});
