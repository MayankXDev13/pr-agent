import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

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

    const { patternId, feedback } = await request.json();

    if (!patternId || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    await client.mutation("patterns:updateFeedback" as any, {
      patternId,
      feedback,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pattern feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const patterns = await client.query("patterns:listPatterns" as any, {
      userId: user.id,
    });

    return NextResponse.json(patterns);
  } catch (error) {
    console.error("List patterns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}
