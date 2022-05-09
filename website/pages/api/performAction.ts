import { Action, ActionResponse } from "../../models/Action";
import { sessionAsyncHandler, HttpError } from "../../server/asyncHandler";
import { FriendsSession } from "./auth/[...nextauth]";
import { performAction } from "../../server/performAction";
export default sessionAsyncHandler<Action, ActionResponse & { error?: string }>(
  async function apiPerformAction(session: FriendsSession, action: Action) {
    return performAction(session?.user, action);
  }
);
