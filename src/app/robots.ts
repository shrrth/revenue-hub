import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://revenuehub.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/p/"],
        disallow: ["/dashboard", "/settings", "/onboarding", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
