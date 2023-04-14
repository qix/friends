import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";
import { AdminContainer } from "./AdminContainer";
import { ReactElement } from "react-markdown/lib/react-markdown";

export const EventContainer: FunctionComponent<{
  isOwner: boolean;
  isLoggedIn: boolean;
  eventSlug: string | null;
  page: "event" | "guests" | "update";
}> = ({ isLoggedIn, isOwner, eventSlug, children, page }) => {

  let wrapped: ReactNode = children;

  if (isLoggedIn) {
    const tabs: Array<{ uri: string, caption: string }> = [];

    if (eventSlug && isOwner) {
      tabs.push(
        { uri: `/event/${eventSlug}`, caption: "Event" },
        { uri: `/event/${eventSlug}/guests`, caption: "Show event guests" },
        { uri: `/event/${eventSlug}/update`, caption: "Update event" },
      );
      tabs.push(
        { uri: '/events', caption: 'All events' });
    }

    wrapped = <AdminContainer tabs={tabs} uri={`/event/${eventSlug}`}>{wrapped}</AdminContainer>
  }

  return <>{wrapped}</>;
};
