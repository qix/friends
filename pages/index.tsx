import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { FriandsSession } from "./api/auth/[...nextauth]";
import { MemberHome } from "../components/MemberHome";
import styles from "../styles/Home.module.css";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Home: NextPage<{
  discordLink: string;
}> = (props) => {
  const { discordLink } = props;
  const { data: session, status: sessionStatus } = useSession() as {
    data: FriandsSession;
    status: "authenticated" | "loading" | "unauthenticated";
  };

  if (sessionStatus === "loading") {
    return <LoadingSpinner />;
  }
  return (
    <div className="container">
      <Head>
        <title>Friands</title>
        <meta name="description" content="Friands Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session && session.user.memberActive ? (
        <MemberHome />
      ) : (
        <main className={styles.main}>
          <div className="card">
            <h5 className="card-header">Welcome to Friands Club</h5>
            <div className="card-body">
              <p>
                Friands Club is a private club. If you already have a membership
                please use the button below, otherwise please follow the link in
                your invitation email.
              </p>
              {session ? (
                <div className="alert alert-warning" role="alert">
                  You are signed in, but do not have an active membership.{" "}
                  <a
                    href="#"
                    onClick={(evt) => {
                      evt.preventDefault();
                      signOut();
                    }}
                  >
                    Sign out
                  </a>
                  .
                </div>
              ) : (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => signIn()}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      discordLink: process.env.DISCORD_LINK,
    },
  };
}
export default Home;
