"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { createClient } from "@/lib/supabase/client";
import { Unplug, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import type { Provider } from "@/types";

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadProviders() {
      const supabase = createClient();
      const { data } = await supabase
        .from("providers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setProviders(data || []);
      setLoading(false);
    }
    loadProviders();
  }, []);

  async function handleSync(providerId: string) {
    setSyncing(providerId);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      if (res.ok) {
        toast.success("Sync completed successfully");
        // Refresh provider data to show updated last_synced_at
        const supabase = createClient();
        const { data } = await supabase
          .from("providers")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        setProviders(data || []);
      } else {
        toast.error("Sync failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSyncing(null);
    }
  }

  async function handleDisconnect(providerId: string) {
    if (!confirm("Are you sure you want to disconnect this Stripe account?")) return;
    setDisconnecting(providerId);
    try {
      const res = await fetch("/api/providers/stripe/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      if (res.ok) {
        setProviders((prev) => prev.filter((p) => p.id !== providerId));
        toast.success("Stripe account disconnected");
      } else {
        toast.error("Failed to disconnect. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDisconnecting(null);
    }
  }

  if (userLoading || loading) return <LoadingSkeleton />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <Badge variant="secondary" className="capitalize">
              {user?.plan ?? "free"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Providers</CardTitle>
              <CardDescription>
                Connected Stripe accounts
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <a href="/api/providers/stripe/connect">
                <Plus className="mr-2 h-4 w-4" />
                Connect Stripe
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {providers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No providers connected yet.
            </p>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {provider.display_name || provider.stripe_account_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {provider.last_synced_at
                        ? `Last synced: ${new Date(provider.last_synced_at).toLocaleDateString()}`
                        : "Never synced"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={syncing === provider.id}
                      onClick={() => handleSync(provider.id)}
                    >
                      {syncing === provider.id ? "Syncing..." : "Sync"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Disconnect"
                      disabled={disconnecting === provider.id}
                      onClick={() => handleDisconnect(provider.id)}
                    >
                      <Unplug className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plan</CardTitle>
          <CardDescription>
            Get access to more features with a Pro plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Data</CardTitle>
          <CardDescription>
            Download a copy of all your data in JSON format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            disabled={exporting}
            onClick={async () => {
              setExporting(true);
              try {
                const res = await fetch("/api/account/export");
                if (res.ok) {
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `revenue-hub-export-${new Date().toISOString().split("T")[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Data exported successfully");
                } else {
                  const data = await res.json();
                  toast.error(data.error || "Failed to export data");
                }
              } catch {
                toast.error("Network error. Please try again.");
              } finally {
                setExporting(false);
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export Data"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            disabled={deleting}
            onClick={async () => {
              const confirmed = confirm(
                "Are you sure you want to delete your account? This will permanently remove all your data, connected providers, and metrics. This action cannot be undone."
              );
              if (!confirmed) return;

              const doubleConfirmed = confirm(
                "This is your last chance. Type-check your decision: permanently delete everything?"
              );
              if (!doubleConfirmed) return;

              setDeleting(true);
              try {
                const res = await fetch("/api/account/delete", {
                  method: "DELETE",
                });
                if (res.ok) {
                  toast.success("Account deleted. Redirecting...");
                  window.location.href = "/";
                } else {
                  const data = await res.json();
                  toast.error(data.error || "Failed to delete account");
                }
              } catch {
                toast.error("Network error. Please try again.");
              } finally {
                setDeleting(false);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
