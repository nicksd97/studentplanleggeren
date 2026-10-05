import type { MetadataRoute } from "next";
import { absoluteUrl, indexablePaths } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths().map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/produkter")
          ? 0.8
          : path === "/gratis"
            ? 0.7
            : path.startsWith("/guider")
              ? 0.6
              : 0.4,
  }));
}
