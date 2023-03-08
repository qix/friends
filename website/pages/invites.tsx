import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthRequired";
import { useRouter } from "next/router";
import { IncomingMessage } from "http";
import { getPrismaClient } from "../server/db";
import { Invitation } from ".prisma/client";
import Link from "next/link";
import { tryGetFriendsSession } from "../server/getFriendsSession";

const InviteList: NextPage<{
  invitations: Invitation[];
  error: string;
}> = ({ invitations, error }) => {
  const router = useRouter();

  return (
    <AuthenticatedPage title="Invite listing">
      {error
        ? error
        : invitations.map((invite) => {
            const inviteUrl = "invitation/" + invite.inviteCode;

            return (
              <div
                key={invite.id}
                className="card"
                style={{
                  margin: "1rem",
                }}
              >
                <div className="card-header">
                  {invite.invitedName} &lt;{invite.invitedEmail}&gt;
                </div>
                <div className="card-body">
                  <div>{invite.vouchMessage}</div>
                </div>
                <div className="card-footer">
                  URL:{" "}
                  {invite.isOpen ? (
                    <Link
                      href={{
                        pathname: inviteUrl,
                      }}
                      legacyBehavior>
                      {inviteUrl}
                    </Link>
                  ) : (
                    <em>Closed</em>
                  )}
                </div>
              </div>
            );
          })}

      <div
        className="card"
        style={{
          margin: "1rem",
        }}
      >
        <div className="card-header">New Invitation</div>
        <div className="card-body">
          <Link href={{ pathname: "/create-invite" }} passHref={true} legacyBehavior>
            <button className="btn btn-outline-secondary">Create Invite</button>
          </Link>
        </div>
      </div>
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
