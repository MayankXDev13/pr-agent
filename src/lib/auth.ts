import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy-client-secret",
      authorization: {
        params: {
          scope: "repo read:user read:org admin:repo_hook",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubUsername = profile?.login;
      }
      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          githubUsername: token.githubUsername,
          accessToken: token.accessToken,
        },
      };
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-key-for-development",
};

const nextAuth = NextAuth(authOptions);

export const handlers = nextAuth;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export { authOptions };
