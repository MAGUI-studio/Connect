import { describe, it, expect, vi } from "vitest";

// Mock dependencies that are not needed for pure utility tests
vi.mock("server-only", () => ({}));
vi.mock("react", () => ({
  cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));
vi.mock("@/utils/prisma", () => ({
  prisma: {},
}));

import {
  normalizeHost,
  getHostLookupCandidates,
  isLocalHost,
  getProfileLocale,
  getProfileUrl,
  resolvePublicAssetUrl,
  getProfileSeoTitle,
  getProfileSeoDescription,
  getProfileSiteName,
  getProfileImage,
  getProfileTwitterImage,
  getRobotsDirectives,
  withResolvedProfileAssets,
} from "./magui-connect-public";

describe("magui-connect-public utilities", () => {
  describe("normalizeHost", () => {
    it("should return null for empty input", () => {
      expect(normalizeHost()).toBeNull();
      expect(normalizeHost(null)).toBeNull();
      expect(normalizeHost("")).toBeNull();
    });

    it("should lowercase and trim", () => {
      expect(normalizeHost("  EXAMPLE.com  ")).toBe("example.com");
    });

    it("should remove protocols", () => {
      expect(normalizeHost("http://example.com")).toBe("example.com");
      expect(normalizeHost("https://example.com")).toBe("example.com");
    });

    it("should remove trailing slash", () => {
      expect(normalizeHost("example.com/")).toBe("example.com");
    });

    it("should remove port numbers", () => {
      expect(normalizeHost("example.com:3000")).toBe("example.com");
    });

    it("should remove www prefix", () => {
      expect(normalizeHost("www.example.com")).toBe("example.com");
      expect(normalizeHost("www.sub.example.com")).toBe("sub.example.com");
    });

    it("should handle complex cases", () => {
      expect(normalizeHost("  HTTPS://WWW.Example.Com:8080/  ")).toBe(
        "example.com"
      );
    });
  });

  describe("getHostLookupCandidates", () => {
    it("should return empty array for empty input", () => {
      expect(getHostLookupCandidates()).toEqual([]);
      expect(getHostLookupCandidates(null)).toEqual([]);
    });

    it("should return the normalized host", () => {
      expect(getHostLookupCandidates("example.com")).toEqual(["example.com"]);
    });

    it("should add a candidate without 'bio.' prefix if it exists", () => {
      const candidates = getHostLookupCandidates("bio.example.com");
      expect(candidates).toContain("bio.example.com");
      expect(candidates).toContain("example.com");
      expect(candidates.length).toBe(2);
    });

    it("should not add duplicate candidates", () => {
      expect(getHostLookupCandidates("example.com")).toHaveLength(1);
    });
  });

  describe("isLocalHost", () => {
    it("should identify localhost variants", () => {
      expect(isLocalHost("localhost")).toBe(true);
      expect(isLocalHost("my-localhost-test")).toBe(true);
      expect(isLocalHost("127.0.0.1")).toBe(true);
      expect(isLocalHost("127.0.0.1:3000")).toBe(true);
      expect(isLocalHost("[::1]")).toBe(true);
    });

    it("should return false for public domains", () => {
      expect(isLocalHost("example.com")).toBe(false);
      expect(isLocalHost("google.com")).toBe(false);
      expect(isLocalHost(null)).toBe(false);
    });
  });

  describe("getProfileLocale", () => {
    it("should replace underscore with hyphen", () => {
      expect(getProfileLocale("pt_BR")).toBe("pt-BR");
      expect(getProfileLocale("en_US")).toBe("en-US");
    });

    it("should return default pt-BR if null/undefined", () => {
      expect(getProfileLocale()).toBe("pt-BR");
      expect(getProfileLocale(null)).toBe("pt-BR");
    });

    it("should keep already formatted locales", () => {
      expect(getProfileLocale("pt-BR")).toBe("pt-BR");
    });
  });

  describe("getProfileUrl", () => {
    it("should return null if no profile", () => {
      expect(getProfileUrl()).toBeNull();
      expect(getProfileUrl(null)).toBeNull();
    });

    it("should prioritize canonicalUrl", () => {
      const profile = {
        canonicalUrl: "https://mybio.com",
        domain: "other.com",
      };
      expect(getProfileUrl(profile)).toBe("https://mybio.com");
    });

    it("should use domain if canonicalUrl is missing", () => {
      const profile = { domain: "user.magui.com" };
      expect(getProfileUrl(profile)).toBe("https://user.magui.com");
    });

    it("should return null if both are missing", () => {
      expect(getProfileUrl({})).toBeNull();
    });
  });

  describe("resolvePublicAssetUrl", () => {
    it("should return null for empty input", () => {
      expect(resolvePublicAssetUrl()).toBeNull();
      expect(resolvePublicAssetUrl(null)).toBeNull();
    });

    it("should return absolute URLs as is", () => {
      expect(resolvePublicAssetUrl("https://example.com/img.png")).toBe(
        "https://example.com/img.png"
      );
      expect(resolvePublicAssetUrl("http://example.com/img.png")).toBe(
        "http://example.com/img.png"
      );
    });

    it("should return root-relative paths as is", () => {
      expect(resolvePublicAssetUrl("/local/path.png")).toBe("/local/path.png");
    });

    it("should prepend uploadthing URL for IDs", () => {
      expect(resolvePublicAssetUrl("some-asset-id")).toBe(
        "https://utfs.io/f/some-asset-id"
      );
    });
  });

  describe("getProfileSeoTitle", () => {
    it("should prioritize seoTitle", () => {
      expect(getProfileSeoTitle({ seoTitle: "SEO", displayName: "Name" })).toBe(
        "SEO"
      );
    });

    it("should fallback to displayName", () => {
      expect(getProfileSeoTitle({ displayName: "Name" })).toBe("Name");
    });

    it("should have default fallback", () => {
      expect(getProfileSeoTitle()).toBe("MAGUI Connect");
      expect(getProfileSeoTitle({})).toBe("MAGUI Connect");
    });
  });

  describe("getProfileSeoDescription", () => {
    it("should prioritize seoDescription", () => {
      expect(
        getProfileSeoDescription({
          seoDescription: "SEO Desc",
          headline: "Headline",
        })
      ).toBe("SEO Desc");
    });

    it("should fallback to headline", () => {
      expect(
        getProfileSeoDescription({ headline: "Headline", bio: "Bio" })
      ).toBe("Headline");
    });

    it("should fallback to bio", () => {
      expect(getProfileSeoDescription({ bio: "Bio" })).toBe("Bio");
    });

    it("should have default fallback", () => {
      expect(getProfileSeoDescription()).toBe("Landing page profissional.");
    });
  });

  describe("getProfileSiteName", () => {
    it("should prioritize siteName", () => {
      expect(
        getProfileSiteName({ siteName: "Site", displayName: "Name" })
      ).toBe("Site");
    });

    it("should fallback to displayName", () => {
      expect(getProfileSiteName({ displayName: "Name" })).toBe("Name");
    });

    it("should have default fallback", () => {
      expect(getProfileSiteName()).toBe("MAGUI Connect");
    });
  });

  describe("getProfileImage", () => {
    it("should prioritize ogImageUrl", () => {
      const p = {
        ogImageUrl: "og.png",
        bannerUrl: "banner.png",
        avatarUrl: "avatar.png",
      };
      expect(getProfileImage(p)).toBe("https://utfs.io/f/og.png");
    });

    it("should fallback to bannerUrl", () => {
      const p = { bannerUrl: "banner.png", avatarUrl: "avatar.png" };
      expect(getProfileImage(p)).toBe("https://utfs.io/f/banner.png");
    });

    it("should fallback to avatarUrl", () => {
      const p = { avatarUrl: "avatar.png" };
      expect(getProfileImage(p)).toBe("https://utfs.io/f/avatar.png");
    });

    it("should return null if none present", () => {
      expect(getProfileImage()).toBeNull();
      expect(getProfileImage({})).toBeNull();
    });
  });

  describe("getProfileTwitterImage", () => {
    it("should prioritize twitterImageUrl", () => {
      const p = { twitterImageUrl: "tw.png", ogImageUrl: "og.png" };
      expect(getProfileTwitterImage(p)).toBe("https://utfs.io/f/tw.png");
    });

    it("should fallback to getProfileImage logic", () => {
      const p = { ogImageUrl: "og.png" };
      expect(getProfileTwitterImage(p)).toBe("https://utfs.io/f/og.png");
    });
  });

  describe("getRobotsDirectives", () => {
    it("should return default directives (true, true)", () => {
      expect(getRobotsDirectives()).toEqual({
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      });
    });

    it("should respect indexable=false", () => {
      const res = getRobotsDirectives({ indexable: false });
      expect(res.index).toBe(false);
      expect(res.googleBot.index).toBe(false);
    });

    it("should respect seoNoFollow=true", () => {
      const res = getRobotsDirectives({ seoNoFollow: true });
      expect(res.follow).toBe(false);
      expect(res.googleBot.follow).toBe(false);
    });
  });

  describe("withResolvedProfileAssets", () => {
    it("should resolve all asset fields", () => {
      const profile = {
        avatarUrl: "a",
        bannerUrl: "b",
        faviconUrl: "f",
        logoUrl: "l",
        ogImageUrl: "o",
        twitterImageUrl: "t",
        other: "keep",
      };
      const resolved = withResolvedProfileAssets(profile);
      expect(resolved.avatarUrl).toBe("https://utfs.io/f/a");
      expect(resolved.bannerUrl).toBe("https://utfs.io/f/b");
      expect(resolved.faviconUrl).toBe("https://utfs.io/f/f");
      expect(resolved.logoUrl).toBe("https://utfs.io/f/l");
      expect(resolved.ogImageUrl).toBe("https://utfs.io/f/o");
      expect(resolved.twitterImageUrl).toBe("https://utfs.io/f/t");
      expect(resolved.other).toBe("keep");
    });
  });
});
