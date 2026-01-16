import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { authOptions } from "../../convex/auth";

export const getToken = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.AUTH_URL!,
}).getToken;

export const isAuthenticated = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.AUTH_URL!,
}).isAuthenticated;
