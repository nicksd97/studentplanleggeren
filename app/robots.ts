import type { MetadataRoute } from "next";
import { SITE_ORIGIN, robotsRules } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: robotsRules(),
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
