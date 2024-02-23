import { signOut } from "next-auth/react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { LoadingSpinner } from "./LoadingSpinner";
import manifesto from "../public/MANIFESTO.md";
import ReactMarkdown from "react-markdown";
import { CurrentMemberResponse } from "../pages/api/currentMember";
import { swrFetcher } from "../server/swrFetcher";
import Link from "next/link";
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
    <div className="card">
      <h5 className="card-header">Welcome Friend</h5>
      {blocks}
      <h5 className="card-header">WhatsApp Group</h5>
      <div className="card-body">
        <p>
          <strong>This link is intended for you alone. Do not share it.</strong>
          <br />
          &gt;{" "}
          <Link href={member.whatsappLink} role="button" rel="noreferrer">
            Click here to join the WhatsApp group
          </Link>
          <br />
          Your cellphone number is registered as: {member.phone}
        </p>
      </div>
      <h5 className="card-header">Invitations</h5>
      <div className="card-body">
        <p>
          You have <strong>one</strong> invite left.
        </p>
        <Link href="/invitations" className="btn btn-primary">
          Click here to invite a friend
        </Link>
      </div>

      <h5 className="card-header">Account</h5>
      <div className="card-body">
        <p>
          You&apos;re signed in as <strong>{member.name}</strong>
        </p>
        <button className="btn btn-outline-secondary" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
};
