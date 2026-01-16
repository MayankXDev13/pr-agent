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
    const user = session?.user as any;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getConvex();
    if (!client) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500 });
    }

    const subscription = await client.query("payments:getUserSubscription" as any, {
      userId: user.id,
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const { createPortalSession } = await import("../../../../lib/stripe");
    const portalSession = await createPortalSession(
      subscription.stripeCustomerId,
      `${origin}/dashboard/settings/billing`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
