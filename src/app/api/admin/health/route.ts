import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const health = await convex.query("admin:getSystemHealth" as any);
    return NextResponse.json(health);
  } catch (error) {
    console.error("Admin health error:", error);
    return NextResponse.json({ error: "Failed to fetch system health" }, { status: 500 });
  }
}
