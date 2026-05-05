import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Revenue Hub",
  description: "Terms and conditions for using Revenue Hub.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "March 7, 2026";
  const contactEmail = "support@revenuehub.app";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using Revenue Hub (&quot;the Service&quot;), you agree to be bound by
            these Terms of Service. If you do not agree, do not use the Service. We reserve the
            right to modify these terms at any time; continued use after changes constitutes
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p className="mt-2">
            Revenue Hub is a SaaS revenue tracking dashboard that allows you to connect payment
            providers (currently Stripe), view aggregated revenue metrics, and optionally share
            selected metrics publicly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Account Registration</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must be at least 16 years old to use the Service.</li>
            <li>One person or legal entity may not maintain more than one free account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Stripe Integration</h2>
          <p className="mt-2">
            By connecting your Stripe account, you authorize Revenue Hub to access your Stripe
            data in read-only mode via the Stripe Connect OAuth flow. You may disconnect your
            Stripe account at any time from the Settings page.
          </p>
          <p className="mt-2">
            Revenue Hub is not responsible for the accuracy, availability, or completeness of
            data provided by Stripe. You acknowledge that metrics displayed are approximations
            based on available transaction data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Public Dashboards</h2>
          <p className="mt-2">
            If you enable a public dashboard, the metrics you select will be visible to anyone
            with the URL. You are solely responsible for determining which metrics to make
            public. Revenue Hub is not liable for any consequences of publicly sharing your
            revenue data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Paid Plans &amp; Billing</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Paid subscriptions are billed monthly in advance via Stripe.
            </li>
            <li>
              All fees are non-refundable except as required by applicable law.
            </li>
            <li>
              We reserve the right to change pricing with 30 days&apos; notice.
            </li>
            <li>
              Downgrading your plan may result in loss of access to premium features and
              historical data beyond your new plan&apos;s limits.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Acceptable Use</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Use automated tools to scrape or extract data from the Service</li>
            <li>Reverse engineer or decompile any part of the Service</li>
            <li>Resell or redistribute the Service without written permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Intellectual Property</h2>
          <p className="mt-2">
            The Service, including its design, code, and branding, is owned by Revenue Hub. Your
            data remains yours. By using the Service, you grant us a limited license to process
            your data solely to provide the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Disclaimer of Warranties</h2>
          <p className="mt-2">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO
            NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p className="mt-2">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, REVENUE HUB SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
            PROFITS OR REVENUE, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA.
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS
            PRECEDING THE CLAIM.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Account Termination</h2>
          <p className="mt-2">
            You may delete your account at any time from the Settings page. We may suspend or
            terminate your account if you violate these terms. Upon termination, your data will
            be deleted in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">12. Governing Law</h2>
          <p className="mt-2">
            These terms are governed by the laws of the Republic of Korea. Any disputes shall be
            resolved in the courts of Seoul, Republic of Korea.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">13. Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact us at{" "}
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
