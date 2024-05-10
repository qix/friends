import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { getPrismaClient } from "../../../server/db";

const prisma = getPrismaClient();

export type FriendsSession = Session & {
  user: User;
  isAdmin: boolean;
};
const adminUsers = (process.env.ADMIN_USERS || "").split(",").filter((v) => v);

export const authOptions: AuthOptions = {
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
        isAdmin: adminUsers.includes(user.email || ""),
      } as FriendsSession;
    },
  },
};

export default NextAuth(authOptions);
