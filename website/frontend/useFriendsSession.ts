import { useSession } from "next-auth/react";
import { FriendsSession } from "../pages/api/auth/[...nextauth]";

export function useFriendsSession() {
  const { data: session } = useSession() as {
    data: FriendsSession | null;
  };
  return session;
}
