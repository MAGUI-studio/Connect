import type { MetadataRoute } from "next";
import {
  getCurrentRequestHost,
  getProfileUrl,
  getPublicProfileBySlugOrDomain,
} from "@/services/magui-connect-public";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = await getCurrentRequestHost();
  const profile = await getPublicProfileBySlugOrDomain({ host });
  const siteUrl = getProfileUrl(profile);

  if (!profile || !siteUrl) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  if (profile.indexable === false) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: siteUrl,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
