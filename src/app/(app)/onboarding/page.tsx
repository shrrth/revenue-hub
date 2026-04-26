"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { ConnectStripe } from "@/components/onboarding/connect-stripe";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, Rocket } from "lucide-react";
import { toast } from "sonner";

const steps = ["Welcome", "Connect", "Sync"];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const [currentStep, setCurrentStep] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    if (stepParam === "sync") setCurrentStep(2);
    else if (stepParam === "connect") setCurrentStep(1);
  }, [stepParam]);

  async function handleSync() {
    setSyncing(true);
    try {
      const supabase = createClient();
      const { data: providers } = await supabase
        .from("providers")
        .select("id")
        .eq("is_active", true)
        .limit(1);

      if (providers && providers.length > 0) {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId: providers[0].id }),
        });
        if (res.ok) {
          setSyncDone(true);
          toast.success("Sync completed! Your dashboard is ready.");
        } else {
          toast.error("Sync failed. You can retry from the dashboard.");
        }
      } else {
        toast.error("No provider found. Please connect Stripe first.");
      }
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && (
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Revenue Hub!</CardTitle>
            <CardDescription>
              Let&apos;s get your revenue dashboard set up in just a couple of steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => setCurrentStep(1)}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && <ConnectStripe />}

      {currentStep === 2 && (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Sync Your Data</CardTitle>
            <CardDescription>
              We&apos;ll import your last 90 days of Stripe data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncDone ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  Sync complete! Your dashboard is ready.
                </p>
                <Button size="lg" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={handleSync} disabled={syncing}>
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Start Sync"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
