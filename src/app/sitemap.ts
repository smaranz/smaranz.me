import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/agent";
import { projects } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/llms.txt",
    "/llms-full.txt",
    "/api/profile",
    ...projects.map((p) => `/projects/${p.slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
