import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { DemoDashboard } from "@/components/landing/demo-dashboard";
import { PricingTable } from "@/components/landing/pricing-table";
import { FAQ } from "@/components/landing/faq";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Revenue Hub",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Open revenue dashboard for indie hackers. Connect Stripe and share your metrics publicly.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
    },
    {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      name: "Pro",
      billingIncrement: "P1M",
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex items-center justify-between border-b px-6 py-4" role="banner">
        <span className="text-lg font-bold">Revenue Hub</span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <Hero />
        <Features />
        <DemoDashboard />
        <PricingTable />
        <FAQ />

        <section className="border-t px-4 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to track your revenue?</h2>
          <p className="mt-4 text-muted-foreground">
            Join indie hackers who build in public
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/login">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <p>Revenue Hub &mdash; Track your revenue in one place.</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span>&middot;</span>
          <Link href="/legal/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
