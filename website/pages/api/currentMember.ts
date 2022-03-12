import { Action } from "../../models/Action";
import { sessionAsyncHandler, HttpError } from "../../server/asyncHandler";
import { invariant } from "../../server/invariant";

export interface CurrentMemberResponse {
  discordLink: string;
  name: string;
  error?: string;
}

export default sessionAsyncHandler<Action, CurrentMemberResponse>(
  async function currentMember(session, action: Action) {
    invariant(session.user.memberActive, "Expected active member");
    return {
      discordLink: process.env.DISCORD_LINK!,
      name: session.user.memberName!,
    };
  }
);
