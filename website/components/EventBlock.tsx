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

  const braaiMessage = stripMargin(`
    Hello friends!
    
    I'm hosting another braai (barbecue) on Monday, May
    23rd on my patio. I'll be around from 5pm onwards, so feel free to
    come any time from then onwards. Aiming to have food ready around
    8pm.

    **Food**: I'm planning on making some burgers,
    mushroom burgers, and steak rolls. If you want to bring along a
    salad or any snacking items they&apos;re always encouraged.

    **Drinks**: I'll have some beer and wine, but if
    you want anything specific (or a lot) please bring it along.
    
    **Address**: [${event.address}](${googleUrl})
    
    **Coming?** Please RSVP below.
  `);

  const juneMessage = stripMargin(`
    Hello friends!
    
    I'm hosting event on Saturday, June 18th on my patio. I'll add some more details later, but
    expect chilled sunshine drinks, food and conversation.

    **Timing**: I'm thinking early afternoon, maybe a 1pm potluck?

    Feel free to add an RSVP below, but I'll check in again closer to the time.
  `);

  const description =
    event.id === "cl3ad1bmp0060km59wh60o2h2"
      ? braaiMessage
      : event.id === "cl3ek3sho014309l00gfayij6"
      ? juneMessage
      : "No description found";
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
            <ReactMarkdown>{description}</ReactMarkdown>
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
