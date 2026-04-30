"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if already accepted via a cookie (not localStorage — SSR safe via useEffect)
    const accepted = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${COOKIE_CONSENT_KEY}=`));
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    // Set cookie valid for 1 year
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_CONSENT_KEY}=true; expires=${expires}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies for authentication and security. No tracking or advertising
          cookies are used.{" "}
          <Link href="/legal/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
        <Button onClick={handleAccept} size="sm" className="shrink-0">
          Got it
        </Button>
      </div>
    </div>
  );
}
