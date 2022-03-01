import type { NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, number, date, InferType } from "yup";

import { AuthRequired } from "../components/AuthRequired";
import { useState } from "react";
import { Action } from "../models/Action";
import { performAction } from "../frontend/performAction";
import { useRouter } from "next/router";
import { resolve } from "uri-js";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
import { FriandsSession } from "./api/auth/[...nextauth]";
import { invariant } from "../server/invariant";
import { getPrismaClient } from "../server/db";
import { Invitation } from ".prisma/client";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const schema = object({
  name: string().required("Name is required"),
  email: string().email().required("Email is required"),
  vouchMessage: string().required("Message is required"),
});
type CreateInviteFields = InferType<typeof schema>;
const initalValues: CreateInviteFields = {
  name: "",
  email: "",
  vouchMessage: "",
};

const CreateInvite: NextPage<{
  invitations: Invitation[];
}> = ({ invitations }) => {
  const router = useRouter();

  return (
    <AuthRequired>
      <Head>
        <title>Friands</title>
        <meta name="description" content="Friands Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          {invitations.map((invite) => {
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

          <div
            className="card"
            style={{
              margin: "1rem",
            }}
          >
            <div className="card-header">New Invitation</div>
            <div className="card-body">
              <Link href={{ pathname: "/create-invite" }}>
                <button className="btn btn-outline-secondary">
                  Create Invite
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AuthRequired>
  );
};

async function requireFriandsSession(req: IncomingMessage) {
  const session = await getSession({ req });
  invariant(session, "Expected session");
  return session as FriandsSession;
}

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const session = await requireFriandsSession(req);
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
export default CreateInvite;
