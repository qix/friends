import { Action } from "../../models/Action";
import { sessionAsyncHandler, HttpError } from "../../server/asyncHandler";
import { invariant } from "../../jslib/invariant";

export interface CurrentMemberResponse {
  discordLink: string;
  whatsappLink: string;
  name: string;
  email: string;
  phone: string;
  error?: string;
}

export default sessionAsyncHandler<Action, CurrentMemberResponse>(
  async function currentMember(session, action: Action) {
    const user = session.user;
    invariant(user.memberActive, "Expected active member");
    invariant(
      user.email && user.memberName && user.memberPhone,
      "Expected all member fields to be set"
    );

    return {
      discordLink: process.env.DISCORD_LINK!,
      whatsappLink: process.env.WHATSAPP_LINK!,
      name: user.memberName,
      email: user.email,
      phone: user.memberPhone,
    };
  }
);
