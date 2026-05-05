import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProfileView } from "../components/ProfileView";
import { ThemeToggle } from "../components/common/themeToggle";
import { prisma } from "../src/utils/prisma";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

async function getProfile(slug?: string, host?: string) {
  const isLocalhost =
    host?.includes("localhost") || host?.startsWith("127.0.0.1");

  // Normalize host: strip common subdomains for profile lookup
  const normalizeHost = (h: string) => h.replace(/^(bio\.|www\.)/, "");
  const normalizedHost = host ? normalizeHost(host) : host;

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
  };

  const include = {
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
  };

  const select = {
    id: true,
    userId: true,
    slug: true,
    displayName: true,
    heroKicker: true,
    heroHeadline: true,
    heroDescription: true,
    headline: true,
    bio: true,
    avatarUrl: true,
    bannerUrl: true,
    ogImageUrl: true,
    professionalCategory: true,
    location: true,
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
    themeAccent: true,
    seoTitle: true,
    seoDescription: true,
    createdAt: true,
    updatedAt: true,
    ...include,
  };

  if (isLocalhost && slug) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { slug },
      select,
    });
  }

  if (host && !isLocalhost) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { domain: normalizedHost as string },
      select,
    });
  }

  return null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolvedSearchParams = await props.searchParams;
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const profile = await getProfile(resolvedSearchParams.slug, host);

  if (!profile) return {};

  return {
    title: (profile.seoTitle || profile.displayName) as string,
    description: (profile.seoDescription || profile.headline) as string,
    openGraph: {
      title: (profile.seoTitle || profile.displayName) as string,
      description: (profile.seoDescription || profile.headline) as string,
      images: profile.ogImageUrl ? [profile.ogImageUrl] : [],
    },
  };
}

export default async function MaguiConnectPage(props: Props) {
  const resolvedSearchParams = await props.searchParams;
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const isLocalhost =
    host.includes("localhost") || host.startsWith("127.0.0.1");
  const profile = await getProfile(resolvedSearchParams.slug, host);

  if (!profile) {
    if (isLocalhost && !resolvedSearchParams.slug) {
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
                  <span className="text-4xl">⚡</span>
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

  return (
    <ProfileView
      profile={profile as Parameters<typeof ProfileView>[0]["profile"]}
    />
  );
}
