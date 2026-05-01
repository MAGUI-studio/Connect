import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../src/utils/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const linkId = searchParams.get("linkId");
  const url = searchParams.get("url");

  if (!linkId || !url) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  try {
    await prisma.maguiConnectLink.update({
      where: { id: linkId },
      data: {
        clickCount: { increment: 1 },
      },
    });
  } catch (error) {
    console.error("Failed to increment click count:", error);
    // Continue redirecting even if tracking fails
  }

  return NextResponse.redirect(url);
}
