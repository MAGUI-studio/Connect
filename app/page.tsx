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

  if (isLocalhost && slug) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { slug },
      include: {
        MaguiConnectLink: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } else if (host && !isLocalhost) {
    return await prisma.maguiConnectProfile.findUnique({
      where: { domain: host },
      include: {
        MaguiConnectLink: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
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
        <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 font-sans">
          {/* Theme Toggle Positioned at Top Right */}
          <div className="absolute top-6 right-6 z-50">
            <ThemeToggle />
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20">
            <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-blue-500 blur-[120px]" />
            <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500 blur-[100px]" />
          </div>
          <div className="border-border bg-card relative z-10 w-full max-w-sm rounded-3xl border p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="bg-muted border-border mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
              <span className="text-2xl">🛠️</span>
            </div>
            <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
              Modo Desenvolvimento
            </h1>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Informe um slug na URL para testar o renderer localmente.
            </p>
            <div className="group relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
              <code className="relative block rounded-xl border border-white/5 bg-black/50 p-4 font-mono text-xs text-blue-400">
                ?slug=seu-slug
              </code>
            </div>
          </div>
        </div>
      );
    }
    notFound();
  }

  if (profile.status === "PAUSED") {
    return (
      <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
        {/* Theme Toggle Positioned at Top Right */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20">
          <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-yellow-500 blur-[120px]" />
        </div>
        <div className="border-border bg-card relative z-10 w-full max-w-sm rounded-3xl border p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="bg-muted border-border mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
            <span className="text-2xl">⏸️</span>
          </div>
          <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
            Página Indisponível
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Este perfil está temporariamente pausado pelo proprietário.
          </p>
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
