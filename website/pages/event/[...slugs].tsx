import type { NextPage } from "next";
import Head from "next/head";
import { Person } from "../../models/Person";
import { InvitationBlock } from "../../components/InvitationBlock";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";
import { signIn, useSession } from "next-auth/react";
import { FriendsSession } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { EventBlock } from "../../components/EventBlock";
import { Event, EventInvite } from "@prisma/client";
import { EventContainer } from "../../components/EventContainer";
import { EventGuests } from "../../components/EventGuests";
import { UpdateEventBlock } from "../../components/UpdateEventBlock";
import { assertNever } from "../../jslib/assertNever";

const EventPage: NextPage<{
  error: string;
  page: "event" | "guests" | "update";
  event: Partial<Event>;
  eventInvite: Partial<EventInvite>;
}> = ({ event, eventInvite, error, page }) => {
  const { data: session } = useSession() as {
    data: FriendsSession;
    status: "authenticated" | "loading" | "unauthenticated";
  };

  // Hard-code the owner for now
  const isOwner = session?.user?.id === "ckzwprf700006zc59boklxy00";

  const eventNameWithDate = event.datedName || event.name!;
  const description = event.metaDescription || "";
  const imageHeader = `https://friends.nyc/images/${
    event.headerImage || "default-header"
  }.jpg`;
  const imageSquare = `https://friends.nyc/images/${
    event.opengraphImage || "default-square"
  }.jpg`;

  let block: JSX.Element;
  if (page === "event") {
    block = (
      <EventBlock
        eventNameWithDate={eventNameWithDate}
        description={description}
        imageHeader={imageHeader}
        eventInvite={eventInvite}
        event={event}
      />
    );
  } else if (page === "guests") {
    block = <EventGuests event={event}></EventGuests>;
  } else if (page === "update") {
    block = (
      <div className="card">
        <h5 className="card-header">Update the event</h5>
        <div className="card-body">
          <UpdateEventBlock event={event} />
        </div>
      </div>
    );
  } else {
    assertNever(page, "Unexpected page");
  }

  return (
    <div className="main">
      <div className="container">
        <Head>
          <title>{eventNameWithDate}</title>
          <meta name="description" content="Friends.nyc" />
          <meta property="og:site_name" content="Friends.nyc" />
          <meta property="og:title" content={eventNameWithDate} />
          <meta property="og:description" content={description} />
          <meta property="og:image" itemProp="image" content={imageSquare} />
          <meta property="og:type" content="website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {error ? (
          <div>
            <div className="alert alert-danger m-5" role="alert">
              {error}
            </div>
          </div>
        ) : (
          <EventContainer
            page={page}
            isOwner={isOwner}
            eventSlug={event.slug || null}
            isLoggedIn={!!session}
          >
            {block}
          </EventContainer>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: {
  query: {
    slugs: string[];
    invite?: string;
  };
}) {
  const prisma = getPrismaClient();
  const { slugs } = context.query;
  const [eventSlug, page] = [...slugs, "event"];

  invariant(eventSlug, "Expected a event code");
  invariant(
    page === "event" || page === "guests" || page === "update",
    "Unknown page"
  );

  const event = await prisma.event.findFirst({
    where: {
      slug: eventSlug,
    },
  });
  if (!event) {
    return {
      props: {
        error: "Could not find an event at the given address.",
      },
    };
  }

  let eventInvite: EventInvite | null = null;
  if (context.query.invite) {
    eventInvite = await prisma.eventInvite.findFirst({
      where: {
        slug: context.query.invite,
        eventId: event.id,
      },
    });
  }

  return {
    props: {
      page,
      event: {
        id: event.id,
        address: event.address,
        googlePlaceId: event.googlePlaceId,
        slug: event.slug,
        name: event.name,
        description: event.description,
        startAtIso: event.startAtIso || null,
        endAtIso: event.endAtIso || null,
        calendarTitle: event.calendarTitle || null,
        calendarDescription: event.calendarDescription || null,
        datedName: event.datedName || null,
        metaDescription: event.metaDescription || null,
        opengraphImage: event.opengraphImage || null,
        headerImage: event.headerImage || null,
      },
      eventInvite: eventInvite
        ? {
            slug: eventInvite.slug || null,
            invitedName: eventInvite.invitedName || null,
            guestName: eventInvite.guestName || null,
            message: eventInvite.message || null,
            inviteMessage: eventInvite.inviteMessage || null,
            response: eventInvite.response,
          }
        : {},
    },
  };
}

export default EventPage;
