import type { NextPage } from "next";
import Head from "next/head";
import { Person } from "../../models/Person";
import { InvitationBlock } from "../../components/InvitationBlock";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";

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

  return (
    <div className="container">
      <Head>
        <title>Friands</title>
        <meta name="description" content="Friands Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error ? (
        <div className="alert alert-danger m-5" role="alert">
          {error}
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
