import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("lib/utils", () => {
  describe("cn", () => {
    it("should merge tailwind classes correctly", () => {
      expect(cn("px-2 py-1", "p-4")).toBe("p-4");
      expect(cn("text-red-500", { "text-blue-500": true })).toBe(
        "text-blue-500"
      );
      expect(cn("bg-white", null, undefined, false, "text-black")).toBe(
        "bg-white text-black"
      );
    });
  });
});
