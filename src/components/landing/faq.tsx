const faqs = [
  {
    q: "What data do you access from Stripe?",
    a: "We only request read-only access to your Stripe account. We read charges, refunds, and subscription data to calculate your metrics. We never modify anything in your Stripe account.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use Supabase with row-level security. Your data is encrypted and only accessible to you (unless you choose to make a public dashboard).",
  },
  {
    q: "Can I disconnect Stripe at any time?",
    a: "Absolutely. You can disconnect your Stripe account from the settings page at any time. We'll stop syncing new data, though historical data will remain.",
  },
  {
    q: "What metrics are shown on the public dashboard?",
    a: "You control exactly what's visible. You can toggle MRR, revenue, customer count, and charts individually. Only what you enable will be shown.",
  },
  {
    q: "Do you support other payment providers?",
    a: "Currently we support Stripe. We plan to add Paddle, Lemon Squeezy, and Gumroad in future updates.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! The free plan includes 1 Stripe account, 30 days of history, and a public dashboard. No credit card required.",
  },
];

export function FAQ() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 space-y-8">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
