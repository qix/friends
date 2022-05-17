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
import { EventInvite } from "@prisma/client";

const Guest = (props: { guest: EventInvite }) => {
  const { guestName } = props.guest;
  return (
    <p>
      <h5>{guestName}</h5>
      <code>{JSON.stringify(props)}</code>
    </p>
  );
};
const EventPage: NextPage<{
  error: string;
  eventId: string;
  guests: EventInvite[];
}> = (props) => {
  const { eventId, guests, error } = props;

  return (
    <div className="main">
      <div className="container">
        <Head>
          <title>Guests</title>
        </Head>
        {error ? (
          <div>
            <div className="alert alert-danger m-5" role="alert">
              {error}
            </div>
          </div>
        ) : (
          guests.map((guest) => <Guest key={guest.id} guest={guest} />)
        )}
      </div>
    </div>
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
  console.log(guests, event.id);

  return {
    props: {
      eventId: event.id,
      guests,
    },
  };
}

export default EventPage;
