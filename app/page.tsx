import { prisma } from "../src/utils/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ProfileView } from "../components/ProfileView";

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4 font-sans text-white">
          <div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">
              Modo Desenvolvimento
            </h1>
            <p className="mb-6 text-white/60">
              Informe um slug na URL para testar o renderer localmente.
            </p>
            <code className="block rounded-lg bg-black/50 p-3 text-sm text-blue-400">
              ?slug=seu-cliente
            </code>
          </div>
        </div>
      );
    }
    notFound();
  }

  if (profile.status === "PAUSED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4 text-white">
        <h1 className="mb-2 text-2xl font-bold text-white">
          Página Indisponível
        </h1>
        <p className="text-center text-white/60">
          Este perfil está temporariamente pausado pelo proprietário.
        </p>
      </div>
    );
  }

  return (
    <ProfileView
      profile={profile as Parameters<typeof ProfileView>[0]["profile"]}
    />
  );
}
