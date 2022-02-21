import { signOut, useSession } from "next-auth/react";
import { FunctionComponent } from "react";

export const AuthRequired: FunctionComponent<{}> = ({ children }) => {
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
    return children as any;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
};
