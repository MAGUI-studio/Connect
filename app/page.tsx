import { prisma } from "../src/utils/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ProfileView } from "../components/ProfileView";
import type { Metadata } from "next";
import { ThemeToggle } from "../components/common/themeToggle";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

async function getProfile(slug?: string, host?: string) {
  const isLocalhost =
    host?.includes("localhost") || host?.startsWith("127.0.0.1");

  const include = {
    MaguiConnectLink: {
      where: { isActive: true },
      orderBy: { sortOrder: "asc" as const },
    },
    MaguiConnectSection: {
      where: { isActive: true },
      orderBy: { sortOrder: "asc" as const },
      include: {
        MaguiConnectLink: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" as const },
        },
      },
    },
  };

  const select = {
    id: true,
    userId: true,
    status: true,
    slug: true,
    displayName: true,
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
    domain: true,
    themeAccent: true,
    themeBackground: true,
    themeForeground: true,
    seoTitle: true,
    seoDescription: true,
    publishedAt: true,
    lastSyncedAt: true,
    createdAt: true,
    updatedAt: true,
    ...include,
  };

  if (isLocalhost && slug) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { slug },
      select,
    });
  } else if (host && !isLocalhost) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { domain: host },
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
          <div className="absolute top-8 right-8 z-50">
            <ThemeToggle />
          </div>

          <div className="relative z-10 w-full max-w-[480px]">
            <div className="p-10 md:p-16">
              <div className="mb-10 flex flex-col items-center text-center">
                <div className="bg-foreground/5 mb-8 flex h-20 w-20 items-center justify-center rounded-3xl">
                  <span className="text-4xl">⚡</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Development Mode
                </h1>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  Renderer is active. Provide a profile slug to preview.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-foreground/5 rounded-3xl p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="bg-foreground/20 h-2 w-2 rounded-full" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50">
                      Local Preview URL
                    </span>
                  </div>
                  <code className="text-foreground block font-mono text-base font-bold opacity-80">
                    ?slug=your-profile-name
                  </code>
                </div>

                <div className="flex items-center justify-center gap-4 pt-6 opacity-20">
                  <div className="h-px w-12 bg-current" />
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase">
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

  if (profile.status === "PAUSED") {
    return (
      <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 font-sans antialiased">
        <div className="absolute top-8 right-8 z-50">
          <ThemeToggle />
        </div>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="p-10 text-center md:p-16">
            <div className="bg-foreground/5 mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Profile Paused
            </h1>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              This profile is currently offline. Please check back later or
              contact the owner.
            </p>
            <div className="via-foreground/5 mt-12 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
            <p className="mt-10 text-[10px] font-black tracking-[0.6em] uppercase opacity-20">
              MAGUI.STUDIO
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProfileView
      profile={profile as Parameters<typeof ProfileView>[0]["profile"]}
    />
  );
}
