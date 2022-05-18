import { RSVPBlock } from "./RSVPBlock";
import Image from "next/image";
import { EventInvite, EventInviteResponse } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export const EventBlock = (props: {
  eventId: string;
  eventAddress?: string;
  eventGooglePlaceId?: string;
  eventNameWithDate: string;
  description: string;
  imageHeader: string;
  eventInvite: Partial<EventInvite>;
}) => {
  const {
    eventId,
    eventAddress,
    eventGooglePlaceId,
    eventNameWithDate,
    imageHeader,
    eventInvite,
  } = props;

  const [currentResponse, setResponse] = useState<EventInviteResponse>(
    eventInvite.response || "NONE"
  );

  const googleUrl =
    `https://www.google.com/maps/search/?api=1&` +
    `query_place_id=${encodeURIComponent(eventGooglePlaceId || "")}&` +
    `query=${encodeURIComponent(eventAddress || "")}`;

  const startIso = "20220523T210000Z";
  const endIso = "20220524T030000Z";
  const calendarUrl =
    `https://www.google.com/calendar/render?action=TEMPLATE&` +
    `text=${encodeURIComponent("Josh Braai")}&` +
    `details=${encodeURIComponent("A braai (barbecue) on Josh's patio")}&` +
    `location=${encodeURIComponent(eventAddress + ", New York")}&` +
    `dates=${encodeURIComponent(startIso)}%2F${encodeURIComponent(endIso)}`;

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
  }

  return (
    <>
      <div className="card">
        <h5 className="card-header">{eventNameWithDate}</h5>
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
            <p>Hello friends!</p>
            <p>
              I&apos;m hosting another braai (<em>barbecue</em>) on Monday, May
              23rd on my patio. I&apos;ll be around from 5pm onwards, so feel
              free to come any time from then onwards. Aiming to have food ready
              around 8pm.
            </p>
            <p>
              <strong>Food</strong>: I&apos;m planning on making some burgers,
              mushroom burgers, and steak rolls. If you want to bring along a
              salad or any snacking items they&apos;re always encouraged.
            </p>
            <p>
              <strong>Drinks</strong>: I&apos;ll have some beer and wine, but if
              you want anything specific (or a lot) please bring it along.
            </p>
            <p>
              <strong>Address</strong>: <a href={googleUrl}>{eventAddress}</a>
            </p>
            <p>
              <strong>Coming?</strong> Please RSVP below.
            </p>
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
          </li>
          {inviteAlert ? (
            <li className="list-group-item">{inviteAlert}</li>
          ) : null}
          <li className="list-group-item">
            <RSVPBlock
              setResponse={setResponse}
              eventId={eventId}
              eventInvite={eventInvite}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
