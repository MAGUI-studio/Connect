import { headers } from "next/headers";
import { prisma } from "../src/utils/prisma";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function MaguiConnectPage(props: Props) {
  const resolvedSearchParams = await props.searchParams;
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const isLocalhost =
    host.includes("localhost") || host.startsWith("127.0.0.1");

  const profile =
    isLocalhost && resolvedSearchParams.slug
      ? await prisma.maguiConnectProfile.findUnique({
          where: { slug: resolvedSearchParams.slug },
          include: {
            MaguiConnectLink: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        })
      : !isLocalhost
        ? await prisma.maguiConnectProfile.findUnique({
            where: { domain: host },
            include: {
              MaguiConnectLink: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          })
        : null;

  if (!profile) {
    if (isLocalhost && !resolvedSearchParams.slug) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-gray-900">
          <h1 className="mb-4 text-2xl font-bold">Development Mode</h1>
          <p>Please provide a slug in the URL to test locally.</p>
          <p className="mt-2 text-gray-500">
            Example: <code>?slug=seu-cliente</code>
          </p>
        </div>
      );
    }
    notFound();
  }

  if (profile.status === "PAUSED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-gray-900">
        <h1 className="mb-4 text-2xl font-bold">Página Indisponível</h1>
        <p>Este perfil está temporariamente pausado.</p>
      </div>
    );
  }

  const dynamicStyles = {
    backgroundColor: profile.themeBackground || "#f3f4f6",
    color: profile.themeForeground || "#111827",
  };

  const accentStyles = {
    backgroundColor: profile.themeAccent || "#3b82f6",
    color: "#ffffff",
  };

  return (
    <div
      style={dynamicStyles}
      className="flex min-h-screen w-full justify-center"
    >
      <main className="flex w-full max-w-2xl flex-col items-center p-8">
        {profile.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="mb-4 h-24 w-24 rounded-full border border-black/10 object-cover"
          />
        )}

        <h1 className="mb-2 text-center text-3xl font-bold">
          {profile.displayName}
        </h1>

        {profile.headline && (
          <p className="mb-8 text-center text-lg opacity-80">
            {profile.headline}
          </p>
        )}

        <div className="flex w-full flex-col gap-4">
          {profile.MaguiConnectLink.map((link) => (
            <a
              key={link.id}
              href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl p-4 text-center font-medium shadow-sm transition-transform hover:scale-105"
              style={accentStyles}
            >
              {link.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
