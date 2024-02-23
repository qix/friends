import { PrismaClient, PrismaPromise } from "@prisma/client";

import { Action } from "../../models/Action";
import { randomBytes } from "crypto";
import {
  sessionAsyncHandler,
  HttpError,
  asyncHandler,
} from "../../server/asyncHandler";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../jslib/invariant";
import { NextApiRequest } from "next";

type Data = {
  error?: string;
};

const adminUsers = (process.env.ADMIN_USERS || "").split(",").filter((v) => v);

const prisma: PrismaClient = getPrismaClient();

interface UserRecord {
  name: string;
  discordID: string | null;
}

export default asyncHandler<
  Action,
  {
    users: UserRecord[];
    error?: string;
  }
>(async function discordMembers(req: NextApiRequest) {
  const users = await prisma.user.findMany();

  const rv: UserRecord[] = [];
  for (const user of users) {
    if (user.memberName) {
      rv.push({
        discordID: user.memberDiscordID,
        name: user.memberName,
      });
    }
  }
  return {
    users: rv,
  };
});
