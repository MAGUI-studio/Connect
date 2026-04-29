import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Purges the Next.js Data Cache for a specific cache tag.
 * Useful for updating all fetches across the app that share a tag.
 *
 * @param tag The cache tag to revalidate.
 */
export async function purgeCacheByTag(
  tag: string,
  profile: string = "default"
) {
  try {
    revalidateTag(tag, profile);
    console.log(`[Cache Purge] Successfully purged tag: ${tag}`);
    return { revalidated: true, now: Date.now() };
  } catch (error) {
    console.error(`[Cache Purge] Failed to purge tag: ${tag}`, error);
    return { revalidated: false, error: "Failed to purge cache tag" };
  }
}

/**
 * Purges the Next.js Router Cache for a specific path.
 *
 * @param path The relative path to revalidate (e.g., '/blog/post-1').
 * @param type The type of revalidation ('page' or 'layout').
 */
export async function purgeCacheByPath(path: string, type?: "page" | "layout") {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
    console.log(`[Cache Purge] Successfully purged path: ${path}`);
    return { revalidated: true, now: Date.now() };
  } catch (error) {
    console.error(`[Cache Purge] Failed to purge path: ${path}`, error);
    return { revalidated: false, error: "Failed to purge cache path" };
  }
}
