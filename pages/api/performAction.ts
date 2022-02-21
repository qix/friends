import { PrismaClient, PrismaPromise } from "@prisma/client";

import { Action } from "../../models/Action";
import { randomBytes } from "crypto";
import { asyncHandler, HttpError } from "../../server/asyncHandler";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";

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
    } else if (action.type === "acceptInvite") {
      invariant(action.payload.inviteCode, "Expected inviteCode");
      const invitation = await prisma.invitation.findUnique({
        where: {
          inviteCode: action.payload.inviteCode,
        },
      });
      invariant(invitation, "Expected to find invitation");
      action.payload.inviteId = invitation.id;
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
      } else if (action.type === "acceptInvite") {
        const p = action.payload;
        const user = await tx.user.findFirst({
          where: {
            id: session.user.id,
          },
        });
        invariant(
          user?.memberActive === false,
          "Expected user memberActive to be false"
        );
        const invitation = await prisma.invitation.findUnique({
          where: {
            inviteCode: action.payload.inviteCode,
          },
        });
        invariant(invitation, "Expected to find invitation");

        const splitPronouns = p.pronouns.split("/");
        invariant(splitPronouns.length === 2, "Expected two pronouns");
        await tx.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            memberActive: true,
            memberName: p.name,
            memberEmail: p.email,
            memberPronoun1: splitPronouns[0],
            memberPronoun2: splitPronouns[1],
            memberInvitationId: p.inviteId,
            memberWhatDo: p.whatDo,
          },
        });
        await tx.vouch.create({
          data: {
            message: invitation.vouchMessage,
            sourceUserId: invitation.senderUserId,
            targetUserId: session.user.id,
          },
        });
      } else {
        throw new Error("Unhandled action type during transaction");
      }
    });

    return { message: "Invitation created!" };
  }
);
