import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { prisma } from "@/utils/prisma";

const linkSelect = {
  id: true,
  label: true,
  url: true,
  customShortDescription: true,
  kind: true,
  startsAt: true,
  expiresAt: true,
  isFeatured: true,
  isActive: true,
  openInNewTab: true,
  sectionId: true,
} as const;

const profileSelect = {
  id: true,
  userId: true,
  slug: true,
  displayName: true,
  siteName: true,
  heroKicker: true,
  heroHeadline: true,
  heroDescription: true,
  headline: true,
  bio: true,
  avatarUrl: true,
  bannerUrl: true,
  faviconUrl: true,
  logoUrl: true,
  ogImageUrl: true,
  twitterImageUrl: true,
  professionalCategory: true,
  location: true,
  entityType: true,
  jobTitle: true,
  companyName: true,
  whatsapp: true,
  whatsappMessage: true,
  publicEmail: true,
  publicPhone: true,
  primaryCtaLabel: true,
  primaryCtaUrl: true,
  secondaryCtaLabel: true,
  secondaryCtaUrl: true,
  domain: true,
  canonicalUrl: true,
  locale: true,
  themeAccent: true,
  themeColor: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  twitterHandle: true,
  indexable: true,
  seoNoFollow: true,
  createdAt: true,
  updatedAt: true,
  MaguiConnectLink: {
    where: { isActive: true },
    orderBy: { sortOrder: "asc" as const },
    select: linkSelect,
  },
  MaguiConnectSection: {
    where: { isActive: true },
    orderBy: { sortOrder: "asc" as const },
    select: {
      id: true,
      title: true,
      description: true,
      isCollapsible: true,
      isActive: true,
      MaguiConnectLink: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" as const },
        select: linkSelect,
      },
    },
  },
} as const;

export type PublicProfile = Awaited<
  ReturnType<typeof getPublicProfileBySlugOrDomain>
>;

export function normalizeHost(rawHost?: string | null) {
  if (!rawHost) return null;

  return rawHost
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function getHostLookupCandidates(rawHost?: string | null) {
  const normalizedHost = normalizeHost(rawHost);

  if (!normalizedHost) return [];

  const candidates = new Set<string>([normalizedHost]);

  if (normalizedHost.startsWith("bio.")) {
    candidates.add(normalizedHost.replace(/^bio\./, ""));
  }

  return [...candidates];
}

export function isLocalHost(host?: string | null) {
  return Boolean(
    host &&
    (host.includes("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("[::1]"))
  );
}

export function getProfileLocale(locale?: string | null) {
  return locale?.replace("_", "-") || "pt-BR";
}

export function getProfileUrl(
  profile?: {
    canonicalUrl?: string | null;
    domain?: string | null;
  } | null
) {
  if (!profile) return null;
  if (profile.canonicalUrl) return profile.canonicalUrl;
  if (profile.domain) return `https://${profile.domain}`;
  return null;
}

export function resolvePublicAssetUrl(asset?: string | null) {
  if (!asset) return null;

  if (asset.startsWith("http://") || asset.startsWith("https://")) {
    return asset;
  }

  if (asset.startsWith("/")) {
    return asset;
  }

  return `https://utfs.io/f/${asset}`;
}

export function getProfileSeoTitle(
  profile?: {
    seoTitle?: string | null;
    displayName?: string | null;
  } | null
) {
  return profile?.seoTitle || profile?.displayName || "MAGUI Connect";
}

export function getProfileSeoDescription(
  profile?: {
    seoDescription?: string | null;
    headline?: string | null;
    bio?: string | null;
  } | null
) {
  return (
    profile?.seoDescription ||
    profile?.headline ||
    profile?.bio ||
    "Landing page profissional."
  );
}

export function getProfileSiteName(
  profile?: {
    siteName?: string | null;
    displayName?: string | null;
  } | null
) {
  return profile?.siteName || profile?.displayName || "MAGUI Connect";
}

export function getProfileImage(
  profile?: {
    ogImageUrl?: string | null;
    bannerUrl?: string | null;
    avatarUrl?: string | null;
  } | null
) {
  return resolvePublicAssetUrl(
    profile?.ogImageUrl || profile?.bannerUrl || profile?.avatarUrl || null
  );
}

export function getProfileTwitterImage(
  profile?: {
    twitterImageUrl?: string | null;
    ogImageUrl?: string | null;
    bannerUrl?: string | null;
    avatarUrl?: string | null;
  } | null
) {
  return (
    resolvePublicAssetUrl(profile?.twitterImageUrl) || getProfileImage(profile)
  );
}

export function getRobotsDirectives(
  profile?: {
    indexable?: boolean | null;
    seoNoFollow?: boolean | null;
  } | null
) {
  const index = profile?.indexable !== false;
  const follow = profile?.seoNoFollow !== true;

  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
    },
  };
}

export function withResolvedProfileAssets<
  T extends {
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    faviconUrl?: string | null;
    logoUrl?: string | null;
    ogImageUrl?: string | null;
    twitterImageUrl?: string | null;
  },
>(profile: T): T {
  return {
    ...profile,
    avatarUrl: resolvePublicAssetUrl(profile.avatarUrl),
    bannerUrl: resolvePublicAssetUrl(profile.bannerUrl),
    faviconUrl: resolvePublicAssetUrl(profile.faviconUrl),
    logoUrl: resolvePublicAssetUrl(profile.logoUrl),
    ogImageUrl: resolvePublicAssetUrl(profile.ogImageUrl),
    twitterImageUrl: resolvePublicAssetUrl(profile.twitterImageUrl),
  };
}

export const getPublicProfileBySlugOrDomain = cache(
  async ({ slug, host }: { slug?: string; host?: string | null }) => {
    const normalizedHost = normalizeHost(host);
    const hostCandidates = getHostLookupCandidates(host);

    if (isLocalHost(normalizedHost) && slug) {
      return prisma.maguiConnectProfile.findUnique({
        where: { slug },
        select: profileSelect,
      });
    }

    if (hostCandidates.length > 0 && !isLocalHost(normalizedHost)) {
      return prisma.maguiConnectProfile.findFirst({
        where: { domain: { in: hostCandidates } },
        select: profileSelect,
      });
    }

    return null;
  }
);

export async function getCurrentRequestHost() {
  const headerStore = await headers();
  return (
    normalizeHost(headerStore.get("x-forwarded-host")) ||
    normalizeHost(headerStore.get("host"))
  );
}

export async function getCurrentRequestSlugFromReferer() {
  const headerStore = await headers();
  const referer = headerStore.get("referer");

  if (!referer) return undefined;

  try {
    const url = new URL(referer);
    return url.searchParams.get("slug") || undefined;
  } catch {
    return undefined;
  }
}
