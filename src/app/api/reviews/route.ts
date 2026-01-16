import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

let convex: any = null;

async function getConvex() {
  if (convex) return convex;
  if (typeof window !== "undefined") return null;
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return null;
  const { ConvexHttpClient } = await import("convex/browser");
  convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return convex;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const repoId = searchParams.get("repoId");

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    if (repoId) {
      const reviews = await client.query("review:listByRepo" as any, {
        repoId,
      });
      return NextResponse.json(reviews);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoId, prNumber } = await request.json();

    if (!repoId || !prNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const reviewId = await client.mutation("review:create" as any, {
      repoId,
      prNumber,
    });

    return NextResponse.json({ reviewId });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
