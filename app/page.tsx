import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Organization, Person, Thing, WithContext } from "schema-dts";
import { ProfileView } from "@/components/ProfileView";
import { ThemeToggle } from "@/components/common/themeToggle";
import { JsonLd } from "@/utils/json-ld";
import {
  getCurrentRequestHost,
  getProfileImage,
  getProfileSeoDescription,
  getProfileSeoTitle,
  getProfileSiteName,
  getProfileTwitterImage,
  getProfileUrl,
  getPublicProfileBySlugOrDomain,
  getRobotsDirectives,
  isLocalHost,
  resolvePublicAssetUrl,
} from "@/services/magui-connect-public";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

function buildProfileJsonLd(
  profile: NonNullable<
    Awaited<ReturnType<typeof getPublicProfileBySlugOrDomain>>
  >
): WithContext<Thing> {
  const url = getProfileUrl(profile);
  const sameAs = profile.MaguiConnectLink.map((link) => link.url).filter(
    Boolean
  );

  if (profile.entityType === "PERSON" || !profile.entityType) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.displayName,
      url: url || undefined,
      image: resolvePublicAssetUrl(profile.avatarUrl) || undefined,
      description: getProfileSeoDescription(profile),
      jobTitle: profile.jobTitle || undefined,
      email: profile.publicEmail || undefined,
      telephone: profile.publicPhone || undefined,
      worksFor: profile.companyName
        ? {
            "@type": "Organization",
            name: profile.companyName,
          }
        : undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    } satisfies WithContext<Person>;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getProfileSiteName(profile),
    url: url || undefined,
    logo:
      resolvePublicAssetUrl(profile.logoUrl) ||
      resolvePublicAssetUrl(profile.avatarUrl) ||
      undefined,
    image: getProfileImage(profile) || undefined,
    description: getProfileSeoDescription(profile),
    email: profile.publicEmail || undefined,
    telephone: profile.publicPhone || undefined,
    address: profile.location || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  } satisfies WithContext<Organization>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolvedSearchParams = await props.searchParams;
  const host = await getCurrentRequestHost();
  const profile = await getPublicProfileBySlugOrDomain({
    slug: resolvedSearchParams.slug,
    host,
  });

  if (!profile) return {};

  const url = getProfileUrl(profile);
  const title = getProfileSeoTitle(profile);
  const description = getProfileSeoDescription(profile);
  const siteName = getProfileSiteName(profile);
  const ogImage = getProfileImage(profile);
  const twitterImage = getProfileTwitterImage(profile);
  const robots = isLocalHost(host)
    ? getRobotsDirectives({ indexable: false, seoNoFollow: true })
    : getRobotsDirectives(profile);
  const twitterHandle = profile.twitterHandle
    ? `@${profile.twitterHandle.replace(/^@/, "")}`
    : undefined;
  const logoUrl = resolvePublicAssetUrl(profile.logoUrl);
  const iconUrl = resolvedSearchParams.slug
    ? `/icon?slug=${encodeURIComponent(resolvedSearchParams.slug)}`
    : "/icon";

  return {
    metadataBase: url ? new URL(url) : undefined,
    title,
    description,
    applicationName: siteName,
    keywords: profile.seoKeywords
      ? profile.seoKeywords.split(",").map((item) => item.trim())
      : undefined,
    alternates: {
      canonical: url || undefined,
    },
    robots,
    openGraph: {
      type: "website",
      locale: profile.locale?.replace("-", "_") || "pt_BR",
      url: url || undefined,
      title,
      description,
      siteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      site: twitterHandle,
      images: twitterImage ? [twitterImage] : [],
    },
    icons: {
      icon: [{ url: iconUrl }],
      shortcut: [iconUrl],
      ...(logoUrl
        ? {
            apple: [{ url: logoUrl }],
          }
        : {}),
    },
    other: profile.themeColor
      ? {
          "theme-color": profile.themeColor,
        }
      : undefined,
  };
}

export default async function MaguiConnectPage(props: Props) {
  const resolvedSearchParams = await props.searchParams;
  const host = await getCurrentRequestHost();

  const profile = await getPublicProfileBySlugOrDomain({
    slug: resolvedSearchParams.slug,
    host,
  });

  if (!profile) {
    if (isLocalHost(host) && !resolvedSearchParams.slug) {
      return (
        <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 font-sans antialiased">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(120,120,120,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(120,120,120,0.08),transparent_25%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_25%)]" />
            <div className="bg-foreground/6 absolute top-12 left-[-6rem] h-72 w-72 rounded-full blur-3xl dark:bg-white/6" />
            <div className="bg-foreground/5 absolute right-[-5rem] bottom-10 h-80 w-80 rounded-full blur-3xl dark:bg-white/5" />
          </div>

          <div className="absolute top-8 right-8 z-50">
            <ThemeToggle />
          </div>

          <div className="relative z-10 w-full">
            <div className="border-foreground/8 bg-background/72 dark:bg-background/55 rounded-[2rem] border p-10 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-16 dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
              <div className="mb-10 flex flex-col items-center text-center">
                <div className="border-foreground/10 bg-background/70 text-muted-foreground mb-5 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.28em] uppercase">
                  Local Renderer
                </div>
                <div className="bg-foreground/5 mb-8 flex h-20 w-20 items-center justify-center rounded-3xl shadow-inner">
                  <span className="text-4xl">AI</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
                  Development Mode
                </h1>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  Renderer is active. Use a profile slug to preview the full
                  landing experience with live content.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-foreground/8 bg-foreground/[0.04] rounded-[1.75rem] border p-8 backdrop-blur">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="bg-foreground/20 h-2 w-2 rounded-full" />
                    <span className="text-[10px] font-semibold tracking-[0.24em] uppercase opacity-60">
                      Local Preview URL
                    </span>
                  </div>
                  <code className="text-foreground block font-mono text-base font-semibold opacity-80">
                    ?slug=your-profile-name
                  </code>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2 opacity-30">
                  <div className="h-px w-12 bg-current" />
                  <span className="text-[10px] font-semibold tracking-[0.45em] uppercase">
                    MAGUI CONNECT
                  </span>
                  <div className="h-px w-12 bg-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    notFound();
  }

  const shouldNoIndex = isLocalHost(host) || profile.indexable === false;

  return (
    <>
      {!shouldNoIndex && <JsonLd data={buildProfileJsonLd(profile)} />}
      <ProfileView
        profile={profile as Parameters<typeof ProfileView>[0]["profile"]}
      />
    </>
  );
}
