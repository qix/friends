import Link from "next/link";
import { FunctionComponent } from "react";

export const EventContainer: FunctionComponent<{
  isOwner: boolean;
  isLoggedIn: boolean;
  eventSlug: string | null;
}> = ({ isLoggedIn, isOwner, eventSlug, children }) => {
  const tabs: JSX.Element[] = [];

  if (eventSlug && isOwner) {
    tabs.push(
      <li className="nav-item active">
        <Link href={`/event/${eventSlug}`}>
          <a className="active nav-link">Event</a>
        </Link>
      </li>,
      <li className="nav-item">
        <Link href={`/event-guests/${eventSlug}`}>
          <a className="nav-link">Show event guests</a>
        </Link>
      </li>
    );
  }

  if (isLoggedIn) {
    tabs.push(
      <li className="nav-item">
        <Link href={`/events`}>
          <a className="nav-link">All events</a>
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
