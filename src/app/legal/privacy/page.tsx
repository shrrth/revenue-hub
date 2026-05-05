import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Revenue Hub",
  description: "How Revenue Hub collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 7, 2026";
  const contactEmail = "privacy@revenuehub.app";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
          <p className="mt-2">
            Revenue Hub (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Revenue Hub
            web application. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
          <h3 className="mt-3 font-medium text-foreground">2.1 Account Information</h3>
          <p className="mt-1">
            When you create an account, we collect your email address and, if you use OAuth
            (GitHub or Google), your display name and avatar URL as provided by the identity
            provider.
          </p>

          <h3 className="mt-3 font-medium text-foreground">2.2 Payment Provider Data</h3>
          <p className="mt-1">
            When you connect a Stripe account via OAuth, we receive and store a read-only access
            token, your Stripe account ID, and the display name of the connected account. We
            retrieve transaction data (charges, refunds, subscriptions) including: amounts,
            currency, customer email addresses, and event timestamps.
          </p>

          <h3 className="mt-3 font-medium text-foreground">2.3 Billing Data</h3>
          <p className="mt-1">
            If you subscribe to a paid plan, your payment is processed by Stripe. We store your
            Stripe customer ID and plan status. We do not store your credit card number or
            banking details.
          </p>

          <h3 className="mt-3 font-medium text-foreground">2.4 Usage Data</h3>
          <p className="mt-1">
            We collect standard server logs (IP address, browser type, pages visited) for
            security and service reliability purposes. We do not use third-party analytics or
            advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To provide and maintain the Revenue Hub service</li>
            <li>To display your revenue metrics on your private dashboard</li>
            <li>To display metrics on your public dashboard, if you choose to enable it</li>
            <li>To process subscription payments for paid plans</li>
            <li>To communicate important service updates</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Data Sharing</h2>
          <p className="mt-2">
            We do not sell your personal data. We share data only with the following third-party
            services, strictly as required to operate the service:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Supabase</strong> — database hosting and authentication (your data is
              stored in Supabase-managed PostgreSQL with row-level security)
            </li>
            <li>
              <strong>Stripe</strong> — payment processing and payment provider data retrieval
            </li>
            <li>
              <strong>Netlify</strong> — application hosting and content delivery
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Data Security</h2>
          <p className="mt-2">
            We implement industry-standard security measures including: encrypted data
            transmission (TLS/HTTPS), application-level encryption for sensitive tokens
            (AES-256-GCM), row-level security policies in our database, and webhook signature
            verification. However, no method of electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Data Retention</h2>
          <p className="mt-2">
            We retain your account data and transaction history for as long as your account is
            active. If you delete your account, we will delete your personal data within 30 days,
            except where retention is required by law (e.g., billing records for tax compliance).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p className="mt-2">
            Depending on your jurisdiction, you may have the following rights regarding your
            personal data:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Access</strong> — request a copy of the data we hold about you</li>
            <li><strong>Rectification</strong> — request correction of inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion of your account and data</li>
            <li><strong>Portability</strong> — request your data in a machine-readable format</li>
            <li><strong>Objection</strong> — object to certain processing activities</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${contactEmail}`} className="text-foreground underline">
              {contactEmail}
            </a>{" "}
            or use the account deletion option in your Settings page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Cookies</h2>
          <p className="mt-2">
            We use strictly necessary cookies for authentication session management and CSRF
            protection. These cookies are essential for the service to function and cannot be
            disabled. We do not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. International Transfers</h2>
          <p className="mt-2">
            Your data may be transferred to and processed in countries outside your own. Our
            infrastructure providers (Supabase, Stripe, Netlify) maintain appropriate safeguards
            for international data transfers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Children&apos;s Privacy</h2>
          <p className="mt-2">
            Revenue Hub is not intended for use by individuals under the age of 16. We do not
            knowingly collect personal data from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by posting the updated policy on this page and updating the &quot;Last
            updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">12. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${contactEmail}`} className="text-foreground underline">
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
