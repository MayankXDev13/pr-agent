import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256") || undefined;
    const event = request.headers.get("x-github-event") || "unknown";

    // Log webhook for now - actual processing requires Convex function
    console.log(`GitHub webhook received: ${event}`);
    console.log(`Payload: ${payload.substring(0, 200)}...`);

    return NextResponse.json({
      success: true,
      event,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
