import { RSVPBlock } from "./RSVPBlock";
import Image from "next/image";
import { Event, EventInvite, EventInviteResponse } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import { FunctionComponent, useState } from "react";
import { invariant } from "../server/invariant";
import { stripMargin } from "../jslib/stripMargin";

export const EventBlock: FunctionComponent<{
  event: Partial<Event>;
  eventNameWithDate: string;
  description: string;
  imageHeader: string;
  eventInvite: Partial<EventInvite>;
}> = ({ event, eventInvite, imageHeader }) => {
  const [currentResponse, setResponse] = useState<EventInviteResponse>(
    eventInvite.response || "NONE"
  );

  const googleUrl =
    `https://www.google.com/maps/search/?api=1&` +
    `query_place_id=${encodeURIComponent(event.googlePlaceId! || "")}&` +
    `query=${encodeURIComponent(event.address! || "")}`;

  const { startAtIso, endAtIso } = event;
  let calendarUrl: string | null = null;
  if (startAtIso && endAtIso) {
    calendarUrl =
      `https://www.google.com/calendar/render?action=TEMPLATE&` +
      `text=${encodeURIComponent(event.calendarTitle || event.name!)}&` +
      `details=${encodeURIComponent(event.calendarDescription || "")}&` +
      `location=${encodeURIComponent(event.address! + ", New York")}&` +
      `dates=${encodeURIComponent([startAtIso, endAtIso].join("/"))}`;
  }

  let inviteAlert: JSX.Element | null = null;
  if (currentResponse === "GOING") {
    inviteAlert = (
      <div className="alert alert-success" role="alert">
        You&apos;ve accepted this invite.
      </div>
    );
  } else if (currentResponse === "NOT_GOING") {
    inviteAlert = (
      <div className="alert alert-dark" role="alert">
        You&apos;ve declined this invite.
      </div>
    );
  } else if (currentResponse === "MAYBE") {
    inviteAlert = (
      <div className="alert alert-warning" role="alert">
        You haven&apos;t given a definitive answer yet... please RSVP below
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h5 className="card-header">{event.name}</h5>
        <div className="card-body">
          <Image
            className="rounded card-img-top"
            layout="responsive"
            src={imageHeader}
            alt=""
            width={630}
            height={211}
          />
        </div>
        <ul className="list-group list-group-flush">
          {eventInvite?.inviteMessage ? (
            <li className="list-group-item">
              <ReactMarkdown>{eventInvite.inviteMessage}</ReactMarkdown>
            </li>
          ) : null}
          <li className="list-group-item">
            <ReactMarkdown>
              {event.description || "No description found."}
            </ReactMarkdown>
            {calendarUrl ? (
              <p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={calendarUrl}
                  className="link-secondary"
                >
                  Add to Google calendar
                </a>
              </p>
            ) : null}
          </li>
          {inviteAlert ? (
            <li className="list-group-item">{inviteAlert}</li>
          ) : null}
          <li className="list-group-item">
            <RSVPBlock
              setResponse={setResponse}
              eventId={event.id!}
              eventInvite={eventInvite}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
