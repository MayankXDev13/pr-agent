import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import crypto from "crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");
    const deliveryId = request.headers.get("x-github-delivery");

    if (WEBHOOK_SECRET && !verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(payload);

    console.log(`[Webhook] Received ${event} event (${deliveryId})`);

    switch (event) {
      case "ping":
        return NextResponse.json({ message: "Webhook configured successfully" });

      case "pull_request":
        if (body.action === "opened" || body.action === "synchronize") {
          const pr = body.pull_request;
          const repo = body.repository;

          const repoId = await findRepoByFullName(repo.full_name);
          
          if (repoId) {
            await convex.mutation("review:create" as any, {
              repoId,
              prNumber: pr.number,
            });

            console.log(`[Webhook] Created review for PR #${pr.number}`);
          }
        }
        return NextResponse.json({ message: "PR event processed" });

      case "push":
        const repo = body.repository;
        const repoId = await findRepoByFullName(repo.full_name);
        
        if (repoId) {
          await convex.mutation("index:reindexOnPush" as any, {
            repoId,
            commitSha: body.after,
          });

          console.log(`[Webhook] Triggered reindex for ${repo.full_name}`);
        }
        return NextResponse.json({ message: "Push event processed" });

      case "installation":
        if (body.action === "created") {
          const installationId = body.installation?.id;
          console.log(`[Webhook] GitHub App installed: ${installationId}`);
        }
        return NextResponse.json({ message: "Installation event processed" });

      default:
        return NextResponse.json({ message: `Event ${event} received but not processed` });
    }
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function findRepoByFullName(fullName: string): Promise<string | null> {
  try {
    const repos = await convex.query("repos:listByFullName" as any, { fullName });
    return repos?.[0]?._id || null;
  } catch {
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "GitHub webhook endpoint is active",
    events: ["ping", "pull_request", "push", "installation"],
  });
}
