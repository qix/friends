import type { NextPage } from "next";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";
import { Event, EventInvite } from "@prisma/client";
import { AuthenticatedPage } from "../../components/AuthRequired";
import { assertNever } from "../../jslib/assertNever";
import { EventContainer } from "../../components/EventContainer";
import {
  buildInviteUrl,
  EventInviteForm,
} from "../../components/EventInviteForm";
import { UpdateEventBlock } from "../../components/UpdateEventBlock";

const Guest = (props: {
  event: Partial<Event>;
  guest: Partial<EventInvite>;
}) => {
  const { event, guest } = props;
  const inviteUrl = buildInviteUrl(event.slug!, guest.slug!);

  let guestName = guest.guestName || null;
  if (!guestName) {
    guestName = guest.invitedName || "(Unknown)";
  } else if (guest.invitedName && guest.invitedName !== guestName) {
    guestName += ` (${guest.invitedName})`;
  }

  let badge: JSX.Element;
  if (guest.response === "GOING") {
    badge = <span className="badge bg-success">Yes</span>;
  } else if (guest.response === "NOT_GOING") {
    badge = <span className="badge bg-danger">No</span>;
  } else if (guest.response === "MAYBE") {
    badge = <span className="badge bg-warning">???</span>;
  } else if (guest.response === "NONE") {
    badge = <span className="badge bg-secondary">---</span>;
  } else {
    badge = <em>(Unknown response: {guest.response})</em>;
  }

  return (
    <tr>
      <td className="text-center">
        {badge}
        {guest.confidencePercent ? (
          <div className="text-secondary py-1">{`${guest.confidencePercent}%`}</div>
        ) : null}
      </td>
      <td>
        <p>
          <h5>
            {guestName} [{guest.guestCount}]
          </h5>
          {guest.privateNote ? (
            <div className="card">
              <div className="card-body">
                <span className="badge bg-secondary">(private)</span>{" "}
                {guest.privateNote}
              </div>
            </div>
          ) : null}
          {guest.inviteMessage ? (
            <div className="card">
              <div className="card-body">
                <span className="badge bg-secondary">(invitation)</span>{" "}
                {guest.inviteMessage}
              </div>
            </div>
          ) : null}
          {guest.message ? (
            <div className="card">
              <div className="card-body">{guest.message}</div>
            </div>
          ) : null}
          {inviteUrl ? (
            <div>
              <a href={inviteUrl}>{inviteUrl}</a>
            </div>
          ) : null}
        </p>
      </td>
    </tr>
  );
};

const AttendenceSummary = (props: { guests: Partial<EventInvite>[] }) => {
  const { guests } = props;
  // Track how many guests have said yes/maybe at each percent confidence
  const percentCount = new Array(101).fill(0);
  let unknownConfidence = 0;
  let noAnswer = 0;
  let declined = 0;
  guests.forEach((guest) => {
    if (guest.response === "MAYBE" || guest.response === "GOING") {
      if (typeof guest.confidencePercent === "number") {
        for (let i = 0; i <= Math.min(100, guest.confidencePercent); i++) {
          percentCount[i] += guest.guestCount ?? 1;
        }
      } else {
        unknownConfidence += guest.guestCount ?? 1;
      }
    } else if (guest.response === "NOT_GOING") {
      declined += guest.guestCount ?? 1;
    } else if (guest.response === "NONE" || !guest.response) {
      noAnswer += guest.guestCount ?? 1;
    } else {
      assertNever(guest.response, "Unknown guest response for event");
    }
  });

  let last = -1;
  const attendPercents: JSX.Element[] = [];
  for (let i = 1; i <= 100; i++) {
    if (i === 100 || percentCount[i] !== percentCount[i + 1]) {
      attendPercents.push(
        <>
          <strong>{i}%</strong> confidence: {percentCount[i]} people
        </>
      );
    }
  }

  return (
    <>
      {attendPercents.map((text) => (
        <>
          <div>{text}</div>
        </>
      ))}
      <div>
        <strong>Unknown confidence: </strong>
        {unknownConfidence} people
      </div>
      <div>
        <strong>Declined: </strong>
        {declined} people
      </div>
      <div>
        <strong>Still waiting: </strong>
        {noAnswer} people
      </div>
    </>
  );
};

const EventPage: NextPage<{
  error: string;
  event: Partial<Event>;
  guests: Partial<EventInvite>[];
}> = (props) => {
  const isOwner = true;
  const { event, guests, error } = props;

  return (
    <AuthenticatedPage title="Event Guests">
      {error ? (
        <div>
          <div className="alert alert-danger m-5" role="alert">
            {error}
          </div>
        </div>
      ) : (
        <EventContainer
          isOwner={isOwner}
          eventSlug={event.slug!}
          isLoggedIn={true}
        >
          <AttendenceSummary guests={guests} />
          <table className="table table-striped">
            <tbody>
              {guests.map((guest) => (
                <Guest key={guest.id} event={event} guest={guest} />
              ))}
            </tbody>
          </table>
          <UpdateEventBlock event={event} />
          <EventInviteForm event={event} />
        </EventContainer>
      )}
    </AuthenticatedPage>
  );
};

export async function getServerSideProps(context: {
  query: {
    code: string[];
  };
}) {
  const prisma = getPrismaClient();

  invariant(context.query.code?.length === 1, "Expected a single event code");
  const [code] = context.query.code;

  const event = await prisma.event.findFirst({
    where: {
      slug: code,
    },
  });
  if (!event) {
    return {
      props: {
        error: "Could not find an event at the given address.",
      },
    };
  }

  const guests = await prisma.eventInvite.findMany({
    where: {
      eventId: event.id,
    },
  });

  return {
    props: {
      event: {
        id: event.id,
        slug: event.slug,
        description: event.description,
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
    },
  };
}

export default EventPage;
