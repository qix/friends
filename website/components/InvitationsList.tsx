import { Invitation } from ".prisma/client";
import Link from "next/link";

export const InvitationsList = (props: { invitations: Invitation[] }) => {
  return (
    <>
      {props.invitations.map((invite) => {
        const inviteUrl = "invitation/" + invite.inviteCode;

        return (
          <div
            key={invite.id}
            className="card"
            style={{
              margin: "1rem 0",
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
                  legacyBehavior
                >
                  {inviteUrl}
                </Link>
              ) : (
                <em>Closed</em>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
