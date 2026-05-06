import type { MetadataRoute } from "next";
import {
  getCurrentRequestHost,
  getProfileImage,
  getProfileUrl,
  getPublicProfileBySlugOrDomain,
} from "@/services/magui-connect-public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = await getCurrentRequestHost();
  const profile = await getPublicProfileBySlugOrDomain({ host });

  if (!profile || profile.indexable === false) {
    return [];
  }

  const url = getProfileUrl(profile);

  if (!url) {
    return [];
  }

  const image = getProfileImage(profile);

  return [
    {
      url,
      lastModified: profile.updatedAt,
      changeFrequency: "weekly",
      priority: 1,
      images: image ? [image] : undefined,
    },
  ];
}
