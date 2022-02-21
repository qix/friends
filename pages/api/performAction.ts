// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PrismaPromise } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";
import { Action } from "../../models/Action";
import { randomBytes } from "crypto";
import { asyncHandler, HttpError } from "../../server/asyncHandler";
import { Session } from "next-auth";
import { getPrismaClient } from "../../server/db";

type Data = {
  error?: string;
};

const adminUsers = (process.env.ADMIN_USERS || "").split(",").filter((v) => v);

const prisma: PrismaClient = getPrismaClient();

export default asyncHandler<Action, { message: string; error?: string }>(
  async function performAction(session, action: Action) {
    const email = session.user?.email;
    if (!email || !adminUsers.includes(email)) {
      throw new HttpError(400, "Admin-only endpoint");
    }

    if (action.type === "createInvite") {
      const inviteCode = randomBytes(8).toString("hex").toUpperCase();
      action.payload.inviteCode = inviteCode;

      const p = action.payload;
    } else {
      throw new Error("Unknown transaction type");
    }

    // @todo: Prisma client types don't match documentation
    await prisma.$transaction(async (tx) => {
      await tx.actionLog.create({
        data: {
          type: action.type,
          payload: JSON.stringify(action.payload),
        },
      });

      if (action.type === "createInvite") {
        const p = action.payload;
        await tx.invitation.create({
          data: {
            vouchMessage: p.vouchMessage,
            inviteCode: p.inviteCode!,
            invitedEmail: p.email,
            invitedName: p.name,
            senderUserId: session.user.id,
          },
        });
      } else {
        throw new Error("Unhandled action type during transaction");
      }
    });

    return { message: "Invitation created!" };
  }
);
