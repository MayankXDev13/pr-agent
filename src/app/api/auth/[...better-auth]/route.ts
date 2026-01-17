import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const handler = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.AUTH_URL!,
});

export const GET = handler.handler.GET;
export const POST = handler.handler.POST;
