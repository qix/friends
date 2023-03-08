import type { NextPage } from "next";
import Head from "next/head";
import { Person } from "../../models/Person";
import { InvitationBlock } from "../../components/InvitationBlock";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";
import { signIn, useSession } from "next-auth/react";
import { FriendsSession } from "../api/auth/[...nextauth]";
import Link from "next/link";

const Invitation: NextPage<{
  error: string;
  vouchFrom: Person;
  message: string;
  invitedName: string;
  invitedEmail: string;
  inviteCode: string;
}> = (props) => {
  const { error, vouchFrom, message, invitedName, invitedEmail, inviteCode } =
    props;

  const { data: session } = useSession() as {
    data: FriendsSession;
    status: string;
  };

  return (
    <div className="container">
      <Head>
        <title>Friends</title>
        <meta name="description" content="Friends.nyc" />
        <meta property="og:site_name" content="Friends.nyc" />
        <meta property="og:title" content="Your invitation to Friends.nyc" />
        <meta
          property="og:description"
          content="This is an invitation to our New York-based social group. It's mostly centered around a Discord chat."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="http://friends.nyc/friends-logo-3.jpg"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error ? (
        <div>
          <div className="alert alert-danger m-5" role="alert">
            {error}
          </div>
          {session ? (
            <div className="alert alert-success m-5" role="alert">
              You are logged in as an active member.{" "}
              <Link href="/">
                Go to membership page
              </Link>
            </div>
          ) : (
            <div className="alert alert-info m-5" role="alert">
              If you already signed up, you can try{" "}
              <a href="#" onClick={() => signIn("google")}>
                sign in with Google
              </a>
            </div>
          )}
        </div>
      ) : (
        <InvitationBlock
          vouchFrom={vouchFrom}
          vouchMessage={message}
          invitedName={invitedName}
          invitedEmail={invitedEmail}
          inviteCode={inviteCode}
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
  invariant(
    context.query.code?.length === 1,
    "Expected a single invitation code"
  );
  const [code] = context.query.code;

  const invitation = await prisma.invitation.findFirst({
    where: {
      inviteCode: code,
    },
  });
  if (!invitation) {
    return {
      props: {
        error: "Could not find an invitation at the given address.",
      },
    };
  }
  if (!invitation.isOpen) {
    return {
      props: {
        error: "Invitation has been used, expired, or was retracted.",
      },
    };
  }

  const from = await prisma.user.findFirst({
    where: {
      id: invitation.senderUserId,
    },
  });
  invariant(from, "Expected to find invitation sender");

  return {
    props: {
      vouchFrom: {
        name: from.memberName,
        pronoun1: from.memberPronoun1,
        pronoun2: from.memberPronoun2,
      },
      invitedName: invitation.invitedName,
      invitedEmail: invitation.invitedEmail,
      inviteCode: invitation.inviteCode,
      message: invitation.vouchMessage,
    },
  };
}

export default Invitation;
