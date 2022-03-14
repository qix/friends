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

export type Action = AcceptInviteAction | CreateInviteAction;
