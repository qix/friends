import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { FunctionComponent } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import styles from "../styles/Home.module.css";
import { usePathname } from "next/navigation";

export const AuthenticatedPage: FunctionComponent<{ title: string }> = ({
  children,
  title,
}) => {
  const { data: session, status } = useSession({ required: true });
  const pathname = usePathname();

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

    const menuItems = [
      { uri: "/", name: "Home" },
      { uri: "/invites", name: "Invitations" },
    ];

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="Friends.nyc" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              friends.nyc
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {menuItems.map((item) => (
                  <li className="nav-item" key={item.uri}>
                    <a
                      className={
                        "nav-link" + (pathname === item.uri ? " active" : "")
                      }
                      href={item.uri}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="navbar-nav">
                <a className={"nav-link"} href="#" onClick={() => signOut()}>
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>
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
