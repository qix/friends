import { signOut } from "next-auth/react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";

const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "An error occurred while fetching data");
  }
  return res.json();
};

function useCurrentMember() {
  const { data, error } = useSWR(`/api/currentMember`, fetcher);

  return {
    member: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const MemberHome = (props: {}) => {
  const { member, isError, isLoading } = useCurrentMember();

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <main className={styles.main}>
      <div className="card">
        <h5 className="card-header">Welcome Friand</h5>
        <div className="card-body">
          <a
            href={member.discordLink}
            className="btn btn-primary btn-lg"
            role="button"
            target="_blank"
            rel="noreferrer"
          >
            Join the Discord Server
          </a>
        </div>
        <div className="card-body">
          <button
            className="btn btn-outline-secondary"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
};
