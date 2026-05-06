import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidateTag, revalidatePath } from "next/cache";
import { purgeCacheByTag, purgeCacheByPath } from "./cache";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

describe("cache utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("purgeCacheByTag", () => {
    it("should call revalidateTag and return success", async () => {
      const result = await purgeCacheByTag("my-tag", "profile1");

      expect(revalidateTag).toHaveBeenCalledWith("my-tag", "profile1");
      expect(result.revalidated).toBe(true);
      expect(result.now).toBeDefined();
    });

    it("should use 'default' profile if not provided", async () => {
      await purgeCacheByTag("my-tag");
      expect(revalidateTag).toHaveBeenCalledWith("my-tag", "default");
    });

    it("should handle errors and return failure", async () => {
      vi.mocked(revalidateTag).mockImplementationOnce(() => {
        throw new Error("Purge failed");
      });

      const result = await purgeCacheByTag("my-tag");

      expect(result.revalidated).toBe(false);
      expect(result.error).toBe("Failed to purge cache tag");
    });
  });

  describe("purgeCacheByPath", () => {
    it("should call revalidatePath and return success", async () => {
      const result = await purgeCacheByPath("/blog/[slug]");

      expect(revalidatePath).toHaveBeenCalledWith("/blog/[slug]");
      expect(result.revalidated).toBe(true);
      expect(result.now).toBeDefined();
    });

    it("should call revalidatePath with type and return success", async () => {
      const result = await purgeCacheByPath("/blog", "layout");

      expect(revalidatePath).toHaveBeenCalledWith("/blog", "layout");
      expect(result.revalidated).toBe(true);
    });

    it("should handle errors and return failure", async () => {
      vi.mocked(revalidatePath).mockImplementationOnce(() => {
        throw new Error("Purge failed");
      });

      const result = await purgeCacheByPath("/error");

      expect(result.revalidated).toBe(false);
      expect(result.error).toBe("Failed to purge cache path");
    });
  });
});
