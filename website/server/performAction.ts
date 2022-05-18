import { PrismaClient, PrismaPromise, User } from "@prisma/client";

import { Action, ActionResponseByType } from "../models/Action";
import { randomBytes } from "crypto";
import { HttpError } from "./asyncHandler";
import { getPrismaClient } from "./db";
import { invariant } from "./invariant";
import { assertNever } from "../jslib/assertNever";

type Data = {
  error?: string;
};

const adminUsers = (process.env.ADMIN_USERS || "").split(",").filter((v) => v);

const prisma: PrismaClient = getPrismaClient();

export async function performAction(
  user: User | null,
  action: Action
): Promise<ActionResponseByType[typeof action["type"]]> {
  const email = user?.email;
  /***
   * performAction pre-checks
   */
  if (action.type === "createInvite") {
    if (!email || !adminUsers.includes(email)) {
      throw new HttpError(400, "Admin-only endpoint");
    }

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
  } else if (action.type === "heartbeat") {
    // Nothing required
  } else if (action.type === "rsvp") {
    // Nothing required
  } else if (action.type === "createEvent") {
    // Nothing required
  } else if (action.type === "createEventInvite") {
    // Nothing required
  } else {
    assertNever(action, "Unhandled action type in pre transaction");
  }

  /***
   * performAction transaction
   */
  // @todo: Prisma client types don't match documentation
  await prisma.$transaction(async (tx) => {
    await tx.actionLog.create({
      data: {
        type: action.type,
        payload: JSON.stringify(action.payload),
      },
    });

    if (action.type === "createInvite") {
      invariant(user, "createInvite requires a session");
      const p = action.payload;
      await tx.invitation.create({
        data: {
          vouchMessage: p.vouchMessage,
          inviteCode: p.inviteCode!,
          invitedEmail: p.email,
          invitedName: p.name,
          senderUserId: user.id,
        },
      });
    } else if (action.type === "acceptInvite") {
      invariant(user, "acceptInvite requires a session");
      const p = action.payload;
      const dbUser = await tx.user.findFirst({
        where: {
          id: user.id,
        },
      });
      invariant(
        dbUser?.memberActive === false,
        "Expected user memberActive to be false"
      );
      const invitation = await prisma.invitation.findUnique({
        where: {
          inviteCode: action.payload.inviteCode,
        },
      });
      invariant(invitation, "Expected to find invitation");
      invariant(invitation.isOpen, "Expected to find invitation");

      const splitPronouns = p.pronouns.split("/");
      invariant(splitPronouns.length === 2, "Expected two pronouns");
      await tx.user.update({
        where: {
          id: user.id,
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
          targetUserId: dbUser.id,
        },
      });
      await tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          isOpen: false,
        },
      });
    } else if (action.type === "createEvent") {
      const { payload } = action;
      await tx.event.create({
        data: {
          slug: payload.slug,
          name: payload.name,
        },
      });
    } else if (action.type === "createEventInvite") {
      const { payload } = action;
      await tx.eventInvite.create({
        data: {
          eventId: payload.eventId,
          slug: payload.slug,
          invitedName: payload.name,
          guestCount: payload.guestCount,
          privateNote: payload.privateNote,
        },
      });
    } else if (action.type === "rsvp") {
      const { payload } = action;
      const data = {
        eventId: payload.eventId,
        guestName: payload.name,
        message: payload.comments,
        response: payload.response,
      };

      if (payload.slug) {
        await tx.eventInvite.upsert({
          update: data,
          create: data,
          where: {
            eventId_slug: {
              eventId: payload.eventId,
              slug: payload.slug,
            },
          },
        });
      } else {
        await tx.eventInvite.create({ data });
      }
    } else if (action.type === "heartbeat") {
      // Nothing required
    } else {
      assertNever(action, "Unhandled action type in transaction");
    }
  });

  /***
   * performAction response building
   */
  if (action.type === "createInvite") {
    return {
      message: "Invitation created!",
      inviteCode: action.payload.inviteCode!,
    };
  } else if (action.type === "acceptInvite") {
    return { message: "Membership activated!" };
  } else if (action.type === "heartbeat") {
    return { ok: true };
  } else if (action.type === "rsvp") {
    return { ok: true };
  } else if (action.type === "createEvent") {
    return { ok: true };
  } else if (action.type === "createEventInvite") {
    return { ok: true };
  } else {
    assertNever(action, "Unhandled action type post transaction");
  }
}
