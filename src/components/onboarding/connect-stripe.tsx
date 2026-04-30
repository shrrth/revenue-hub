"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export function ConnectStripe() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Connect Stripe</CardTitle>
        <CardDescription>
          Link your Stripe account to start tracking your revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild size="lg">
          <a href="/api/providers/stripe/connect">Connect Stripe Account</a>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          We request read-only access to your Stripe data.
          You can disconnect at any time.
        </p>
      </CardContent>
    </Card>
  );
}
