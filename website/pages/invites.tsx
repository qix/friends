import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthRequired";
import { useRouter } from "next/router";
import { IncomingMessage } from "http";
import { getPrismaClient } from "../server/db";
import { Invitation } from ".prisma/client";
import Link from "next/link";
import { tryGetFriendsSession } from "../server/getFriendsSession";
import { CreateInvite } from "../components/CreateInvite";
import { InvitationsList } from "../components/InvitationsList";

const InviteList: NextPage<{
  invitations: Invitation[];
  error: string;
}> = ({ invitations, error }) => {
  return (
    <AuthenticatedPage title="Invitations">
      <h3>Create a new invitation</h3>
      <p>
        <div
          style={{
            margin: "1rem",
          }}
        >
          <CreateInvite skipHeading={true} />
        </div>
      </p>
      {invitations?.length && (
        <>
          <h3>Your previous invitations</h3>
          <div
            style={{
              margin: "0 1rem",
            }}
          >
            {error ? error : <InvitationsList invitations={invitations} />}
          </div>
        </>
      )}

      {/*
      Form is just included for now
      <div
        className="card"
        style={{
          margin: "1rem",
        }}
      >
        <div className="card-header">New Invitation</div>
        <div className="card-body">
          <Link
            href={{ pathname: "/create-invite" }}
            passHref={true}
            legacyBehavior
          >
            <button className="btn btn-outline-secondary">Create Invite</button>
          </Link>
        </div>
      </div>
      */}
    </AuthenticatedPage>
  );
};

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const session = await tryGetFriendsSession(req);
  if (!session) {
    return {
      props: {
        error: "Not logged in.",
      },
    };
  }

  const db = getPrismaClient();
  const invitations = await db.invitation.findMany({
    where: {
      senderUserId: session.user.id,
    },
  });
  return {
    props: {
      invitations,
    },
  };
}
export default InviteList;
