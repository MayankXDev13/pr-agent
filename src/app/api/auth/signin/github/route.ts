import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { authOptions } from "../../../../../../convex/auth";

export async function POST(request: Request) {
  const handler = convexBetterAuthNextJs({
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
    convexSiteUrl: process.env.AUTH_URL!,
  });

  const url = new URL(request.url);
  const providerId = url.searchParams.get("provider") || "github";

  const response = await handler.handler.POST(
    new Request(`https://example.com/api/auth/signin/${providerId}`, {
      method: "POST",
      headers: request.headers,
    })
  );

  return response;
}
