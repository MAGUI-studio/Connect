import { headers } from "next/headers";
import { prisma } from "@/utils/prisma";

export function normalizeHost(rawHost?: string | null) {
  if (rawHost === null || rawHost === undefined) return null;
  if (rawHost.trim() === "") return null;

  let normalized = rawHost
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "");

  if (normalized.startsWith("[::1]")) return "[::1]";

  // Remove path and query parameters
  normalized = normalized.split("/")[0].split("?")[0];

  // Remove port numbers
  normalized = normalized.split(":")[0];

  // Remove trailing and leading dots
  normalized = normalized.replace(/^\.+/, "").replace(/\.+$/, "");

  // Remove www prefix
  if (normalized === "www") return null;
  if (normalized.startsWith("www.")) {
    normalized = normalized.slice(4);
  }

  return normalized || null;
}

export function getHostLookupCandidates(rawHost?: string | null) {
  const normalizedHost = normalizeHost(rawHost);

  if (!normalizedHost || normalizedHost === "bio") return [];

  const candidates = new Set<string>([normalizedHost]);

  if (normalizedHost.startsWith("bio.")) {
    const baseDomain = normalizedHost.replace(/^bio\./, "");
    if (baseDomain) {
      candidates.add(baseDomain);
    }
  }

  return [...candidates];
}

export function isLocalHost(host?: string | null) {
  if (!host) return false;
  const normalized = normalizeHost(host);
  const isIpv6Local = host.includes("[::1]");

  return Boolean(
    isIpv6Local ||
    (normalized &&
      (normalized === "localhost" ||
        normalized.includes("localhost") ||
        normalized === "127.0.0.1" ||
        normalized.startsWith("127.")))
  );
}

export function getProfileLocale(locale?: string | null) {
  return locale?.replaceAll("_", "-") || "pt-BR";
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

export async function getCurrentRequestHost() {
  const headersList = await headers();
  return headersList.get("host") || headersList.get("x-forwarded-host");
}

export async function getCurrentRequestSlugFromReferer() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  if (!referer) return null;

  try {
    const url = new URL(referer);
    return url.searchParams.get("slug");
  } catch {
    return null;
  }
}

export async function getPublicProfileBySlugOrDomain({
  slug,
  host,
}: {
  slug?: string | null;
  host?: string | null;
}) {
  if (slug) {
    return prisma.maguiConnectProfile.findUnique({
      where: { slug },
      include: {
        MaguiConnectLink: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        MaguiConnectSection: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            MaguiConnectLink: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });
  }

  if (host) {
    const candidates = getHostLookupCandidates(host);
    if (candidates.length === 0) return null;

    // Try each candidate as a domain
    for (const candidate of candidates) {
      const profile = await prisma.maguiConnectProfile.findUnique({
        where: { domain: candidate },
        include: {
          MaguiConnectLink: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
          MaguiConnectSection: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
              MaguiConnectLink: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      });

      if (profile) return profile;
    }
  }

  return null;
}
