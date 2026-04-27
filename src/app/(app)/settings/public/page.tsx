"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { createClient } from "@/lib/supabase/client";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { PublicPage } from "@/types";

export default function PublicSettingsPage() {
  const { user, loading: userLoading } = useUser();
  const [page, setPage] = useState<PublicPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [showMrr, setShowMrr] = useState(true);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    async function loadPage() {
      const supabase = createClient();
      const { data } = await supabase
        .from("public_pages")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setPage(data as PublicPage);
        setSlug(data.slug);
        setIsEnabled(data.is_enabled);
        setShowMrr(data.show_mrr);
        setShowRevenue(data.show_revenue);
        setShowCustomers(data.show_customers);
        setShowChart(data.show_chart);
        setTheme(data.theme as "light" | "dark" | "system");
        setCustomTitle(data.custom_title || "");
        setCustomDescription(data.custom_description || "");
      }
      setLoading(false);
    }
    loadPage();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/public-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          is_enabled: isEnabled,
          show_mrr: showMrr,
          show_revenue: showRevenue,
          show_customers: showCustomers,
          show_chart: showChart,
          theme,
          custom_title: customTitle || null,
          custom_description: customDescription || null,
        }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setPage(data);
        toast.success("Settings saved");
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to save settings");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  if (userLoading || loading) return <LoadingSkeleton />;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const publicUrl = `${baseUrl}/p/${slug}`;
  const embedSnippet = `<iframe src="${baseUrl}/api/embed/${slug}" width="400" height="300" frameborder="0"></iframe>`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Public Dashboard</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>
                Control what the public can see
              </CardDescription>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex gap-2">
              <span className="flex items-center text-sm text-muted-foreground">
                /p/
              </span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="my-startup"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visible Metrics</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">MRR</span>
                <Switch checked={showMrr} onCheckedChange={setShowMrr} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue</span>
                <Switch checked={showRevenue} onCheckedChange={setShowRevenue} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customers</span>
                <Switch checked={showCustomers} onCheckedChange={setShowCustomers} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Chart</span>
                <Switch checked={showChart} onCheckedChange={setShowChart} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customTitle">Custom Title</Label>
            <Input
              id="customTitle"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="My Startup Revenue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDescription">Custom Description</Label>
            <Textarea
              id="customDescription"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Building in public..."
              rows={2}
            />
          </div>

          {slug.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Enter a URL slug to save your public page
            </p>
          )}
          {slug.length > 0 && slug.length < 3 && (
            <p className="text-sm text-destructive">
              Slug must be at least 3 characters
            </p>
          )}

          <Button onClick={handleSave} disabled={saving || slug.length < 3}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {page && isEnabled && slug && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={publicUrl} readOnly className="text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(publicUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={`/p/${slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Embed Widget</CardTitle>
              <CardDescription>
                Copy this code to embed your revenue widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={embedSnippet} readOnly className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedSnippet)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!user || user.plan === "free" ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro for custom branding and embed widget.{" "}
              <Link href="/pricing" className="text-primary underline">
                View pricing
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
