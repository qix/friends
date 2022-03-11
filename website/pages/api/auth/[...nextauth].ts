import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { getPrismaClient } from "../../../server/db";

const prisma = getPrismaClient();

export type FriendsSession = Session & {
  user: User;
};

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      return {
        ...session,
        user,
      } as FriendsSession;
    },
  },
});
