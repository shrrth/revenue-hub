import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Track Your Revenue.{" "}
          <span className="text-primary">Share It With the World.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          The open revenue dashboard for indie hackers. Connect Stripe, see your
          metrics, and build in public with a beautiful shareable dashboard.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-base">
            <Link href="/login">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Free forever. No credit card required.
        </p>
      </div>
    </section>
  );
}
