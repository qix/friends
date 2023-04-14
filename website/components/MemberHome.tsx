import { signOut } from "next-auth/react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { LoadingSpinner } from "./LoadingSpinner";
import manifesto from "../public/MANIFESTO.md";
import ReactMarkdown from "react-markdown";
import { CurrentMemberResponse } from "../pages/api/currentMember";
import { swrFetcher } from "../server/swrFetcher";
function useCurrentMember() {
  const { data, error } = useSWR(`/api/currentMember`, swrFetcher);

  return {
    member: data as CurrentMemberResponse,
    isLoading: !error && !data,
    isError: error,
  };
}

export const MemberHome = (props: {}) => {
  const { member, isError, isLoading } = useCurrentMember();

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <LoadingSpinner />;

  const blocks: JSX.Element[] = [];
  const content: string[] = [];
  const pushRemaining = () => {
    if (content.length) {
      blocks.push(
        <div className="card-body">
          <ReactMarkdown>{content.join("\n")}</ReactMarkdown>
        </div>
      );
      content.length = 0;
    }
  };
  for (const line of manifesto.split(/\n/)) {
    if (line.startsWith("# ")) {
      continue;
    } else if (line.startsWith("## ")) {
      pushRemaining();
      blocks.push(<h5 className="card-header">{line.replace(/^## /, "")}</h5>);
    } else if (content.length || line.trim()) {
      content.push(line);
    }
  }
  pushRemaining();

  return (
    <main className={styles.main}>
      <div className="card">
        <h5 className="card-header">Welcome Friend</h5>
        {blocks}
        <h5 className="card-header">Discord Chat</h5>
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
        <h5 className="card-header">Account</h5>
        <div className="card-body">
          <p>
            You are logged in as <strong>{member.name}</strong>.
          </p>
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
