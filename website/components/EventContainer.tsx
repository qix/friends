import Link from "next/link";
import { FunctionComponent } from "react";

export const EventContainer: FunctionComponent<{
  isOwner: boolean;
  isLoggedIn: boolean;
  eventSlug: string | null;
  page: "event" | "guests" | "update";
}> = ({ isLoggedIn, isOwner, eventSlug, children, page }) => {
  const tabs: JSX.Element[] = [];

  if (eventSlug && isOwner) {
    const tabMap = {
      event: "Event",
      guests: "Show event guests",
      update: "Update event",
    };

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

  }

  if (isLoggedIn) {
    tabs.push(
      <li className="nav-item">
        <Link href={`/events`} className="nav-link">
          All events
        </Link>
      </li>
    );
  }

  return (
    <>
      {tabs ? <ul className="nav nav-tabs">{tabs}</ul> : null}
      {children}
    </>
  );
};
