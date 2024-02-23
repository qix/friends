import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions, FriendsSession } from "../pages/api/auth/[...nextauth]";
import { invariant } from "../jslib/invariant";

export async function requireFriendsSession(
  req: IncomingMessage & {
    cookies: NextApiRequest["cookies"];
  },
  res: ServerResponse
) {
  const session = await getServerSession(req, res, authOptions);
  invariant(session, "Expected session");
  return session as FriendsSession;
}

export async function tryGetFriendsSession(
  req: IncomingMessage & {
    cookies: NextApiRequest["cookies"];
  },
  res: ServerResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return null;
  }
  return session as FriendsSession;
}
