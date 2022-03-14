import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import { FriendsSession } from "../pages/api/auth/[...nextauth]";
import { invariant } from "./invariant";

export async function requireFriendsSession(req: IncomingMessage) {
  const session = await getSession({ req });
  invariant(session, "Expected session");
  return session as FriendsSession;
}

export async function tryGetFriendsSession(req: IncomingMessage) {
  const session = await getSession({ req });
  if (!session) {
    return null;
  }
  return session as FriendsSession;
}
