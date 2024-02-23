import type { GetServerSidePropsContext, NextPage } from "next";
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
import { useSession } from "next-auth/react";
import { FriendsSession } from "./api/auth/[...nextauth]";
import { invariant } from "../jslib/invariant";
import { useFriendsSession } from "../frontend/useFriendsSession";

const InviteList: NextPage<{
  invitations: Invitation[];
  error: string;
}> = ({ invitations, error }) => {
  const session = useFriendsSession();
  return (
    <AuthenticatedPage title="Invitations">
      {session ? (
        <>
          {session.user.memberInvitesRemaining > 0 ? (
            <>
              <h3>
                Create a new invitation ({session.user.memberInvitesRemaining}{" "}
                remaining)
              </h3>
              <div
                style={{
                  margin: "1rem",
                }}
              >
                <CreateInvite skipHeading={true} />
              </div>
            </>
          ) : (
            <>
              <h3>Create an Invitation</h3>
              <div className="alert alert-info m-3" role="alert">
                You don&apos;t have any remaining invitations to send out.
              </div>
            </>
          )}

          {invitations?.length ? (
            <>
              <h3>Your previous invitations</h3>
              <div className="m-3">
                {error ? error : <InvitationsList invitations={invitations} />}
              </div>
            </>
          ) : null}

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
        </>
      ) : (
        <></>
      )}
    </AuthenticatedPage>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await tryGetFriendsSession(context.req, context.res);
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
