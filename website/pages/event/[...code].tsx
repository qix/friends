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

const EventPage: NextPage<{
  error: string;
  eventName: string;
  invitedName: string;
}> = (props) => {
  const { invitedName, error } = props;

  const { data: session } = useSession() as {
    data: FriendsSession;
    status: string;
  };

  const eventName = "Braai";
  const eventNameWithDate = "Braai on Monday, May 23rd";
  const description =
    "I'm hosting a braai (barbecue) for a bunch of friends and neighborhood folk on the 23rd.";
  const imageHeader = "https://friends.nyc/images/braai-header.jpg";
  const imageSquare = "https://friends.nyc/images/braai-square.jpg";

  return (
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
        <EventBlock
          eventNameWithDate={eventNameWithDate}
          description={description}
          imageHeader={imageHeader}
          invitedName={invitedName}
        />
      )}
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
    /*
    return {
      props: {
        error: "Could not find an event at the given address.",
      },
    };
    */
  }

  return {
    props: {
      invitedName: "YourName",
    },
  };
}

export default EventPage;
