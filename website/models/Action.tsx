import { EventInviteResponse } from "@prisma/client";
import { pronounOptions } from "./Person";

interface CreateInviteAction {
  type: "createInvite";
  payload: {
    name: string;
    email?: string;
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
    pronouns: typeof pronounOptions[number];
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

interface UpdateEventAction {
  type: "updateEvent";
  payload: {
    id: string;
    event: {
      description: string;
    };
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
