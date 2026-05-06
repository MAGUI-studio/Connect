import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { prisma } from "../../../src/utils/prisma";

vi.mock("../../../src/utils/prisma", () => ({
  prisma: {
    maguiConnectLink: {
      update: vi.fn(),
    },
  },
}));

describe("GET /api/click", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if linkId is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/click?url=https://example.com"
    );
    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.text();
    expect(body).toBe("Missing parameters");
  });

  it("should return 400 if url is missing", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/click?linkId=123"
    );
    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.text();
    expect(body).toBe("Missing parameters");
  });

  it("should increment click count and redirect on valid parameters", async () => {
    const linkId = "link_123";
    const url = "https://example.com/dest";
    const request = new NextRequest(
      `http://localhost:3000/api/click?linkId=${linkId}&url=${encodeURIComponent(url)}`
    );

    const response = await GET(request);

    expect(prisma.maguiConnectLink.update).toHaveBeenCalledWith({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    });
    expect(response.status).toBe(307); // NextResponse.redirect defaults to 307
    expect(response.headers.get("Location")).toBe(url);
  });

  it("should redirect even if prisma update fails", async () => {
    const linkId = "link_123";
    const url = "https://example.com/dest";
    const request = new NextRequest(
      `http://localhost:3000/api/click?linkId=${linkId}&url=${encodeURIComponent(url)}`
    );

    vi.mocked(prisma.maguiConnectLink.update).mockRejectedValueOnce(
      new Error("Database error")
    );

    const response = await GET(request);

    expect(prisma.maguiConnectLink.update).toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(url);
  });
});
