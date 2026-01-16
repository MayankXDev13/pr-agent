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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, feedback } = await request.json();

    if (!commentId || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    await client.mutation("review:addFeedback" as any, {
      commentId,
      feedback,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
