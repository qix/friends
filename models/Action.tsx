interface CreateInviteAction {
  type: "createInvite";
  payload: {
    name: string;
    email: string;
    vouchMessage: string;
    inviteCode?: string;
  };
}

export type Action = CreateInviteAction;
