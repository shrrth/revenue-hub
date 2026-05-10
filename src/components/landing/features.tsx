import { BarChart3, Globe, Zap, Lock, Palette, Code } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Metrics",
    description:
      "MRR, revenue, customers, churn — all your key metrics at a glance.",
  },
  {
    icon: Globe,
    title: "Public Dashboard",
    description:
      "Share your revenue publicly. Build in public with a beautiful shareable page.",
  },
  {
    icon: Zap,
    title: "One-Click Sync",
    description:
      "Connect Stripe in seconds. We sync your last 90 days automatically.",
  },
  {
    icon: Lock,
    title: "You Control What's Public",
    description:
      "Choose exactly which metrics to show. Toggle individual KPIs on or off.",
  },
  {
    icon: Palette,
    title: "Beautiful Charts",
    description:
      "Interactive MRR and customer charts. Dark mode. Mobile responsive.",
  },
  {
    icon: Code,
    title: "Embed Widget",
    description:
      "Embed your revenue metrics on your website with a simple code snippet.",
  },
];

export function Features() {
  return (
    <section className="border-t bg-muted/40 px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Everything you need to track revenue
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Simple, powerful, and built for indie hackers
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
