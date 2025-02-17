import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import db from "@repo/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("hi signin");

      if (!user?.email || !account?.provider) {
        return false;
      }

      await db.merchant.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
        create: {
          email: user.email,
          name: user.name,
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
      });

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
