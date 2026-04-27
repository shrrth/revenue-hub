"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function signInWithEmail() {
    if (!email.trim()) return;
    setIsLoading("email");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(null);
    } else {
      setMagicLinkSent(true);
      setIsLoading(null);
    }
  }

  async function signInWithProvider(provider: "github" | "google") {
    setIsLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    if (error) {
      setIsLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Revenue Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sign in to track your revenue and share your metrics
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6">
            {magicLinkSent ? (
              <div className="py-4 text-center">
                <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Check your email</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => setMagicLinkSent(false)}
                >
                  Use a different email
                </Button>
              </div>
            ) : (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    signInWithEmail();
                  }}
                  className="flex flex-col gap-3"
                >
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading !== null}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading !== null || !email.trim()}
                    className="w-full"
                  >
                    {isLoading === "email" ? (
                      <span className="animate-pulse">Sending link...</span>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Continue with Email
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => signInWithProvider("github")}
                  disabled={isLoading !== null}
                  className="w-full"
                >
                  {isLoading === "github" ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : (
                    <>
                      <GitHubIcon className="mr-2 h-5 w-5" />
                      Continue with GitHub
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => signInWithProvider("google")}
                  disabled={isLoading !== null}
                  className="w-full"
                >
                  {isLoading === "google" ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : (
                    <>
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Continue with Google
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
