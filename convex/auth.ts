import { github } from "@better-auth/core/social-providers";

export const authOptions = {
  provider: github({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
};

export { github };
