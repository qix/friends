import { Event, EventInviteResponse } from "@prisma/client";
import { pronounOptions } from "./Person";
import { object, string } from "yup";

interface CreateInviteAction {
  type: "createInvite";
  payload: {
    name: string;
    email?: string;
    phone?: string;
    vouchMessage: string;

    // Added on server side
    inviteCode?: string;
  };
}
interface CreateInviteResponse {
  message: string;
  inviteCode: string;
}

interface AcceptInviteAction {
  type: "acceptInvite";
  payload: {
    inviteCode: string;
    name: string;
    email: string;
    phone: string;
    pronouns: (typeof pronounOptions)[number];
    whatDo: string;

    // Added on server side
    inviteId?: string;
  };
}
interface AcceptInviteResponse {
  message: string;
}

interface HeartbeatAction {
  type: "heartbeat";
  payload: {};
}
interface HeartbeatResponse {
  ok: boolean;
}

export interface RSVPAction {
  type: "rsvp";
  payload: {
    eventId: string;
    slug: string | null;
    name?: string;
    comments?: string;
    response: EventInviteResponse;
  };
}
interface RSVPResponse {
  ok: boolean;
}

interface CreateEventAction {
  type: "createEvent";
  payload: {
    name: string;
    slug: string;
  };
}
interface CreateEventResponse {
  ok: boolean;
}

export const EventUpdateKeys = [
  "name",
  "datedName",
  "description",
  "calendarTitle",
  "calendarDescription",
  "metaDescription",
  "address",
  "startAtIso",
  "endAtIso",
  "opengraphImage",
  "headerImage",
] as const;
export const EventUpdateSchema = object({
  name: string(),
  datedName: string(),
  calendarTitle: string(),
  calendarDescription: string(),
  metaDescription: string(),
  address: string(),
  startAtIso: string(),
  endAtIso: string(),
  description: string(),
  opengraphImage: string(),
  headerImage: string(),
});

interface UpdateEventAction {
  type: "updateEvent";
  payload: {
    id: string;
    event: Partial<Pick<Event, (typeof EventUpdateKeys)[number]>>;
  };
}

interface UpdateEventResponse {
  ok: boolean;
}

interface CreateEventInviteAction {
  type: "createEventInvite";
  payload: {
    eventId: string;
    name: string;
    slug: string;
    privateNote: string | null;
    guestCount: number;
  };
}
interface CreateEventInviteResponse {
  ok: boolean;
}

export type Action =
  | AcceptInviteAction
  | CreateInviteAction
  | HeartbeatAction
  | CreateEventAction
  | UpdateEventAction
  | CreateEventInviteAction
  | RSVPAction;

export type ActionResponseByType = {
  heartbeat: HeartbeatResponse;
  acceptInvite: AcceptInviteResponse;
  createInvite: CreateInviteResponse;
  createEvent: CreateEventResponse;
  updateEvent: UpdateEventResponse;
  createEventInvite: CreateEventInviteResponse;
  rsvp: RSVPResponse;
};

export type ActionByType = {
  heartbeat: HeartbeatAction;
  acceptInvite: AcceptInviteAction;
  createInvite: CreateInviteAction;
  createEvent: CreateEventAction;
  updateEvent: UpdateEventAction;
  createEventInvite: CreateEventInviteAction;
  rsvp: RSVPAction;
};
