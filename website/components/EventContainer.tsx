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

    tabs.push(
      ...Object.entries(tabMap).map(([key, caption]) => {
        return (
          <Link
            href={`/event/${eventSlug}/${key}`}
            className={`nav-link ${page === key ? "active" : ""}`}
          >
            <a>{caption}</a>
          </Link>
        );
      })
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
