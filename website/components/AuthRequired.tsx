import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import styles from "../styles/Home.module.css";

export const AuthenticatedPage: FunctionComponent<{ title: string }> = ({
  children,
  title,
}) => {
  const { data: session, status } = useSession({ required: true });

  if (!children) {
    throw new Error("Children required for AuthRequired");
  }

  if (session) {
    const email = session.user?.email;
    if (!email) {
      return (
        <div>
          Email address required with sign-in
          <button className="btn btn-primary" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      );
    }

    // @todo: TypeScript isn't happy with `children` but it seems
    // like it will be hard to fix.
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="Friends.nyc" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="main">
          <main className="container">{children as any}</main>
        </div>
      </>
    );
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <LoadingSpinner />;
};
