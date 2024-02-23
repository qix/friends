import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { FriendsSession } from "./api/auth/[...nextauth]";
import { MemberHome } from "../components/MemberHome";
import styles from "../styles/Home.module.css";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AuthenticatedPage } from "../components/AuthRequired";

const Home: NextPage<{
  discordLink: string;
}> = (props) => {
  const { data: session, status: sessionStatus } = useSession() as {
    data: FriendsSession | null;
    status: "authenticated" | "loading" | "unauthenticated";
  };

  if (sessionStatus === "loading") {
    return <LoadingSpinner />;
  }
  return (
    <>
      {session && session.user.memberActive ? (
        <AuthenticatedPage title="Home">
          <MemberHome />
        </AuthenticatedPage>
      ) : (
        <>
          <Head>
            <title>Friends</title>
            <meta name="description" content="Friends.nyc" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <div className="card">
              <h5 className="card-header">friends.nyc</h5>
              <div className="card-body">
                <p>
                  <strong>Welcome!</strong>
                </p>
                <p>
                  We&apos;re an invite only community, so unfortunately unless
                  you&apos;ve been invited you won&apos;t be able to get past
                  this screen.
                </p>
                {session ? (
                  <>
                    <div className="alert alert-danger" role="alert">
                      You are logged in, but there is no membership associated
                      with <strong>{session.user.email}</strong>
                    </div>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={(evt) => {
                        evt.preventDefault();
                        signOut();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => signIn("google")}
                  >
                    I&apos;m already a member!
                  </button>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </>
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
