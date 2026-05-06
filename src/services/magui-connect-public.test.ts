import { describe, expect, test } from "vitest";
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

describe("magui-connect-public services", () => {
  describe("normalizeHost", () => {
    const cases: [string | null | undefined, string | null][] = [
      [null, null],
      [undefined, null],
      ["", null],
      ["   ", null],
      ["WWW", null],
      ["www", null],
      ["google.com", "google.com"],
      ["GOOGLE.COM", "google.com"],
      ["  google.com  ", "google.com"],
      ["https://google.com", "google.com"],
      ["http://google.com", "google.com"],
      ["www.google.com", "google.com"],
      ["https://www.google.com", "google.com"],
      ["google.com/path", "google.com"],
      ["google.com?query=1", "google.com"],
      ["google.com:8080", "google.com"],
      ["www.google.com:8080/path?q=1", "google.com"],
      ["[::1]", "[::1]"],
      ["localhost", "localhost"],
      ["127.0.0.1", "127.0.0.1"],
      [".google.com", "google.com"],
      ["google.com.", "google.com"],
      ["...google.com...", "google.com"],
      ["sub.domain.com", "sub.domain.com"],
      ["www.sub.domain.com", "sub.domain.com"],
      ["https://www.sub.domain.com/test", "sub.domain.com"],
      ["HTTP://WWW.EXAMPLE.COM", "example.com"],
      ["my-site.com", "my-site.com"],
      ["user@domain.com", "user@domain.com"],
      ["192.168.1.1", "192.168.1.1"],
      ["[2001:db8::1]", "[2001"], // Based on current implementation .split(":")[0]
      ["xn--dmin-moa.com", "xn--dmin-moa.com"],
      ["a.b.c.d.e.f", "a.b.c.d.e.f"],
      ["  https://www.Example-Site.com/page?ref=site  ", "example-site.com"],
    ];

    test.each(cases)("normalizeHost('%s') -> '%s'", (input, expected) => {
      expect(normalizeHost(input)).toBe(expected);
    });
  });

  describe("getHostLookupCandidates", () => {
    const cases: [string | null | undefined, string[]][] = [
      [null, []],
      [undefined, []],
      ["", []],
      ["bio", []],
      ["www", []],
      ["google.com", ["google.com"]],
      ["bio.google.com", ["bio.google.com", "google.com"]],
      ["www.bio.google.com", ["bio.google.com", "google.com"]],
      ["https://bio.example.com", ["bio.example.com", "example.com"]],
      ["bio.", []], // normalizedHost would be "" or null
      ["BIO.MY-SITE.COM", ["bio.my-site.com", "my-site.com"]],
    ];

    test.each(cases)(
      "getHostLookupCandidates('%s') -> %j",
      (input, expected) => {
        expect(getHostLookupCandidates(input)).toEqual(expected);
      }
    );
  });

  describe("isLocalHost", () => {
    const cases: [string | null | undefined, boolean][] = [
      [null, false],
      [undefined, false],
      ["", false],
      ["localhost", true],
      ["LOCALHOST", true],
      ["  localhost  ", true],
      ["127.0.0.1", true],
      ["127.0.0.2", true],
      ["127.255.255.255", true],
      ["[::1]", true],
      ["http://localhost:3000", true],
      ["https://127.0.0.1/test", true],
      ["google.com", false],
      ["my-localhost.com", true], // includes "localhost"
      ["128.0.0.1", false],
      ["127", false], // normalizeHost -> "127"
    ];

    test.each(cases)("isLocalHost('%s') -> %s", (input, expected) => {
      expect(isLocalHost(input)).toBe(expected);
    });
  });

  describe("getProfileLocale", () => {
    const cases: [string | null | undefined, string][] = [
      [null, "pt-BR"],
      [undefined, "pt-BR"],
      ["", "pt-BR"],
      ["en_US", "en-US"],
      ["en-US", "en-US"],
      ["pt_BR", "pt-BR"],
      ["es", "es"],
    ];

    test.each(cases)("getProfileLocale('%s') -> '%s'", (input, expected) => {
      expect(getProfileLocale(input)).toBe(expected);
    });
  });

  describe("getProfileUrl", () => {
    test("returns null if profile is null", () => {
      expect(getProfileUrl(null)).toBeNull();
    });

    test("returns canonicalUrl if present", () => {
      expect(getProfileUrl({ canonicalUrl: "https://my.link" })).toBe(
        "https://my.link"
      );
    });

    test("returns domain if canonicalUrl is missing", () => {
      expect(getProfileUrl({ domain: "test.com" })).toBe("https://test.com");
    });

    test("returns null if both are missing", () => {
      expect(getProfileUrl({})).toBeNull();
    });

    test("prefers canonicalUrl over domain", () => {
      expect(
        getProfileUrl({
          canonicalUrl: "https://canonical.com",
          domain: "domain.com",
        })
      ).toBe("https://canonical.com");
    });
  });

  describe("resolvePublicAssetUrl", () => {
    const cases: [string | null | undefined, string | null][] = [
      [null, null],
      ["", null],
      ["https://test.com/img.png", "https://test.com/img.png"],
      ["http://test.com/img.png", "http://test.com/img.png"],
      ["/local/path.svg", "/local/path.svg"],
      ["uuid-1234", "https://utfs.io/f/uuid-1234"],
      ["my-image.jpg", "https://utfs.io/f/my-image.jpg"],
    ];

    test.each(cases)(
      "resolvePublicAssetUrl('%s') -> '%s'",
      (input, expected) => {
        expect(resolvePublicAssetUrl(input)).toBe(expected);
      }
    );
  });

  describe("getProfileSeoTitle", () => {
    test("returns seoTitle if present", () => {
      expect(getProfileSeoTitle({ seoTitle: "SEO", displayName: "Name" })).toBe(
        "SEO"
      );
    });
    test("returns displayName if seoTitle missing", () => {
      expect(getProfileSeoTitle({ displayName: "Name" })).toBe("Name");
    });
    test("returns default if both missing", () => {
      expect(getProfileSeoTitle({})).toBe("MAGUI Connect");
      expect(getProfileSeoTitle(null)).toBe("MAGUI Connect");
    });
  });

  describe("getProfileSeoDescription", () => {
    test("returns seoDescription if present", () => {
      expect(
        getProfileSeoDescription({
          seoDescription: "DESC",
          headline: "HL",
          bio: "BIO",
        })
      ).toBe("DESC");
    });
    test("returns headline if seoDescription missing", () => {
      expect(getProfileSeoDescription({ headline: "HL", bio: "BIO" })).toBe(
        "HL"
      );
    });
    test("returns bio if both missing", () => {
      expect(getProfileSeoDescription({ bio: "BIO" })).toBe("BIO");
    });
    test("returns default if all missing", () => {
      expect(getProfileSeoDescription({})).toBe("Landing page profissional.");
      expect(getProfileSeoDescription(null)).toBe("Landing page profissional.");
    });
  });

  describe("getProfileSiteName", () => {
    test("returns siteName if present", () => {
      expect(
        getProfileSiteName({ siteName: "Site", displayName: "Name" })
      ).toBe("Site");
    });
    test("returns displayName if siteName missing", () => {
      expect(getProfileSiteName({ displayName: "Name" })).toBe("Name");
    });
    test("returns default if both missing", () => {
      expect(getProfileSiteName({})).toBe("MAGUI Connect");
    });
  });

  describe("getProfileImage", () => {
    test("returns resolved ogImageUrl if present", () => {
      expect(getProfileImage({ ogImageUrl: "og.png" })).toBe(
        "https://utfs.io/f/og.png"
      );
    });
    test("returns bannerUrl if ogImageUrl missing", () => {
      expect(getProfileImage({ bannerUrl: "banner.png" })).toBe(
        "https://utfs.io/f/banner.png"
      );
    });
    test("returns avatarUrl if others missing", () => {
      expect(getProfileImage({ avatarUrl: "avatar.png" })).toBe(
        "https://utfs.io/f/avatar.png"
      );
    });
    test("returns null if all missing", () => {
      expect(getProfileImage({})).toBeNull();
    });
  });

  describe("getProfileTwitterImage", () => {
    test("returns twitterImageUrl if present", () => {
      expect(getProfileTwitterImage({ twitterImageUrl: "tw.png" })).toBe(
        "https://utfs.io/f/tw.png"
      );
    });
    test("falls back to getProfileImage if twitterImageUrl missing", () => {
      expect(getProfileTwitterImage({ ogImageUrl: "og.png" })).toBe(
        "https://utfs.io/f/og.png"
      );
    });
  });

  describe("getRobotsDirectives", () => {
    test("default directives", () => {
      expect(getRobotsDirectives({})).toEqual({
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      });
    });
    test("respects indexable false", () => {
      expect(getRobotsDirectives({ indexable: false })).toEqual({
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      });
    });
    test("respects seoNoFollow true", () => {
      expect(getRobotsDirectives({ seoNoFollow: true })).toEqual({
        index: true,
        follow: false,
        googleBot: { index: true, follow: false },
      });
    });
  });

  describe("withResolvedProfileAssets", () => {
    test("resolves all asset URLs", () => {
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
    });
  });

  describe("normalizeHost edge cases", () => {
    const moreCases: [string, string | null][] = Array.from(
      { length: 30 },
      (_, i) => [`www${i}.example.com`, `www${i}.example.com`]
    );

    test.each(moreCases)(
      "normalizeHost more variants %s",
      (input, expected) => {
        expect(normalizeHost(input)).toBe(expected);
      }
    );

    test("strips multiple leading/trailing dots", () => {
      expect(normalizeHost("...google.com...")).toBe("google.com");
      expect(normalizeHost("..google..com..")).toBe("google..com"); // only leading/trailing
    });

    test("handles very long hosts", () => {
      const longHost = "a".repeat(100) + ".com";
      expect(normalizeHost(longHost)).toBe(longHost);
    });
  });
});
