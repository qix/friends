import { Event, EventInvite, PrismaClient } from "@prisma/client";

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

const prisma: PrismaClient = getPrismaClient();

interface ErrorResponse {
  error: string;
}
export interface EventGuestsResponse {
  event: Partial<Event>;
  guests: Array<Partial<EventInvite>>;
  error: undefined;
}

export default asyncHandler<Action, EventGuestsResponse | ErrorResponse>(
  async function eventGuests(req: NextApiRequest) {
    const prisma = getPrismaClient();

    invariant(typeof req.query.event === "string", "Expected string event");
    const event = await prisma.event.findFirst({
      where: {
        slug: req.query.event,
      },
    });
    if (!event) {
      return {
        error: "Could not find an event at the given address.",
      };
    }

    const guests = await prisma.eventInvite.findMany({
      where: {
        eventId: event.id,
      },
    });

    return {
      event: {
        id: event.id,
        slug: event.slug,
        name: event.name,
        datedName: event.datedName,
        description: event.description,
        calendarTitle: event.calendarTitle,
        calendarDescription: event.calendarDescription,
        metaDescription: event.metaDescription,
        address: event.address,
        startAtIso: event.startAtIso,
        endAtIso: event.endAtIso,
        opengraphImage: event.opengraphImage,
        headerImage: event.headerImage,
      },
      guests: guests.map((guest) => ({
        id: guest.id,
        slug: guest.slug || null,
        inviteMessage: guest.inviteMessage || null,
        invitedName: guest.invitedName || null,
        invitedEmail: guest.invitedEmail || null,
        privateNote: guest.privateNote || null,
        response: guest.response,
        message: guest.message,
        guestCount: guest.guestCount,
        guestName: guest.guestName || null,
        guestMax: guest.guestMax || null,
        confidencePercent: guest.confidencePercent || null,
      })),
    };
  }
);
