import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/agent";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/llms.txt", "/llms-full.txt"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
}
