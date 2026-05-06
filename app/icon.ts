import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getCurrentRequestHost,
  getCurrentRequestSlugFromReferer,
  getPublicProfileBySlugOrDomain,
  resolvePublicAssetUrl,
} from "@/services/magui-connect-public";

async function getFallbackIcon() {
  const filePath = join(process.cwd(), "public", "images", "placeholder.svg");
  const file = await readFile(filePath, "utf8");

  return new Response(file, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export default async function Icon() {
  const host = await getCurrentRequestHost();
  const slug = await getCurrentRequestSlugFromReferer();
  const profile = await getPublicProfileBySlugOrDomain({
    host,
    slug,
  });

  const iconUrl = resolvePublicAssetUrl(profile?.faviconUrl);

  if (!iconUrl) {
    return getFallbackIcon();
  }

  try {
    const response = await fetch(iconUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getFallbackIcon();
    }

    const contentType = response.headers.get("content-type") || "image/x-icon";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return getFallbackIcon();
  }
}
