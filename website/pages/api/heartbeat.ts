import { PrismaClient, PrismaPromise } from "@prisma/client";

import { Action } from "../../models/Action";
import { asyncHandler } from "../../server/asyncHandler";
import { NextApiRequest } from "next";
import { performAction } from "../../server/performAction";

export default asyncHandler<
  Action,
  {
    ok: boolean;
    error?: string;
  }
>(async function heartbeat(req: NextApiRequest) {
  await performAction(null, { type: "heartbeat", payload: {} });
  return {
    ok: true,
  };
});
