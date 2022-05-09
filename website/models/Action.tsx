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

export type Action = AcceptInviteAction | CreateInviteAction | HeartbeatAction;

export type ActionResponse =
  | AcceptInviteResponse
  | CreateInviteResponse
  | HeartbeatResponse;
