import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect to get started",
    features: ["1 Stripe account", "30 days history", "Public dashboard", "Basic metrics"],
    cta: "Get Started",
    href: "/login",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "For serious builders",
    features: ["5 Stripe accounts", "1 year history", "Custom branding", "Embed widget", "Advanced metrics"],
    cta: "Start Pro Trial",
    href: "/login",
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo",
    description: "For teams",
    features: ["20 accounts", "Unlimited history", "All Pro features", "Team members", "API access"],
    cta: "Contact Us",
    href: "mailto:hello@revenuehub.app",
    popular: false,
  },
];

export function PricingTable() {
  return (
    <section className="border-t bg-muted/40 px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">Pricing</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Start free, upgrade when you&apos;re ready
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold tabular-nums">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
